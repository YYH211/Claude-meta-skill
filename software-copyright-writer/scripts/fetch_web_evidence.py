#!/usr/bin/env python3
"""调用浏览器访问页面并生成软著截图证据。"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


DEFAULT_CHROME_PATHS = [
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    Path("/Applications/Chromium.app/Contents/MacOS/Chromium"),
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="调用浏览器访问页面并生成软著截图证据。")
    parser.add_argument("--url", action="append", default=[], help="待抓取的 URL，可重复传入")
    parser.add_argument(
        "--input",
        help="页面配置文件。支持 JSON，或按行写 URL/name | url/name | url | selector/name | url | selector | wait_selector | click1 > click2",
    )
    parser.add_argument("--output", required=True, help="输出目录")
    parser.add_argument("--timeout-ms", type=int, default=20000, help="页面加载超时，默认 20000")
    parser.add_argument("--selector", help="可选的截图主体选择器")
    parser.add_argument("--wait-selector", help="截图前等待出现的页面选择器")
    parser.add_argument("--click-text", action="append", default=[], help="截图前依次点击的文字，可重复传入")
    parser.add_argument("--ready-text", action="append", default=[], help="登录后页面应出现的文字，可重复传入；未出现时 headed 模式会提示人工登录")
    parser.add_argument("--login-timeout-ms", type=int, default=300000, help="人工登录等待时间，默认 300000")
    parser.add_argument("--allow-unauthenticated", action="store_true", help="用户明确要求不登录也继续时使用；未出现登录后标识也继续截图")
    parser.add_argument("--delay-ms", type=int, default=1500, help="页面加载完成后的额外等待时间")
    parser.add_argument("--viewport-width", type=int, default=1440, help="浏览器视口宽度")
    parser.add_argument("--viewport-height", type=int, default=1200, help="浏览器视口高度")
    parser.add_argument("--no-full-page", action="store_true", help="只截当前视口，不截完整长页面")
    parser.add_argument("--headed", action="store_true", help="显示浏览器窗口，适合人工登录后截图")
    parser.add_argument("--auth-state", help="Playwright storageState JSON，用于复用登录态")
    parser.add_argument("--save-auth-state", help="截图完成后保存 Playwright storageState JSON")
    parser.add_argument("--profile-dir", help="Playwright 持久化浏览器目录，用于复用人工登录后的会话")
    return parser.parse_args()


def parse_input_line(line: str) -> dict:
    if line.startswith("{"):
        return json.loads(line)
    parts = [part.strip() for part in line.split("|")]
    if len(parts) == 1:
        return {"url": parts[0]}
    if len(parts) == 2:
        return {"name": parts[0], "url": parts[1]}
    page = {"name": parts[0], "url": parts[1], "selector": parts[2]}
    if len(parts) >= 4 and parts[3]:
        page["wait_selector"] = parts[3]
    if len(parts) >= 5 and parts[4]:
        page["click_texts"] = [item.strip() for item in parts[4].split(">") if item.strip()]
    if len(parts) >= 6 and parts[5]:
        page["ready_texts"] = [item.strip() for item in parts[5].split(">") if item.strip()]
    return page


def load_pages(args: argparse.Namespace) -> list[dict]:
    pages: list[dict] = [{"url": url} for url in args.url]
    if args.input:
        input_path = Path(args.input)
        raw_input = input_path.read_text(encoding="utf-8")
        if input_path.suffix.lower() == ".json":
            loaded = json.loads(raw_input)
            pages.extend(loaded.get("pages", []) if isinstance(loaded, dict) else loaded)
        else:
            for raw_line in raw_input.splitlines():
                line = raw_line.strip()
                if not line or line.startswith("#"):
                    continue
                pages.append(parse_input_line(line))
    deduped: list[dict] = []
    seen: set[str] = set()
    for page in pages:
        key = json.dumps(page, ensure_ascii=False, sort_keys=True)
        if key not in seen:
            deduped.append(page)
            seen.add(key)
    if not deduped:
        raise SystemExit("至少提供一个 --url 或 --input")
    return deduped


def resolve_node() -> tuple[str, str]:
    node = os.environ.get("SOFTWARE_COPYRIGHT_WRITER_NODE") or shutil.which("node")
    node_modules = os.environ.get("SOFTWARE_COPYRIGHT_WRITER_NODE_MODULES") or ""
    if not node or not Path(node).exists():
        raise SystemExit("未找到 Node 运行时，请安装 Node.js 或通过 SOFTWARE_COPYRIGHT_WRITER_NODE 指定路径。")
    return node, node_modules


def resolve_chrome() -> str:
    chrome = os.environ.get("SOFTWARE_COPYRIGHT_WRITER_CHROME_PATH")
    if chrome and Path(chrome).exists():
        return chrome
    for candidate in DEFAULT_CHROME_PATHS:
        if candidate.exists():
            return str(candidate)
    chrome_bin = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
    if chrome_bin:
        return chrome_bin
    raise SystemExit("未找到 Chrome/Chromium，可通过 SOFTWARE_COPYRIGHT_WRITER_CHROME_PATH 指定浏览器路径。")


def write_summary(output_dir: Path, manifest: list[dict]) -> None:
    lines = ["# 网页证据摘要", ""]
    for item in manifest:
        lines.extend(
            [
                f"## {item['index']}. {item['title'] or item['url']}",
                "",
                f"- URL: {item['url']}",
                f"- 截图: {item['screenshot']}",
                f"- 时间: {item['captured_at']}",
                "",
                item.get("excerpt", ""),
                "",
            ]
        )
    (output_dir / "summary.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


def main() -> None:
    args = parse_args()
    pages = load_pages(args)
    output_dir = Path(args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    node, node_modules = resolve_node()
    chrome = resolve_chrome()
    helper = Path(__file__).with_name("_fetch_web_evidence.mjs")
    if not helper.exists():
        raise SystemExit(f"未找到 helper 脚本：{helper}")

    auth_state = str(Path(args.auth_state).expanduser().resolve()) if args.auth_state else None
    if auth_state and not Path(auth_state).exists():
        raise SystemExit(f"未找到登录态文件：{auth_state}")
    save_auth_state = (
        str(Path(args.save_auth_state).expanduser().resolve()) if args.save_auth_state else None
    )
    profile_dir = str(Path(args.profile_dir).expanduser().resolve()) if args.profile_dir else None

    payload = {
        "pages": pages,
        "output_dir": str(output_dir),
        "timeout_ms": args.timeout_ms,
        "delay_ms": args.delay_ms,
        "selector": args.selector,
        "wait_selector": args.wait_selector,
        "click_texts": args.click_text,
        "ready_texts": args.ready_text,
        "login_timeout_ms": args.login_timeout_ms,
        "allow_unauthenticated": args.allow_unauthenticated,
        "viewport_width": args.viewport_width,
        "viewport_height": args.viewport_height,
        "full_page": not args.no_full_page,
        "headed": args.headed,
        "auth_state": auth_state,
        "save_auth_state": save_auth_state,
        "profile_dir": profile_dir,
        "chrome_path": chrome,
    }
    env = os.environ.copy()
    if node_modules:
        env["NODE_PATH"] = node_modules
        env["SOFTWARE_COPYRIGHT_WRITER_PLAYWRIGHT_ENTRY"] = str(Path(node_modules) / "playwright" / "index.js")

    result = subprocess.run(
        [node, str(helper), json.dumps(payload, ensure_ascii=False)],
        capture_output=True,
        text=True,
        env=env,
        check=False,
    )
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)

    if result.stdout.strip():
        manifest = json.loads(result.stdout)
    else:
        manifest = []
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    write_summary(output_dir, manifest)
    print(f"已输出 {len(manifest)} 条网页证据到 {output_dir}")


if __name__ == "__main__":
    main()
