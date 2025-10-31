---
name: create-skill-file
description: Guides Claude in creating well-structured SKILL.md files following best practices. Provides clear guidelines for naming, structure, and content organization to make skills easy to discover and execute.
---

# Claude Agent Skill Writing Guide

> How to create high-quality SKILL.md files

## Table of Contents

- [Quick Start](#quick-start)
- [Core Principles](#core-principles)
- [File Structure Standards](#file-structure-standards)
- [Naming and Description Standards](#naming-and-description-standards)
- [Content Writing Guide](#content-writing-guide)
- [Quality Checklist](#quality-checklist)

---

## Quick Start

### 3 Steps to Create a Skill

**Step 1: Create Directory**

```bash
mkdir -p .claude/skill/your-skill-name
cd .claude/skill/your-skill-name
```

**Step 2: Create SKILL.md**

```markdown
---
name: your-skill-name
description: Brief description with trigger keywords and scenarios
---

# Your Skill Title

## When to Use This Skill

- User asks to [specific scenario]
- User mentions "[keyword]"

## How It Works

1. Step 1: [Action]
2. Step 2: [Action]

## Examples

**Input**: User request
**Output**: Expected result
```

**Step 3: Test**
- Use keywords from description in conversation to trigger
- Observe whether Claude executes correctly
- Adjust based on effectiveness

---

## Core Principles

### 1. Keep It Concise

Only add new knowledge that Claude **doesn't know**:
- ✅ Project-specific workflows
- ✅ Special naming conventions or format requirements
- ✅ How to use custom tools and scripts
- ❌ General programming knowledge
- ❌ Obvious steps

**Example Comparison**:

```markdown
# ❌ Too Detailed
1. Create Python file
2. Import necessary libraries
3. Define functions
4. Write main program logic

# ✅ Concise and Effective
Use `scripts/api_client.py` to call internal API.
Request headers must include `X-Internal-Token` (from environment variable `INTERNAL_API_KEY`).
```

### 2. Set Appropriate Freedom

| Freedom | Use Case | Writing Approach |
|---------|----------|------------------|
| **High** | Requires creativity, multiple solutions | Provide guiding principles, not specific steps |
| **Medium** | Recommended patterns but allow variations | Provide parameterized examples and default flows |
| **Low** | Error-prone, requires strict execution | Provide detailed step-by-step instructions or scripts |

**Decision Criteria**:
- Is there a clear "correct answer"? → Low freedom
- Does it need to adapt to different scenarios? → High freedom
- What's the cost of errors? → High cost = low freedom

### 3. Progressive Disclosure

Organize complex content in layers:

```
SKILL.md (Main document, 200-500 lines)
├── reference.md (Detailed documentation)
├── examples.md (Complete examples)
└── scripts/ (Executable scripts)
```

**Rules**:
- SKILL.md > 500 lines → Split into sub-files
- Sub-files > 100 lines → Add table of contents
- Reference depth ≤ 1 level

---

## File Structure Standards

### YAML Frontmatter

```yaml
---
name: skill-name-here
description: Clear description of what this skill does and when to activate it
---
```

**Field Specifications**:

| Field | Requirements | Description |
|-------|-------------|-------------|
| `name` | Lowercase letters, numbers, hyphens, ≤64 characters | Must match directory name |
| `description` | Plain text, ≤1024 characters | Used for retrieval and activation |

**Naming Prohibitions**:
- ❌ XML tags, reserved words (`anthropic`, `claude`)
- ❌ Vague terms (`helper`, `utility`, `manager`)
- ❌ Spaces or underscores (use hyphens `-`)

**Description Tips**:

```yaml
# ❌ Too Generic
description: Helps with code tasks

# ✅ Specific with Keywords
description: Processes CSV files and generates Excel reports with charts. Use when user asks to convert data formats or create visual reports.

# ✅ States Trigger Scenarios
description: Analyzes Python code for security vulnerabilities using bandit. Activates when user mentions "security audit" or "vulnerability scan".
```

### Directory Organization

**Basic Structure** (Simple Skill):
```
skill-name/
└── SKILL.md
```

**Standard Structure** (Recommended):
```
skill-name/
├── SKILL.md
├── templates/
│   └── template.md
└── scripts/
    └── script.py
```

---

## Naming and Description Standards

### Skill Naming

**Recommended Format**: Verb-ing + noun form

```
✅ Good Names:
- processing-csv-files
- generating-api-docs
- managing-database-migrations

❌ Bad Names:
- csv (too brief)
- data_processor (uses underscores)
- helper (too vague)
```

### Description Writing

**Must use third person**:

```yaml
# ❌ Wrong
description: I help you process PDFs

# ✅ Correct
description: Processes PDF documents and extracts structured data
```

**4C Principles**:
- **Clear**: Avoid jargon and vague terms
- **Concise**: 1-2 sentences explaining core functionality
- **Contextual**: Describe applicable scenarios
- **Complete**: Functionality + trigger conditions

---

## Content Writing Guide

### "When to Use" Section

Clearly state trigger scenarios:

```markdown
## When to Use This Skill

- User asks to analyze Python code for type errors
- User mentions "mypy" or "type checking"
- User is working in a Python project with type hints
- User needs to add type annotations
```

**Patterns**:
- Direct request: "User asks to X"
- Keywords: "User mentions 'keyword'"
- Context: "User is working with X"
- Task type: "User needs to X"

### Workflow Design

**Simple Linear Flow**:

```markdown
## How It Works

1. Scan the project for all `.py` files
2. Run `mypy --strict` on each file
3. Parse error output and categorize by severity
4. Generate summary report with fix suggestions
```

**Conditional Branching Flow**:

```markdown
## Workflow

1. **Check project type**
   - If Django → Use `django-stubs` config
   - If Flask → Use `flask-stubs` config
   - Otherwise → Use default mypy config

2. **Run type checking**
   - If errors found → Proceed to step 3
   - If no errors → Report success and exit
```

**Checklist Pattern** (Validation tasks):

```markdown
## Pre-deployment Checklist

Execute in order. Stop if any step fails.

- [ ] Run tests: `npm test` (must pass)
- [ ] Build: `npm run build` (no errors)
- [ ] Check deps: `npm audit` (no critical vulnerabilities)
```

### Examples and Templates

**Input-Output Examples**:

```markdown
## Examples

### Example 1: Basic Check

**User Request**: "Check my code for type errors"

**Action**:
1. Scan for `.py` files
2. Run `mypy` on all files

**Output**:

   Found 3 type errors in 2 files:
   src/main.py:15: error: Missing return type
   src/utils.py:42: error: Incompatible types

```

### Script Integration

**When to Use Scripts**:
- Simple commands → Describe directly in SKILL.md
- Complex processes → Provide standalone scripts

**Script Writing Standards**:

```python
#!/usr/bin/env python3
"""
Brief description of what this script does.

Usage:
    python script.py <arg> [--option value]
"""

import argparse

DEFAULT_VALUE = 80  # Use constants, not magic numbers

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", help="Directory to process")
    parser.add_argument("--threshold", type=int, default=DEFAULT_VALUE)

    args = parser.parse_args()

    # Validate inputs
    if not Path(args.directory).is_dir():
        print(f"Error: {args.directory} not found")
        return 1

    # Execute
    result = process(args.directory, args.threshold)

    # Report
    print(f"Processed {result['count']} files")
    return 0

if __name__ == "__main__":
    exit(main())
```

**Key Standards**:
- ✅ Shebang line and docstring
- ✅ Type annotations and constants
- ✅ Parameter validation and error handling
- ✅ Clear return values (0=success, 1=failure)

### Best Practices

**Do**:
- ✅ Provide executable commands and scripts
- ✅ Include input-output examples
- ✅ State validation criteria and success conditions
- ✅ Include Do/Don't lists

**Don't**:
- ❌ Include general knowledge Claude already knows
- ❌ Use abstract descriptions instead of concrete steps
- ❌ Omit error handling guidance
- ❌ Use pseudocode instead of real code in examples

---

## Quality Checklist

### Core Quality

- [ ] `name` follows naming conventions (lowercase, hyphens, ≤64 characters)
- [ ] `description` includes trigger keywords and scenarios (≤1024 characters)
- [ ] Name matches directory name
- [ ] Only includes information Claude doesn't know
- [ ] No redundant or duplicate content

### Functional Completeness

- [ ] Has "When to Use" section with 3-5 trigger scenarios
- [ ] Has clear execution flow or steps
- [ ] At least 2-3 complete examples
- [ ] Includes input and expected output
- [ ] Error handling guidance provided

### Structure Standards

- [ ] Clear section organization
- [ ] Table of contents for >200 lines
- [ ] Reference nesting ≤ 1 level
- [ ] All paths use forward slashes `/`
- [ ] Consistent terminology

### Scripts and Templates

- [ ] Scripts include usage instructions and parameter documentation
- [ ] Scripts have error handling
- [ ] Avoid magic numbers, use configuration
- [ ] Template format is clear and usable

### Final Check

- [ ] Read through for fluency and readability
- [ ] Test triggering with actual scenarios
- [ ] Appropriate length (200-500 lines, or split)

---

## FAQ

**Q: How long should a Skill be?**
- Minimum: 50-100 lines
- Ideal: 200-500 lines
- Maximum: 500 lines (split if exceeded)

**Q: How to make Skills easier to activate?**
- Use keywords in `description` that users would say
- State specific scenarios ("when user asks to X")
- Mention related tool names

**Q: What if multiple Skills overlap?**
- Use more specific `description` to differentiate
- Explain relationships in "When to Use"
- Consider merging into one Skill

**Q: Do Skills need maintenance?**
- Review quarterly, update outdated information
- Iterate based on usage feedback
- Update promptly when tools or APIs change

---

## Quick Reference

### Frontmatter Template

```yaml
---
name: skill-name
description: Brief description with trigger keywords
---
```

### Basic Structure Template

```markdown
# Skill Title

## When to Use This Skill
- Scenario 1
- Scenario 2

## How It Works
1. Step 1
2. Step 2

## Examples
### Example 1
...

## References
- [Link](url)
```

---

## Related Resources

- [Claude Agent Skills Official Documentation](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [Best Practices Checklist](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices)
- [Template Files](templates/) - Ready-to-use templates
  - [Basic skill template](templates/basic-skill-template.md)
  - [Workflow skill template](templates/workflow-skill-template.md)
- [Example Library](examples/) - Complete Skill examples
  - [Good examples](examples/good-example.md)
  - [Common mistakes](examples/bad-example.md)

---