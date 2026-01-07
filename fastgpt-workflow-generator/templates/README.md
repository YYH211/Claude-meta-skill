# FastGPT Workflow Templates

This directory contains built-in workflow templates used for intelligent template matching and workflow generation.

---

## Built-in Templates

### 1. 文档翻译助手.json
**Type**: Simple Workflow
**Domain**: Document Processing
**Complexity**: Low
**Nodes**: ~8 nodes
**Features**:
- File reading and processing
- AI-powered translation
- Direct text output

**Use Cases**:
- Document translation
- Text processing
- Content conversion
- Simple file operations

---

### 2. 销售陪练大师.json
**Type**: Conversational AI
**Domain**: Sales & Training
**Complexity**: Medium
**Nodes**: ~10 nodes
**Features**:
- Interactive dialogue
- Role-playing scenarios
- Feedback generation
- Multi-turn conversation

**Use Cases**:
- Sales training
- Customer service coaching
- Interview preparation
- Conversational AI applications

---

### 3. 简历筛选助手_飞书.json
**Type**: Complex Workflow with External Integration
**Domain**: Human Resources
**Complexity**: High
**Nodes**: ~15 nodes
**Features**:
- File reading (resumes)
- AI analysis and scoring
- External API integration (Feishu/Lark)
- Data processing and filtering

**Use Cases**:
- Resume screening
- Candidate evaluation
- Data processing with external services
- Multi-step automation workflows

---

### 4. AI金融日报.json
**Type**: Multi-Agent System with Scheduling
**Domain**: News Aggregation
**Complexity**: High
**Nodes**: ~12 nodes
**Features**:
- Scheduled trigger (cron)
- Multi-agent parallel processing
- Content aggregation
- Automated reporting

**Use Cases**:
- News aggregation
- Scheduled content generation
- Multi-agent coordination
- Periodic reporting systems

---

## Using Templates

### In SKILL.md

Templates are referenced using relative paths:

```markdown
- `templates/文档翻译助手.json` - Simple workflow
- `templates/销售陪练大师.json` - Medium complexity
- `templates/简历筛选助手_飞书.json` - Complex + external integration
- `templates/AI金融日报.json` - Scheduled + multi-agent
```

### Template Matching Process

The skill uses a two-stage matching process:

1. **Coarse Filtering**: Based on metadata (domain, complexity, features, node count)
2. **Fine Filtering**: AI semantic analysis of user requirements vs template characteristics

### Matching Score Interpretation

- **< 0.5**: Template not suitable, create from scratch
- **0.5 - 0.7**: Template provides good reference, requires major modifications
- **> 0.7**: Template closely matches, requires minor adjustments

---

## Adding Custom Templates

You can extend the template library by:

### Option 1: Add to This Directory

1. Copy your workflow JSON to `templates/`
2. Ensure it follows FastGPT workflow JSON format
3. The skill will automatically discover and use it for matching

```bash
cp /path/to/your/workflow.json templates/my_custom_workflow.json
```

### Option 2: Configure External Template Directory

In your workflow, you can specify an additional template directory:

```javascript
// In your code or configuration
const TEMPLATE_DIR = '../workflow_temple/';
// Skill will search both built-in templates/ and external directory
```

---

## Template Requirements

For a template to be used effectively:

### Required Fields

✅ Complete `nodes` array with valid FastGPT nodes
✅ Complete `edges` array with correct connections
✅ Valid `chatConfig` with appropriate settings

### Recommended Metadata

For better matching, include in your workflow:

- Clear node naming (semantic, descriptive)
- Logical workflow structure
- Proper node positioning
- Complete input/output definitions

### Quality Guidelines

- **Validated**: Template should pass all three validation levels
- **Tested**: Template should be tested in FastGPT
- **Documented**: Include comments or accompanying documentation
- **Modular**: Use clear node separation for easy modification

---

## Template Characteristics

### Simple Workflows (3-8 nodes)
- Linear flow
- Minimal branching
- Single purpose
- Quick to understand

**Examples**: Document translation, Simple Q&A, Text processing

### Medium Workflows (8-12 nodes)
- Some branching or conditions
- Multiple features
- Moderate complexity
- Well-structured

**Examples**: Sales training, Customer service, Interactive tutorials

### Complex Workflows (12+ nodes)
- Multiple branches
- External integrations
- Parallel processing
- Advanced features

**Examples**: Resume screening with API, Multi-agent systems, Scheduled reports

---

## Template Naming Conventions

### File Naming

- Use descriptive names in Chinese or English
- Include key functionality in name
- Use `.json` extension

**Good Examples**:
- `文档翻译助手.json` - Clear purpose
- `sales_training_bot.json` - Descriptive and specific
- `hr_resume_screener_feishu.json` - Includes integration info

**Avoid**:
- `workflow1.json` - Too generic
- `test.json` - Not descriptive
- `my_workflow.json` - No functional description

---

## Template Structure Reference

### Minimum Valid Template

```json
{
  "nodes": [
    {
      "nodeId": "userGuide",
      "name": "System Configuration",
      "flowNodeType": "userGuide",
      "position": {"x": -600, "y": -250},
      "inputs": [],
      "outputs": []
    },
    {
      "nodeId": "workflowStart",
      "name": "Start",
      "flowNodeType": "workflowStart",
      "position": {"x": -150, "y": 100},
      "inputs": [],
      "outputs": [
        {"key": "userChatInput", "type": "static", "valueType": "string"}
      ]
    },
    {
      "nodeId": "outputNode",
      "name": "Output",
      "flowNodeType": "answerNode",
      "position": {"x": 200, "y": 100},
      "inputs": [
        {
          "key": "text",
          "valueType": "string",
          "value": ["workflowStart", "userChatInput"]
        }
      ],
      "outputs": []
    }
  ],
  "edges": [
    {
      "source": "workflowStart",
      "target": "outputNode",
      "sourceHandle": "workflowStart-source-right",
      "targetHandle": "outputNode-target-left"
    }
  ],
  "chatConfig": {
    "welcomeText": "Welcome!",
    "variables": []
  }
}
```

---

## Troubleshooting

### Template Not Matching

**Issue**: Your custom template is not being selected

**Solutions**:
- Ensure JSON is valid (no syntax errors)
- Check that nodes array is not empty
- Verify all required fields are present
- Review template characteristics match user requirements

### Template Validation Fails

**Issue**: Template doesn't pass validation

**Solutions**:
- Run validation script: `node scripts/validate_workflow.js templates/your_template.json`
- Check for missing required nodes (workflowStart, userGuide)
- Verify all edge references exist
- Ensure no circular dependencies

### Template Causes Errors

**Issue**: Generated workflow from template has issues

**Solutions**:
- Test template in FastGPT first
- Verify all node types are valid
- Check reference formats (`["nodeId", "key"]` or `{$nodeId.key$}`)
- Review node input/output compatibility

---

## Version History

- **v1.0** (2025-01-02): Initial template library
  - Added 4 built-in templates covering simple to complex workflows
  - Established template matching system
  - Created template documentation

---

**Need Help?**

- Review `references/json_structure_spec.md` for FastGPT JSON format
- Check `references/node_types_reference.md` for valid node types
- See `examples/` for complete workflow examples
- Consult main `SKILL.md` for skill usage
