import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const payload = JSON.parse(process.argv[2] || "{}");
const pages = Array.isArray(payload.pages)
  ? payload.pages
  : (Array.isArray(payload.urls) ? payload.urls.map((url) => ({ url })) : []);
const outputDir = payload.output_dir;
const timeoutMs = Number(payload.timeout_ms || 20000);
const delayMs = Number(payload.delay_ms || 1500);
const selector = payload.selector || null;
const waitSelector = payload.wait_selector || null;
const globalClickTexts = Array.isArray(payload.click_texts) ? payload.click_texts : [];
const globalReadyTexts = Array.isArray(payload.ready_texts) ? payload.ready_texts : [];
const loginTimeoutMs = Number(payload.login_timeout_ms || 300000);
const allowUnauthenticated = Boolean(payload.allow_unauthenticated);
const viewportWidth = Number(payload.viewport_width || 1440);
const viewportHeight = Number(payload.viewport_height || 1200);
const fullPage = payload.full_page !== false;
const headed = Boolean(payload.headed);
const authState = payload.auth_state || null;
const saveAuthState = payload.save_auth_state || null;
const profileDir = payload.profile_dir || null;
const chromePath = payload.chrome_path;
const require = createRequire(import.meta.url);
const playwrightEntry = process.env.SOFTWARE_COPYRIGHT_WRITER_PLAYWRIGHT_ENTRY || "playwright";
const { chromium } = require(playwrightEntry);

if (!outputDir) {
  console.error("缺少 output_dir");
  process.exit(1);
}

function slugify(value, index) {
  const normalized = String(value)
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${String(index).padStart(2, "0")}-${normalized || "page"}`;
}

function trimText(value, maxLength = 1800) {
  const cleaned = (value || "").replace(/\s+/g, " ").trim();
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}...` : cleaned;
}

await fs.mkdir(outputDir, { recursive: true });

const riskyClickTextPattern = /^(确认|提交|删除|保存|发布|支付|购买|下单|创建|新建)$/;

let browser = null;
let context = null;

if (profileDir) {
  context = await chromium.launchPersistentContext(profileDir, {
    executablePath: chromePath,
    headless: !headed,
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: 1,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
} else {
  browser = await chromium.launch({
    executablePath: chromePath,
    headless: !headed,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });

  context = await browser.newContext({
    viewport: { width: viewportWidth, height: viewportHeight },
    deviceScaleFactor: 1,
    ...(authState ? { storageState: authState } : {}),
  });
}

const manifest = [];

async function clickText(page, text) {
  if (riskyClickTextPattern.test(text)) {
    throw new Error(`为避免误提交或创建数据，拒绝自动点击高风险按钮：${text}`);
  }

  const exact = page.getByText(text, { exact: true }).first();
  if ((await exact.count()) > 0 && (await exact.isVisible().catch(() => false))) {
    await exact.click();
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    return;
  }

  const fuzzy = page.getByText(text).first();
  if ((await fuzzy.count()) > 0 && (await fuzzy.isVisible().catch(() => false))) {
    await fuzzy.click();
    await page.waitForLoadState("domcontentloaded").catch(() => {});
    return;
  }

  throw new Error(`没有找到可点击文字：${text}`);
}

async function isTextVisible(page, text) {
  const exact = page.getByText(text, { exact: true }).first();
  if ((await exact.count()) > 0 && (await exact.isVisible().catch(() => false))) {
    return true;
  }
  const fuzzy = page.getByText(text).first();
  return (await fuzzy.count()) > 0 && (await fuzzy.isVisible().catch(() => false));
}

async function waitForReadyText(page, pageConfig) {
  const readyTexts = [
    ...globalReadyTexts,
    ...(Array.isArray(pageConfig.ready_texts) ? pageConfig.ready_texts : []),
  ];
  if (readyTexts.length === 0) {
    return [];
  }

  for (const text of readyTexts) {
    if (await isTextVisible(page, String(text))) {
      return readyTexts;
    }
  }

  if (!headed) {
    if (allowUnauthenticated) {
      console.error(
        `页面未出现登录后标识文字：${readyTexts.join(" / ")}。用户已允许不登录继续，将截取当前页面。`,
      );
      return [];
    }
    throw new Error(
      `页面未出现登录后标识文字：${readyTexts.join(" / ")}。请使用 --headed --profile-dir 先完成登录。`,
    );
  }

  if (allowUnauthenticated) {
    console.error(
      `页面未出现登录后标识文字：${readyTexts.join(" / ")}。用户已允许不登录继续，将截取当前页面。`,
    );
    return [];
  }

  console.error(
    `页面未出现登录后标识文字：${readyTexts.join(" / ")}。如果当前是登录页，请在弹出的浏览器中完成登录，脚本会继续等待。`,
  );

  const deadline = Date.now() + loginTimeoutMs;
  while (Date.now() < deadline) {
    for (const text of readyTexts) {
      if (await isTextVisible(page, String(text))) {
        return readyTexts;
      }
    }
    await page.waitForTimeout(1000);
  }

  throw new Error(`等待人工登录超时：${readyTexts.join(" / ")}`);
}

async function runActions(page, pageConfig) {
  const clickTexts = [
    ...globalClickTexts,
    ...(Array.isArray(pageConfig.click_texts) ? pageConfig.click_texts : []),
  ];
  for (const text of clickTexts) {
    await clickText(page, String(text));
    await page.waitForTimeout(delayMs);
  }

  const actions = Array.isArray(pageConfig.actions) ? pageConfig.actions : [];
  for (const action of actions) {
    if (action.type === "click_text") {
      await clickText(page, String(action.text || ""));
      await page.waitForTimeout(Number(action.delay_ms || delayMs));
      continue;
    }
    if (action.type === "wait_selector") {
      await page.locator(action.selector).first().waitFor({
        state: action.state || "visible",
        timeout: Number(action.timeout_ms || timeoutMs),
      });
      continue;
    }
    if (action.type === "wait_ms") {
      await page.waitForTimeout(Number(action.value || delayMs));
      continue;
    }
    throw new Error(`不支持的页面动作：${JSON.stringify(action)}`);
  }
}

for (let index = 0; index < pages.length; index += 1) {
  const pageConfig = pages[index];
  const url = pageConfig.url;
  const pageName = pageConfig.name || "";
  const pageSelector = pageConfig.selector || selector;
  const pageWaitSelector = pageConfig.wait_selector || waitSelector;
  const page = await context.newPage();
  try {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs });
    } catch {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
      await page.waitForTimeout(delayMs);
    }
    if (pageWaitSelector) {
      await page.locator(pageWaitSelector).first().waitFor({
        state: "visible",
        timeout: timeoutMs,
      });
    }
    if (delayMs > 0) {
      await page.waitForTimeout(delayMs);
    }
    const readyTexts = await waitForReadyText(page, pageConfig);
    await runActions(page, pageConfig);
    const slug = slugify(pageName || url, index + 1);
    const screenshotName = `${slug}.png`;
    const metaName = `${slug}.json`;
    const screenshotPath = path.join(outputDir, screenshotName);
    const metaPath = path.join(outputDir, metaName);

    const title = await page.title();
    const excerpt = await page.evaluate(() => {
      const root =
        document.querySelector("main") ||
        document.querySelector("article") ||
        document.body;
      return root ? root.innerText || "" : "";
    });

    if (pageSelector) {
      const target = page.locator(pageSelector).first();
      if ((await target.count()) > 0) {
        await target.screenshot({ path: screenshotPath });
      } else {
        await page.screenshot({ path: screenshotPath, fullPage });
      }
    } else {
      await page.screenshot({ path: screenshotPath, fullPage });
    }

    const item = {
      index: index + 1,
      name: pageName,
      url,
      title,
      screenshot: screenshotName,
      meta: metaName,
      selector: pageSelector,
      wait_selector: pageWaitSelector,
      ready_texts: readyTexts,
      allow_unauthenticated: allowUnauthenticated,
      click_texts: [
        ...globalClickTexts,
        ...(Array.isArray(pageConfig.click_texts) ? pageConfig.click_texts : []),
      ],
      actions: Array.isArray(pageConfig.actions) ? pageConfig.actions : [],
      full_page: fullPage,
      viewport: { width: viewportWidth, height: viewportHeight },
      captured_at: new Date().toISOString(),
      excerpt: trimText(excerpt),
    };
    manifest.push(item);
    await fs.writeFile(metaPath, JSON.stringify(item, null, 2), "utf8");
  } finally {
    await page.close();
  }
}

if (saveAuthState) {
  await context.storageState({ path: saveAuthState });
}

await context.close();
if (browser) {
  await browser.close();
}
process.stdout.write(JSON.stringify(manifest, null, 2));
