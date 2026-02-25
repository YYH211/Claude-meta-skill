# Claude Skills Repository

A curated collection of reusable skills for Claude Code. Pick the skills you need and add them to your project to enhance Claude's capabilities.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code Skill](https://img.shields.io/badge/Claude%20Code-Skill-blue)](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/skills)
## 🎯 What is This?

This repository provides ready-to-use skills that extend Claude Code's functionality. Each skill is a self-contained module that teaches Claude how to perform specific tasks or follow particular workflows in your projects.

## 📦 Available Skills

| Skill Name                                         | Description                                                                                           | Source | Installation |
|----------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------|--------------|
| **[create-skill-file](./create-skill-file)**       | Guides Claude in creating well-structured SKILL.md files with templates, examples, and best practices | - | `cp -r create-skill-file .claude/skills/` |
| **[prompt-optimize](./prompt-optimize)**           | Optimize your prompt with Claude                                                                      | - | `cp -r prompt-optimize .claude/skills/` |
| **[deep-reading-analyst](./deep-reading-analyst)** | Comprehensive framework for deep analysis using 10+ thinking models (SCQA, 5W2H, Critical Thinking, Mental Models, First Principles, etc.) | [🔗 GitHub](https://github.com/ginobefun/deep-reading-analyst-skill) | `cp -r deep-reading-analyst .claude/skills/` |
| **[dry-refactoring](./dry-refactoring)**           | Systematic code refactoring following DRY principle with 4-step workflow to eliminate code duplication | - | `cp -r dry-refactoring .claude/skills/` |
| **[frontend-design](./frontend-design)**           | Creates unique, production-grade frontend interfaces with exceptional design quality and creative aesthetics | - | `cp -r frontend-design .claude/skills/` |
| **[mcp-builder](./mcp-builder)**                   | Guide for creating high-quality MCP servers that enable LLMs to interact with external services through tools | - | `cp -r mcp-builder .claude/skills/` |
| **[daily-ai-news](./daily-ai-news)**               | Aggregates and summarizes the latest AI news from multiple sources with concise briefs and direct links | - | `cp -r daily-ai-news .claude/skills/` |
| **[fastgpt-workflow-generator](./fastgpt-workflow-generator)** | Generates production-ready FastGPT workflow JSON from natural language requirements with AI-powered template matching and three-layer validation | - | `cp -r fastgpt-workflow-generator .claude/skills/` |
| **[planning-with-files](./planning-with-files)** | Manus-style workflow using persistent markdown files for planning, progress tracking, and knowledge storage with 3-file pattern | [🔗 GitHub](https://github.com/OthmanAdi/planning-with-files) | `cp -r planning-with-files .claude/skills/` |
| **[local-diff-review](./local-diff-review)**     | Pre-PR local code review skill based on git diff, applies the same three-dimension standards as pr-review (code quality, style guide, common issues checklist) | - | `cp -r local-diff-review .claude/skills/` |

**Total:** 10 skills available

---

### Skill Details

#### 🔧 create-skill-file
**Versions:** [Chinese](./create-skill-file) / [English](./create-skill-file-EN)

A meta-skill that teaches you how to create high-quality SKILL.md files for Claude.

**What's included:**
- ✅ Comprehensive writing guidelines
- ✅ Ready-to-use templates (Basic & Workflow)
- ✅ Real-world examples (Good & Bad practices)
- ✅ Quality checklist and troubleshooting guide

**Trigger Keywords:** `"create skill"`, `"write skill"`, `"SKILL.md"`, `"skill guidelines"`, `"best practices"`

**Installation:**
```bash
# Chinese version
cp -r create-skill-file .claude/skills/

# English version
cp -r create-skill-file-EN .claude/skills/
```

---

#### 🔧 prompt-optimize
**Version:** [Chinese](./prompt-optimize)

An expert prompt engineering skill that transforms Claude into "Alpha-Prompt" - a master prompt engineer who collaboratively crafts high-quality prompts through flexible dialogue.

**What's included:**
- ✅ Expert prompt engineering consultation
- ✅ Advanced cognitive architectures (CoT, ToT, Self-Consistency, ReAct)
- ✅ Security guardrails and safety considerations
- ✅ Architecture upgrade suggestions for simple requirements
- ✅ Collaborative dialogue-based prompt optimization

**Key Features:**
- **Flexible Communication**: Genuine two-way dialogue, not rigid templated questions
- **Proactive Architecture Upgrades**: Suggests advanced techniques like Tree of Thought for creative tasks
- **Security Awareness**: Provides safety recommendations for public-facing AI roles
- **Quality Standards**: Delivers production-ready prompts with clear role definitions and structured outputs

**Trigger Keywords:** `"optimize prompt"`, `"improve prompt"`, `"enhance AI instruction"`, `"prompt engineering"`, `"system instruction"`

**Installation:**
```bash
cp -r prompt-optimize .claude/skills/
```

---

#### 🔧 deep-reading-analyst

A professional skill that transforms surface-level reading into deep learning through systematic analysis using 10+ proven thinking frameworks.

**For detailed documentation, see:** [Deep Reading Analyst Introduction](./skill-intro/depp-reading-analyst-intro.md)

**🔗 GitHub Repository:** https://github.com/ginobefun/deep-reading-analyst-skill/tree/main

**Installation:**
```bash
cp -r deep-reading-analyst .claude/skills/
```

---

#### 🔧 dry-refactoring
**Version:** [Chinese](./dry-refactoring)

A systematic skill that guides code refactoring following the DRY (Don't Repeat Yourself) principle through a proven 4-step workflow.

**What's included:**
- ✅ Step 1: Identify Repetition (obvious and semantic duplication)
- ✅ Step 2: Abstract the Logic (functions, classes, constants)
- ✅ Step 3: Replace Implementation (systematic replacement)
- ✅ Step 4: Verify and Test (unit tests, integration tests, performance)

**Key Features:**
- **Comprehensive Coverage**: Handles copy-paste code, magic numbers, structural and logical repetition
- **Step-by-Step Process**: Clear workflow from identification to verification
- **Real-World Examples**: Complete e-commerce discount calculation refactoring case
- **Best Practices**: Includes common pitfalls, testing strategies, and gradual refactoring approach

**Trigger Keywords:** `"DRY"`, `"code duplication"`, `"refactor repetitive code"`, `"eliminate duplication"`, `"magic numbers"`, `"code smell"`, `"extract function"`

**Installation:**
```bash
cp -r dry-refactoring .claude/skills/
```

---

#### 🔧 frontend-design
**Version:** [Chinese](./frontend-design)

An expert skill for creating unique, production-grade frontend interfaces with exceptional design quality that avoids generic AI aesthetics.

**What's included:**
- ✅ Design thinking framework (Purpose, Style, Constraints, Differentiation)
- ✅ Typography guide (unique font selection, avoid common fonts)
- ✅ Color & theme systems (CSS variables, accessibility)
- ✅ Animation best practices (CSS animations, Framer Motion)
- ✅ Spatial composition techniques (asymmetric layouts, overlapping elements)
- ✅ Background & visual details (gradients, noise textures, glass morphism)

**Key Features:**
- **Bold Aesthetic Choices**: Guides selection of extreme, intentional design styles
- **Anti-Generic AI Design**: Explicitly avoids overused fonts (Inter, Roboto) and cliché color schemes
- **Implementation Complexity Matching**: Complex designs get complex code, minimal designs get precise code
- **Production-Ready Code**: Semantic HTML, accessibility, responsive design, performance optimization

**Trigger Keywords:** `"web component"`, `"landing page"`, `"dashboard"`, `"React component"`, `"UI design"`, `"beautify"`, `"frontend"`

**Installation:**
```bash
cp -r frontend-design .claude/skills/
```

---

#### 🔧 mcp-builder
**Version:** [English](./mcp-builder)

A comprehensive guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools.

**What's included:**
- ✅ Phase 1: Deep Research and Planning (MCP design patterns, API coverage)
- ✅ Phase 2: Tool Design (naming conventions, parameter schemas, error handling)
- ✅ Phase 3: Implementation (FastMCP/Python, MCP SDK/TypeScript)
- ✅ Phase 4: Testing and Publishing (integration tests, documentation)

**Key Features:**
- **Modern MCP Design Patterns**: Balances comprehensive API coverage with specialized workflow tools
- **Framework-Specific Guidance**: Detailed examples for both FastMCP (Python) and MCP SDK (TypeScript)
- **Quality Standards**: Emphasizes clear naming, actionable error messages, and proper context management
- **Complete Workflow**: From initial research through testing and publishing

**Supported Frameworks:**
- FastMCP (Python) - Recommended for rapid development
- MCP SDK (TypeScript/Node.js) - For JavaScript ecosystem integration

**Trigger Keywords:** `"MCP server"`, `"Model Context Protocol"`, `"build MCP"`, `"FastMCP"`, `"MCP SDK"`, `"tool integration"`

**Installation:**
```bash
cp -r mcp-builder .claude/skills/
```

---

#### 🔧 daily-ai-news
**Version:** [Chinese & English](./daily-ai-news)

An intelligent skill that aggregates and summarizes the latest AI news from multiple sources (AI news websites and web search) with concise briefs and direct links to original articles.

**What's included:**
- ✅ Phase 1: Information Gathering (WebSearch + mcp__web_reader__webReader)
- ✅ Phase 2: Content Filtering (last 24-48 hours, deduplication)
- ✅ Phase 3: Categorization (Major Announcements, Research, Industry, Tools, Policy)
- ✅ Phase 4: Output Formatting (structured template with links)
- ✅ Comprehensive news sources database (20+ sources)
- ✅ Search query templates by category
- ✅ Multiple output format templates

**Key Features:**
- **Multi-Source Aggregation**: Fetches from 3-5 major AI news sites plus web search
- **Smart Filtering**: Keeps only recent news (24-48 hours) with major significance
- **Structured Categorization**: 5 categories - Major Announcements, Research & Papers, Industry & Business, Tools & Applications, Policy & Ethics
- **Direct Links**: Every news item includes a direct link to the original article
- **Customization Options**: Focus areas, depth levels, time ranges, and format preferences
- **Bilingual Support**: Works with both Chinese and English news sources

**Trigger Keywords:** `"给我今天的AI资讯"`, `"today's AI news"`, `"AI updates"`, `"latest AI developments"`, `"daily AI briefing"`, `"AI industry news"`, `"artificial intelligence news"`

**Installation:**
```bash
cp -r daily-ai-news .claude/skills/
```

---

#### 🔧 fastgpt-workflow-generator
**Version:** [English](./fastgpt-workflow-generator)

An intelligent skill that automatically generates production-ready FastGPT workflow JSON from natural language requirements using AI-powered semantic template matching and comprehensive three-layer validation.

**What's included:**
- ✅ Phase 1: Requirements Analysis (AI semantic extraction)
- ✅ Phase 2: Template Matching (two-stage: coarse + fine filtering)
- ✅ Phase 3: JSON Generation (NodeId generation, auto-layout, reference handling)
- ✅ Phase 4: Validation (format, connections, logic completeness)
- ✅ Phase 5: Incremental Modification (add/remove/modify nodes)
- ✅ Built-in templates (document translation, sales training, resume screening, financial news)
- ✅ Complete references (40+ node types, validation rules, JSON structure specs)
- ✅ Validation script (Node.js)

**Key Features:**
- **AI-Powered Template Matching**: Two-stage semantic matching (metadata + AI analysis) to find the most similar template
- **Automatic JSON Generation**: Generates complete workflow with semantic NodeIds, auto-layout positions, and proper references
- **Three-Layer Validation**: Format (JSON structure) → Connections (node references) → Logic (workflow completeness)
- **Incremental Modification Support**: Add, delete, or modify nodes in existing workflows
- **Built-in Templates**: 4 production-ready templates covering different domains and complexities
- **Portable Design**: Self-contained with relative paths, works in any project

**Built-in Templates:**
- `文档翻译助手.json` - Simple workflow (document processing)
- `销售陪练大师.json` - Medium complexity (conversational AI)
- `简历筛选助手_飞书.json` - Complex workflow (data + external integration)
- `AI金融日报.json` - Scheduled trigger + multi-agent (news aggregation)

**Reference Format:**
- Array reference: `["nodeId", "key"]` - for direct values
- Template reference: `{{$nodeId.key$}}` - for string interpolation (double braces!)

**Trigger Keywords:** `"create FastGPT workflow"`, `"generate workflow JSON"`, `"design FastGPT application"`, `"工作流"`, `"workflow automation"`, `"multi-agent systems"`, `"FastGPT templates"`

**Installation:**
```bash
cp -r fastgpt-workflow-generator .claude/skills/
```

**Quick Start:**
```
# Example 1: Create from natural language
"生成一个旅游规划的工作流，收集用户的目的地、天数、预算等信息，然后AI生成详细的旅游规划"

# Example 2: Modify existing workflow
"在现有问答工作流前添加知识库搜索节点"

# Example 3: Validate workflow
"验证这个workflow JSON是否正确"
```

---

#### 🔧 planning-with-files
**Version:** [English](./planning-with-files)

A Manus-style workflow skill that transforms how you work with Claude by using persistent markdown files as "working memory on disk" for planning, progress tracking, and knowledge storage.

**🔗 Reference:** Based on [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)

**What's included:**
- ✅ 3-File Pattern System (task_plan.md, notes.md, deliverable.md)
- ✅ Task plan template with phases, decisions, and errors tracking
- ✅ Notes template for research and findings
- ✅ Progress tracking with checkboxes and status updates
- ✅ Knowledge persistence outside attention window
- ✅ Complete workflow loop patterns
- ✅ Real-world examples and anti-patterns

**Key Features:**
- **Persistent Memory**: Store plans, research, and decisions in files instead of context window
- **3-File Pattern**: Systematic approach with task_plan.md (progress), notes.md (research), and deliverable.md (output)
- **Structured Tracking**: Phase-based planning with checkboxes, decisions log, and error tracking
- **Loop-Based Workflow**: Read → Work → Update cycle keeps goals fresh in attention
- **Context Management**: Prevents context stuffing by storing information in files
- **Multi-Session Support**: Persist work across conversation sessions

**The 3-File Pattern:**
- **task_plan.md** - Track phases and progress (update after each phase)
- **notes.md** - Store findings and research (during research)
- **[deliverable].md** - Final output (at completion)

**Core Workflow Loop:**
```
1. Create task_plan.md with goal and phases
2. Research → save to notes.md → update task_plan.md
3. Read notes.md → create deliverable → update task_plan.md
4. Deliver final output
```

**When to Use:**
- Starting complex multi-step projects
- Research tasks requiring information gathering
- Tasks requiring progress tracking across sessions
- User mentions "planning", "organizing work", "tracking progress"
- Need structured output with clear phases

**Trigger Keywords:** `"complex task"`, `"multi-step project"`, `"planning"`, `"organize work"`, `"track progress"`, `"research task"`, `"structured output"`

**Installation:**
```bash
cp -r planning-with-files .claude/skills/
```

**Quick Start:**
```
# Example: Plan a feature implementation
"I need to implement a new authentication system"

→ Claude creates:
  - task_plan.md (phases: design, implementation, testing, deployment)
  - notes.md (stores API research and design decisions)
  - Updates plan after each phase completion
```

---

#### 🔧 local-diff-review
**Version:** [Chinese](./local-diff-review)

A pre-PR self-review skill that runs git diff locally and applies the same three-dimension review standards as a formal PR review — no custom weakening of criteria allowed.

**What's included:**
- ✅ Code quality standards (`code-quality-standards.md`)
- ✅ Common issues checklist (`common-issues-checklist.md`)
- ✅ 5 diff scope modes (unstaged, staged, HEAD, branch-vs-baseline, specific commit)
- ✅ Three-level issue grading (🔴 Critical / 🟡 Suggested / 🟢 Optional)
- ✅ Structured output: change overview → issue list → overall conclusion

**Key Features:**
- **Review First, Fix Later**: Outputs an issue list by default; only modifies code when explicitly asked
- **Actionable Results**: Every issue includes file path, line number, risk explanation, and a concrete fix suggestion
- **Regression Risk Summary**: Highlights i18n, type safety, edge cases, compatibility, and performance impact
- **Consistent Standards**: Strictly reuses the same criteria as `pr-review`; no softened rules

**Trigger Keywords:** `"review 我本地改动"`, `"local diff review"`, `"review 我当前改动"`, `"git diff review"`, `"暂存区 review"`, `"分支差异审查"`, `"提 PR 前 review"`

**Installation:**
```bash
cp -r local-diff-review .claude/skills/
```

**Quick Start:**
```
# Example 1: Review all unstaged changes
"请按 PR 标准 review 我本地当前改动。"

# Example 2: Review only staged changes
"请 review 我的 git diff --staged，只给问题清单。"

# Example 3: Review branch diff against baseline
"请按 FastGPT 规范审查我当前分支相对 upstream/v4.14.7-dev 的改动。"
```

---

## 🚀 How to Use

### Installation Steps

1. **Navigate to your project**
   ```bash
   cd /path/to/your/project
   ```

2. **Create the skills directory** (if not exists)
   ```bash
   mkdir -p .claude/skills
   ```

3. **Copy the skill you want**
   
   Example - Adding the skill creation guide:
   ```bash
   # clone this repository if you haven't already
   git clone https://github.com/YYH211/Claude-meta-skill.git
   
   # For Chinese version
   cp -r /Claude-meta-skill/create-skill-file .claude/skills/

   # OR for English version
   cp -r /Claude-meta-skill/create-skill-file-EN .claude/skills/
   ```

4. **Verify installation**
   ```bash
   ls .claude/skills/
   ```

   You should see your copied skill directory:
   ```
   .claude/skills/
   ├── create-skill-file/    (or create-skill-file-EN/)
   │   ├── SKILL.md
   │   ├── templates/
   │   └── examples/
   ```

### Verifying Configuration

#### ✅ Method 1: Check File Structure

```bash
cat .claude/skills/create-skill-file/SKILL.md | head -10
```

Expected output should show the YAML frontmatter:
```yaml
---
name: create-skill-file
description: Guides Claude in creating well-structured SKILL.md files...
---
```

#### ✅ Method 2: Test with Claude

Start Claude Code and try triggering the skill:

```bash
claude
```

Then ask:
- "Help me create a new skill"
- "I want to write a SKILL.md file"
- "Guide me on skill best practices"

If Claude provides structured guidance referencing templates and examples, the skill is working! 🎉

#### ✅ Method 3: List All Skills

You can check what skills are available by asking Claude:
```
What skills do you have access to?
```
claude response：
```
  1. create-skill-file (Skill 文件创建指南)

  功能: 指导创建结构良好的 SKILL.md 文件

  触发场景:
  - 当你询问如何创建 Skill
  - 需要编写 SKILL.md 文档
  - 想了解 Skill 编写最佳实践

  核心能力:
  - 提供清晰的命名、结构和内容组织指南
  - 包含模板和示例
  - 质量检查清单
  - 常见问题解答

  位置: .claude/skill/create-skill-file/SKILL.md

```

Or manually check:
```bash
find .claude/skills -name "SKILL.md" -exec grep -A 2 "^name:" {} \;
```
---

## 💡 Usage Examples

### Example 1: Creating a New Skill

```
You: "I need to create a skill for managing Docker deployments"

Claude: [Uses create-skill-file skill]
"I'll help you create a Docker deployment skill. Let's start by following
the skill creation guidelines..."
```

### Example 2: Improving Existing Skills

```
You: "Can you review my database-migration skill and suggest improvements?"

Claude: [References best practices from create-skill-file]
"Let me review your skill against the best practices checklist..."
```

---

## 🛠️ Troubleshooting

### Skill Not Working

| Problem | Solution |
|---------|----------|
| Claude doesn't use the skill | Verify the skill is in `.claude/skills/` directory |
| Skill file not found | Check that SKILL.md exists and has valid frontmatter |
| Wrong skill activates | Make description more specific with unique keywords |
| Skill seems ignored | Try using explicit trigger keywords from the description |

### Common Issues

**Q: Do I need to restart Claude after adding a skill?**
A: Typically yes. Restart your Claude Code session after adding new skills.

**Q: Can I modify the skills?**
A: Absolutely! Feel free to customize them for your project needs.

**Q: How many skills can I have?**
A: No hard limit, but keep it manageable (5-10 skills per project is typical).

**Q: Can I use multiple skills together?**
A: Yes! Claude can use multiple skills in the same conversation as needed.

---

## 🚧 Coming Soon

This repository will grow with more useful skills:

- [ ] **code-review-workflow** - Systematic code review process
- [ ] **api-documentation-generator** - Generate API docs from code
- [ ] **testing-strategy** - Guide for writing comprehensive tests
- [ ] **deployment-checklist** - Pre-deployment verification
- [ ] **refactoring-guide** - Code refactoring best practices

**Want to contribute?** Create a skill following the guidelines in `create-skill-file` and submit it!

---

## 📚 Resources

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Agent Skills Official Guide](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [Best Practices](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=YYH211/Claude-meta-skill&type=Date)](https://star-history.com/#YYH211/Claude-meta-skill&Date)

---

## 🤝 Partner Projects

### FastGPT

[FastGPT](https://github.com/labring/FastGPT) is a knowledge-based platform built on the LLM, offers out-of-the-box data processing and model invocation capabilities, allows for workflow orchestration through Flow visualization.

---

## 🤝 Contributing

Have a useful skill to share? We'd love to include it!

1. Create your skill following the `create-skill-file` guidelines
2. Test it thoroughly in real projects
3. Include clear documentation and examples
4. Submit via pull request or issue

---

## 📄 License

Free to use for any purpose. Customize and adapt as needed for your projects.

---

**Happy coding with Claude!** 🚀
