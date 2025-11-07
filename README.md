# Claude Skills Repository

A curated collection of reusable skills for Claude Code. Pick the skills you need and add them to your project to enhance Claude's capabilities.

## 🎯 What is This?

This repository provides ready-to-use skills that extend Claude Code's functionality. Each skill is a self-contained module that teaches Claude how to perform specific tasks or follow particular workflows in your projects.

## 📦 Available Skills

| Skill Name                                         | Description                                                                                           | Source | Installation |
|----------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------|--------------|
| **[create-skill-file](./create-skill-file)**       | Guides Claude in creating well-structured SKILL.md files with templates, examples, and best practices | - | `cp -r create-skill-file .claude/skills/` |
| **[prompt-optimize](./prompt-optimize)**           | Optimize your prompt with Claude                                                                      | - | `cp -r prompt-optimize .claude/skills/` |
| **[deep-reading-analyst](./deep-reading-analyst)** | Comprehensive framework for deep analysis using 10+ thinking models (SCQA, 5W2H, Critical Thinking, Mental Models, First Principles, etc.) | [🔗 GitHub](https://github.com/ginobefun/deep-reading-analyst-skill) | `cp -r deep-reading-analyst .claude/skills/` |

**Total:** 3 skills available

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
