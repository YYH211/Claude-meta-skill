---
name: software-copyright-writer
description: 根据真实代码仓库、官网页面、运行界面、模块范围和目标软著数量，分析软件著作权（软著）申报方向，拆分可申报主题，检查 Logo、版权、备案、截图和源码等材料约束，生成 3w-4w 字正文、局部代码片段、源码原文、网页截图证据和 .docx 文档。Use when Claude needs to prepare or split legitimate software copyright registration materials from code repositories, product pages, running UI screenshots, module scopes, or source evidence.
---

# Software Copyright Writer

## Overview

使用这个 skill 处理“根据代码仓库和官网材料写软著”的完整流程，而不是只写一篇泛泛的介绍文档。它面向任意软件产品或平台项目，不绑定某个特定产品、技术框架或行业。

先判断仓库里到底能拆出几个像样的软著主题，再补材料、写正文、整理源码原文、抓网页证据、导出 `.docx`。如果仓库体量根本撑不起用户要的数量，直接指出来，不要硬凑题目。

仓库和 GitHub 只作为内部分析输入。最终软著正文必须使用“软件/系统/平台/产品”的正式说明口径，介绍产品功能、业务流程、运行界面和技术实现，不要写成代码仓库分析报告。

## Compliance Boundary

这个 skill 只用于整理真实软件项目的申报材料，不用于伪造软件、伪造截图、伪造权属、虚构功能或包装不存在的源码。

- 不能把设计稿、营销页或登录页冒充实际运行界面
- 不能虚构著作权人、备案页、商标证或版权声明
- 不能为了凑数量强拆高度重复的主题
- 不能把第三方源码、依赖代码或第三方版权信息当作自有源码提交
- 材料不足时必须列缺口和风险，不能直接编造补齐

## Output Mode

默认采用“一次性成稿”模式：

- 只有在主题不明确、数量不合理或材料缺失时，才允许停下来提问或给候选方案
- 一旦主题已经确认、材料已经够用，就不要再输出提纲、半成品、分段草稿或中间解释
- 直接一次性输出完整软著正文，目标体量为“每页 `30` 行、约 `30` 页、总字数 `3w-4w`，通常约 `3.5w`”
- 源码文件同样一次性输出完整结果，不要分批次贴代码
- 如果用户直接要求“给我产 5 份软著”这类批量输出，且信息已经够用，就连续完成全部文档，不逐份中断确认

## Workflow

### 1. 收集输入

先收集这些信息：

- 必填：`代码仓库`、`官网页面`、`软著数量`
- 选填：`指定模块`、`已有截图`、`Logo/商标注册证`、`域名备案页`、`著作权人全称`、`偏粗拆/细拆`

缺少关键输入时，先停在材料确认阶段，不要直接开写。

用 [references/intake-checklist.md](references/intake-checklist.md) 检查材料完整性和硬性约束。

### 2. 理解仓库并生成候选主题

先看仓库结构、README、核心目录和页面入口，判断哪些能力可以独立描述为一个软著主题。

主题必须同时满足这些条件中的大部分：

- 有清晰业务目标
- 有独立功能闭环
- 有可配套的实际运行截图
- 有能指向该主题的代码范围
- 能写出和其他主题明显区分的正文

如果用户指定模块：

1. 先判断模块体量是否足够支撑多个软著
2. 同时给出 `粗拆` 和 `细拆` 两套方案
3. 说明每套方案的边界、风险和适用数量

如果用户没有指定模块：

1. 先识别仓库内可独立申报的候选方向
2. 再按用户要求的数量给主题组合建议
3. 如果数量明显超出仓库体量，直接回绝不合理拆分

主题拆分规则和确认模板见 [references/splitting-rules.md](references/splitting-rules.md)。

### 3. 确认主题或直接进入成稿

如果主题、数量和模块边界还不清楚，先输出候选主题让用户确认。

如果用户已经明确给出：

- 申报主体
- 软著数量
- 指定模块或明确主题
- 足够支撑写作的仓库和页面材料

那就不要再重复走“候选主题确认”流程，直接进入完整成稿。

确认输出里至少要包含：

- 主题名称
- 拆分粒度：`粗拆` 或 `细拆`
- 主题边界
- 主要功能点
- 预计截图来源
- 预计 `8-12` 张截图清单，优先 `10` 张，说明每张截图对应的功能点
- 预计源码范围
- 与其他主题的差异点

软著名称必须以 `系统`、`平台`、`软件` 或 `app软件` 结尾。

### 4. 准备材料和证据

用户确认主题后，再准备每个主题的材料。

必须重点检查这些硬规则：

- 出现 `Logo` 时，必须要求商标注册证
- 文档文字或截图中出现的 `版权所有`，必须与著作权人全称完全一致
- 界面截图必须是软件实际运行界面，不能是设计稿或效果图
- 出现域名时，必须要求域名备案查询结果页
- 源码需满足前 `1500` 行和后 `1500` 行，总计不少于 `3000` 行；不足则提供全部源码
- 保留源码注释，不要删除注释信息
- 不能保留第三方版权信息
- 正文必须扩写到足够支撑“每页 `30` 行、约 `30` 页、总字数 `3w-4w`，通常约 `3.5w`”的申报体量
- 每篇软著默认规划 `8-12` 张界面截图，优先按 `10` 张准备；除非产品界面确实不足，否则不要只放 `3-5` 张截图
- 最终正文不得出现 `GitHub`、`仓库`、`repo`、`README`、`开源地址`、`提交记录`、`分支`、`clone` 等代码托管或代码分析口径，除非它们是软件自身界面中不可避免的功能名称
- 正文不要写“通过分析仓库发现”“本仓库包含”“GitHub 页面显示”等来源性表述；这些只属于内部分析过程，不属于软著产品介绍

如果用户没有给现成网页截图，优先运行 `scripts/fetch_web_evidence.py` 调用浏览器访问官网、产品后台、演示环境或其他实际运行页面并生成截图。截图完成后保留 `manifest.json`，后续导出 `.docx` 时用 `--evidence-manifest` 自动把截图插入正文占位符。只有浏览器无法访问、登录态缺失或页面不可达时，才在正文中保留 `[此处添加对应图片]`。

截图前先做“截图规划”，把当前软著主题拆成更细的功能视角：

- 入口/首页或工作台
- 列表、搜索、筛选或分类视图
- 新建、编辑、配置或导入入口
- 表单、向导、参数配置或上传页面
- 详情页、预览页或结果页
- 状态流转、任务进度或处理结果
- 权限、成员、空间、日志或设置页
- 数据管理、统计、测试或运行反馈页
- 与当前主题强相关的异常提示、空状态或边界状态
- 其他能证明该主题功能闭环的页面

每张截图都必须能对应正文中的一个功能点或业务流程，不要为了凑数量重复截同一个页面。

产品界面截图必须先判断登录状态：

1. 先用 Playwright 打开用户提供的产品界面 URL，并用 `--ready-text` 或 `--wait-selector` 判断是否进入登录后页面。
2. 如果检测到需要登录，必须先让用户在 Playwright 弹出的浏览器窗口中完成授权登录，再继续进入目标页面截图。
3. 登录态优先保存到任务输出目录下的 `browser-profile/` 或 `auth-state.json`，不要复用用户日常 Chrome Profile。
4. 如果用户明确要求“不登录也继续”，才允许加 `--allow-unauthenticated` 继续截图当前页面；此时必须在最终材料中标注截图可能不是完整产品运行界面，必要时保留 `[此处添加对应图片]`。

### 5. 生成每个软著的两类文件

每个软著必须输出两个文件：

1. `主题内容文件`
2. `源码原文文件`

正文模板按主题体量选择：

- 普通单主题：读 [references/template-standard.md](references/template-standard.md)
- 平台型或流程较长主题：读 [references/template-extended.md](references/template-extended.md)

源码原文文件规则见 [references/source-info-template.md](references/source-info-template.md)。

正文文件不是短说明，必须按申报口径一次性写到约 `30` 页、每页 `30` 行左右、总字数 `3w-4w` 的体量，通常控制在 `3.5w` 左右。

正文语言必须是正式软著产品说明语言：

- 以“本软件”“本系统”“该平台”“用户可通过”等表达介绍功能和流程
- 重点写产品功能、界面操作、业务对象、数据处理、运行效果和技术实现
- 可以引用少量局部代码片段说明技术实现，但不要把源码来源、仓库结构、GitHub 页面或 README 内容写进正文
- 多篇软著来自同一项目时，也要用各自产品功能边界来区分，不能用目录名或仓库模块名当正文主叙述

标题层级必须严格递进：

- 一级正文标题用 `## 1. 标题`，编号只有一段
- 二级正文标题用 `### 1.1 标题`，编号必须包含父级编号
- 三级正文标题用 `#### 1.1.1 标题`，编号必须包含父级和二级编号
- 所有 Markdown 标题必须顶格写，行首不能有空格、Tab 或全角空格
- 不允许把标题写进列表、引用、缩进段落或表格单元格里
- `3.1` 下方如继续拆标题，只能写 `3.1.1`、`3.1.2`、`3.1.3`，不能跳成 `3.2.1` 或直接写 `3.1 模块目标`
- 同级标题必须连续编号，不能从 `3.1.1` 跳到 `3.1.3`
- 导出 `.docx` 前会校验标题编号，并会兜底归一化缩进标题；编号不合规时必须先修正文档，不要强行导出

正文里可以加入少量“局部代码片段”，但只能放和当前主题直接相关的关键代码，不能拿大段源码灌水。优先放在：

- 功能模块设计
- 关键业务流程说明
- 关键技术实现

源码文件不要写解释、摘要、目录说明、风险说明。源码文档排版必须按“文件名 -> 原始代码 -> 文件名 -> 原始代码”的顺序组织。

如果已经确认了源码范围，运行：

```bash
python3 scripts/assemble_source_code.py \
  --path repo/module-a \
  --path repo/module-b \
  --output out/source-code.txt
```

该脚本会按“前 `1500` 行 + 后 `1500` 行，不足则全量”的规则输出源码原文，并按文件名分段。

### 6. 导出 `.docx`

正文和源码原文都生成后，如果用户需要正式交付文档，运行：

```bash
python3 scripts/export_ruanzhu_docx.py --content path/to/topic.md --source path/to/source-code.txt --output out/docx
```

该脚本会分别导出正文 `.docx` 和源码 `.docx` 两个文件。

如果已经用 `fetch_web_evidence.py` 生成截图证据，导出时必须传入 `manifest.json`：

```bash
python3 scripts/export_ruanzhu_docx.py \
  --content path/to/topic.md \
  --source path/to/source-code.txt \
  --evidence-manifest out/evidence/manifest.json \
  --output out/docx
```

导出脚本会按 `manifest.json` 中的截图顺序，把正文中的 `[此处添加对应图片]` 逐个替换为实际图片。也可以用 `--image-dir path/to/screenshots` 直接读取某个图片目录。

导出排版默认使用：

- 正文：中文 `宋体`，英文和数字 `Times New Roman`
- 正文字号：`12pt`
- 正文行距：`1.5 倍`
- 一级标题：`黑体`、`16pt`、加粗
- 二级标题：`黑体`、`14pt`、加粗
- 三级标题：`黑体`、`12pt`、加粗
- 源码文档：按文件名分段，文件名单独成行，源码逐行写入，Word 中一行源码对应一行内容

如果正文中需要插入项目截图但当前无法完成截图，必须直接预留占位符：

```text
[此处添加对应图片]
```

### 7. 质检

生成结果后，逐项复核：

- 名称后缀是否合规
- 多个主题是否明显重叠
- 正文和截图是否对得上
- 正文是否使用产品说明口径，且没有把 GitHub、仓库、README、提交记录等内部分析信息写进去
- 标题编号是否严格递进，是否符合 `## 3.` -> `### 3.1` -> `#### 3.1.1` 的层级关系
- `版权所有` 是否完全一致
- 域名是否配有备案页证据
- Logo 是否配有商标证
- 正文是否达到约 `30` 页且总字数达到 `3w-4w`
- 局部代码片段是否与当前主题强相关且数量适中
- 源码文件是否为原始代码而不是解释文档
- 源码文档是否按“文件名 -> 原始代码”分段排版
- 源码范围是否可落到具体目录和文件
- 是否误带第三方版权信息

如果发现高风险问题，先列问题和修正建议，不要把明显会被打回的材料当成成品交出去。

## Scripts

### `scripts/fetch_web_evidence.py`

用这个脚本调用浏览器访问页面并生成截图。

适用场景：

- 用户只给了仓库 URL 和官网 URL，没有配套截图
- 需要给正文补“来源明确、可追溯”的页面证据
- 需要保存页面标题、URL 和抓取时间
- 需要自动访问产品界面并截取实际运行界面
- 产品界面需要登录时，可复用 Playwright `storageState` 登录态

公开页面示例：

```bash
python3 scripts/fetch_web_evidence.py \
  --url https://github.com/openai/openai-cookbook \
  --url https://openai.com \
  --output out/evidence
```

产品页面示例：

```bash
python3 scripts/fetch_web_evidence.py \
  --url https://example.com/dashboard \
  --wait-selector "#app" \
  --selector "main" \
  --viewport-width 1440 \
  --viewport-height 1200 \
  --output out/evidence
```

需要登录的产品界面示例：

```bash
python3 scripts/fetch_web_evidence.py \
  --url https://example.com/dashboard \
  --auth-state auth-state.json \
  --ready-text "工作台" \
  --wait-selector "#app" \
  --output out/evidence
```

需要人工登录时，可以先用可视化浏览器窗口：

```bash
python3 scripts/fetch_web_evidence.py \
  --url https://example.com/dashboard \
  --headed \
  --profile-dir out/browser-profile \
  --ready-text "工作台" \
  --save-auth-state auth-state.json \
  --output out/evidence
```

认证文件规则：

- `--auth-state auth-state.json`：读取 Playwright `storageState` 登录态文件，文件路径由调用者指定。
- `--save-auth-state auth-state.json`：截图结束后把当前登录态保存到指定 JSON 文件。
- `--profile-dir out/browser-profile`：使用持久化浏览器目录，cookie、localStorage 等登录态保存在这个目录里，适合多次复用后台登录。
- 不要把用户日常 Chrome Profile 当作 `--profile-dir`，避免污染用户浏览器数据。
- 如果使用 `--ready-text` 且页面没有进入登录后状态，`--headed` 模式会提示用户在弹出的浏览器里登录，并等待最多 `--login-timeout-ms`。非 `--headed` 模式会直接报错，不截登录页冒充产品界面。
- 只有当用户明确强制不登录继续时，才添加 `--allow-unauthenticated`；该模式不会等待登录，会直接截取当前页面。

脚本会输出：

- 截图文件
- `manifest.json`，用于后续自动插入 `.docx`
- `summary.md`

输入文件也支持批量页面配置：

```text
首页 | https://example.com/dashboard | main
订单页面 | https://example.com/orders | #app
```

需要点击页面菜单后再截图时，可以使用 JSON 配置：

```json
{
  "pages": [
    {
      "name": "产品资料上传界面",
      "url": "https://example.com/workbench",
      "click_texts": ["资料中心", "产品资料库", "新建/导入", "文本资料"]
    }
  ]
}
```

然后运行：

```bash
python3 scripts/fetch_web_evidence.py \
  --input pages.json \
  --profile-dir out/browser-profile \
  --headed \
  --ready-text "工作台" \
  --output out/evidence
```

`--profile-dir` 会复用持久化浏览器登录态，适合任意需要登录的产品后台、管理端或 SaaS 系统。第一次运行时可以在弹出的浏览器里登录，后续同一个目录会继续复用登录状态。

用户强制不登录也继续时：

```bash
python3 scripts/fetch_web_evidence.py \
  --input pages.json \
  --ready-text "工作台" \
  --allow-unauthenticated \
  --output out/evidence
```

为避免误操作，脚本不会自动点击 `确认`、`提交`、`删除`、`保存`、`支付`、`创建` 等可能改变数据的按钮。需要这类动作时，先让用户明确确认，优先只停留在截图所需界面。

### `scripts/assemble_source_code.py`

用这个脚本生成源码原文文件。

适用场景：

- 已经确定某个软著主题对应的源码范围
- 需要按软著规则整理源码
- 需要直接输出原始代码，不要摘要

示例：

```bash
python3 scripts/assemble_source_code.py \
  --path repo/src/module-a \
  --path repo/src/module-b \
  --output out/source-code.txt
```

脚本规则：

- 汇总指定路径内的文本源码
- 保留原始注释
- 按文件名、源码、文件名、源码的顺序排版
- 总行数超过 `3000` 时，输出前 `1500` 行和后 `1500` 行
- 总行数不足 `3000` 时，输出全部源码
- 不自动添加解释性文字

### `scripts/export_ruanzhu_docx.py`

用这个脚本把 Markdown 草稿导出为 `.docx`。

适用场景：

- 已经生成正文和源码原文文件
- 需要交付更正式的文档格式

脚本需要本地 Python 环境安装 `python-docx`。如默认 Python 缺包，可通过 `SOFTWARE_COPYRIGHT_WRITER_PYTHON` 指定另一个 Python 解释器。

截图脚本需要本地 Node.js、Playwright 和 Chrome/Chromium。默认使用 `node`、Node 模块解析路径和常见浏览器路径；如环境不同，可通过 `SOFTWARE_COPYRIGHT_WRITER_NODE`、`SOFTWARE_COPYRIGHT_WRITER_NODE_MODULES`、`SOFTWARE_COPYRIGHT_WRITER_CHROME_PATH` 指定。

依赖安装示例：

```bash
python3 -m pip install -r scripts/requirements.txt
npm install --prefix scripts
npx --prefix scripts playwright install chromium
```

## References

- [references/intake-checklist.md](references/intake-checklist.md)：材料收集和硬性规则检查
- [references/splitting-rules.md](references/splitting-rules.md)：主题拆分规则、命名规则和确认输出
- [references/template-standard.md](references/template-standard.md)：标准版正文模板
- [references/template-extended.md](references/template-extended.md)：扩展版正文模板
- [references/source-info-template.md](references/source-info-template.md)：源码原文文件规则

## Output Rules

默认输出建议：

- 每个软著一个正文 Markdown
- 每个软著一个源码原文文本文件
- 如果抓了网页证据，保留截图和 `manifest.json`
- 如果导出 `.docx`，正文和源码分别导出，不要混成一个文件
- 当输入信息已经完整时，正文必须一次性输出完整成稿，不要先输出提纲、目录草稿或分章半成品
- 正文目标总字数必须落在 `3w-4w`，优先靠近 `3.5w`
- 源码文档必须按文件名分段，逐行保留源码，不允许压缩成一大段
- 用户明确要求 `5` 份或其他固定数量时，如果仓库和材料足以支撑，就直接连续产出对应数量的完整文档

文件命名尽量稳定，例如：

- `xxx-主题内容.md`
- `xxx-源码原文.txt`
- `xxx-主题内容.docx`
- `xxx-源码原文.docx`

## Failure Rules

遇到下面这些情况时，先提示风险，不要硬写：

- 用户要求的软著数量远大于仓库可独立拆分的主题数量
- 用户指定模块体量过小，无法合理拆出多个主题
- 只有设计稿，没有实际运行界面截图
- `版权所有` 与著作权人名称不一致
- 出现 Logo 但没有商标注册证
- 出现域名但没有备案页
- 正文字数明显达不到 `3w` 或明显超过 `4w`
- 源码文件不是原始代码，而是摘要或说明文字
- 源码文档把多行代码压成一坨，无法做到一行源码对应一行文档内容

这种场景下，应该先给用户“缺口清单 + 修正建议 + 可继续的最小范围”。
