---
name: fastgpt-workflow-generator
description: Generates production-ready FastGPT workflow JSON from natural language requirements. Uses AI-powered semantic template matching from built-in workflows (document translation, sales training, resume screening, financial news). Performs three-layer validation (format, connections, logic completeness). Supports incremental modifications to add/remove/modify nodes. Activates when user asks to "create FastGPT workflow", "generate workflow JSON", "design FastGPT application", or mentions workflow automation, multi-agent systems, or FastGPT templates.
---

# FastGPT Workflow Generator

> Automatically generate production-ready FastGPT workflow JSON from natural language requirements

## When to Use This Skill

Use this skill when you need to:

- **Create new workflows from scratch**: User asks to "create a FastGPT workflow for X purpose"
- **Generate based on templates**: User wants to build workflows similar to existing patterns (document processing, AI chat, data analysis, multi-agent systems)
- **Modify existing workflows**: User needs to add/remove/update nodes in an existing workflow JSON
- **Validate workflow JSON**: User has a workflow JSON that needs verification or fixing
- **Design multi-agent systems**: User mentions parallel processing, agent coordination, or workflow orchestration
- **Automate workflow creation**: User provides requirements document and needs executable JSON
- **Convert requirements to JSON**: User has specifications and wants a FastGPT-compatible workflow

**Trigger Keywords**: FastGPT, workflow, JSON, multi-agent, 工作流, template matching, workflow automation, node configuration, workflow validation

---

## Core Workflow

This skill follows a 5-phase process to generate production-ready workflow JSON:

### Phase 1: Requirements Analysis

**Goal**: Extract structured requirements from natural language input

**Process**:
1. **Identify request type**:
   - Create from scratch
   - Based on template
   - Modify existing workflow
   - Validate/fix existing JSON

2. **Extract key information using AI semantic analysis**:
   ```json
   {
     "purpose": "Workflow objective (e.g., 'Travel planning assistance')",
     "domain": "Application domain (travel/event/document/data/general)",
     "complexity": "simple | medium | complex",
     "features": ["aiChat", "knowledgeBase", "httpRequest", "parallel"],
     "inputs": ["userChatInput", "city", "date"],
     "outputs": ["Complete plan", "Recommendations"],
     "externalIntegrations": ["Weather API", "Feishu API"],
     "specialRequirements": ["Multi-agent", "Real-time data"]
   }
   ```

3. **Completeness check**: If information is insufficient, clarify through dialogue

**Output**: Structured requirements object

---

### Phase 2: Template Matching

**Goal**: Find the most similar built-in template

**Built-in Templates** (stored in `templates/` directory):
- `templates/文档翻译助手.json` - Simple workflow (document processing)
- `templates/销售陪练大师.json` - Medium complexity (conversational AI)
- `templates/简历筛选助手_飞书.json` - Complex workflow (data processing + external integration)
- `templates/AI金融日报.json` - Scheduled trigger + multi-agent (news aggregation)

**Matching Strategy**:

**Step 1: Coarse Filtering (Metadata-based)**
```
Calculate similarity scores:
- Domain match: travel vs travel = 1.0, travel vs event = 0.3
- Complexity match: simple vs simple = 1.0, simple vs complex = 0.3
- Feature overlap: Jaccard similarity of feature sets
- Node count similarity: 1 - |count1 - count2| / max(count1, count2)

Combined score = 0.3 * domain + 0.2 * complexity + 0.3 * features + 0.2 * nodeCount

Select Top 3 candidate templates
```

**Step 2: Fine Filtering (Semantic Similarity)**
```
For Top 3 candidates:
1. Analyze user requirements vs template characteristics
2. Evaluate workflow structure similarity
3. Calculate comprehensive score

Final score = 0.3 * domain + 0.2 * complexity + 0.3 * features + 0.2 * semantic
```

**Step 3: Selection Strategy**
```
- Highest score < 0.5: Start from blank template
- Highest score 0.5-0.7: Use template as reference, major modifications
- Highest score > 0.7: Use template as base, minor adjustments
```

**Output**:
- Best matching template JSON object
- Matching analysis report
- Modification suggestions list

---

### Phase 3: JSON Generation

**Scenario 1: Generate Based on Template**

```
1. Copy template structure

2. Modify nodes
   - Keep: structurally similar nodes (workflowStart, userGuide)
   - Modify: nodes requiring prompt/parameter adjustments
   - Delete: unnecessary nodes
   - Add: new requirement nodes

3. Regenerate NodeId
   function generateNodeId(nodeType, nodeName, existingIds) {
     // Fixed ID mapping
     if (nodeType === 'workflowStart') return 'workflowStart';
     if (nodeType === 'userGuide' || nodeType === 'systemConfig') return 'userGuide';

     // Generate semantic ID (camelCase)
     const baseName = nodeName.replace(/[\s\u4e00-\u9fa5]+/g, '');
     let nodeId = baseName ? `${baseName}Node` : `${nodeType}Node`;

     // Ensure uniqueness
     let counter = 1;
     while (existingIds.has(nodeId)) {
       nodeId = `${baseName}Node_${counter}`;
       counter++;
     }

     return nodeId;
   }

4. Update references
   - Traverse all inputs, replace old nodeId with new nodeId
   - Update edges' source/target
   - Handle two reference formats:
     - Array: ["nodeId", "key"]
     - Template: {{$nodeId.key$}}  (Note: double braces with single $)

5. Auto-layout positions (hierarchical layout algorithm)
   function autoLayout(nodes, edges) {
     // Topological sort to determine layers
     const layers = topologicalLayering(nodes, edges);

     // Calculate positions for each layer
     const LAYER_GAP_X = 350;
     const NODE_GAP_Y = 150;

     layers.forEach((layer, layerIndex) => {
       const x = -200 + layerIndex * LAYER_GAP_X;
       const totalHeight = (layer.length - 1) * NODE_GAP_Y;
       const startY = -totalHeight / 2;

       layer.forEach((nodeId, nodeIndex) => {
         positions[nodeId] = {
           x: x,
           y: startY + nodeIndex * NODE_GAP_Y
         };
       });
     });

     // Fixed position for special nodes
     positions['userGuide'] = { x: -600, y: -250 };
   }

6. Update configuration
   - Modify chatConfig.welcomeText
   - Update chatConfig.variables
```

**Scenario 2: Create from Scratch**

```
1. Determine node list
   - Required: workflowStart, userGuide
   - Add based on features: chatNode, datasetSearchNode, httpRequest468, etc.
   - Required: answerNode (output node)

2. Generate nodes and connections
   - Use standard node templates
   - Fill required fields
   - Customize inputs/outputs based on requirements

3. Calculate positions and generate configuration
```

**Output**: Complete FastGPT workflow JSON

---

### Phase 4: Validation

**Level 1: JSON Format Validation**
```
✅ JSON is parseable
✅ Top level contains nodes, edges, chatConfig
✅ Each node contains: nodeId, name, flowNodeType, position, inputs, outputs
✅ flowNodeType is in valid type list (40+ types)
✅ position contains x, y numeric coordinates
```

**Level 2: Node Connection Validation**
```
✅ edges' source/target nodes exist
✅ sourceHandle/targetHandle format correct (nodeId-source-right, nodeId-target-left)
✅ Node input references' nodes and output keys exist
✅ Reference types match (string → string)
✅ Template references {{$nodeId.key$}} nodes and keys exist
✅ No self-loops, no duplicate connections
```

**Level 3: Logic Completeness Validation**
```
✅ Required nodes exist (workflowStart, userGuide, at least one output node)
✅ All nodes reachable from workflowStart (connectivity)
✅ No illegal cycles (unless using loop node)
✅ loop nodes correctly configured with parentNodeId and childrenNodeIdList
✅ No dead ends (non-output nodes without outgoing edges)
✅ All required inputs have values
```

**Output**: Validation report (containing errors, warnings, fix suggestions)

---

### Phase 5: Incremental Modification (Optional)

**Use Cases**: Add/delete/modify nodes

**Processing Steps**:

**1. Understand modification intent**
```
Use AI to analyze user request, extract:
{
  "action": "add" | "delete" | "modify" | "reconnect",
  "targetNodes": ["aiChatNode"],
  "insertBefore": "aiChatNode",
  "newNodes": [{ "type": "datasetSearchNode", "name": "Knowledge Base Search" }],
  "modifications": {
    "aiChatNode": {
      "inputs": { "quoteQA": ["knowledgeBaseSearch", "searchResult"] }
    }
  }
}
```

**2. Execute modifications**
```
- Add node: generate new node, reconnect, calculate position
- Delete node: remove node, bypass reconnect, clean references
- Modify node: update inputs/outputs, validate references
```

**3. Re-layout and validate**

---

## Examples

### Example 1: Simple AI Q&A Workflow

**User Request**:
```
"Create a simple AI Q&A workflow where users input questions and AI responds directly"
```

**Skill Processing**:

1. **Requirements Analysis**
   ```json
   {
     "purpose": "AI question answering",
     "domain": "general",
     "complexity": "simple",
     "features": ["aiChat"],
     "inputs": ["userChatInput"],
     "outputs": ["AI response"]
   }
   ```

2. **Template Matching**
   - `文档翻译助手.json` - Score: 0.85 (simple workflow, direct processing)

3. **JSON Generation**
   - Use template, modify systemPrompt and welcomeText

4. **Validation Result**
   - ✅ All three layers pass validation

**Generated JSON** (key parts):

```json
{
  "nodes": [
    {
      "nodeId": "userGuide",
      "name": "System Configuration",
      "flowNodeType": "userGuide",
      "position": {"x": -600, "y": -250}
    },
    {
      "nodeId": "workflowStart",
      "name": "Start",
      "flowNodeType": "workflowStart",
      "position": {"x": -150, "y": 100},
      "outputs": [
        {"key": "userChatInput", "type": "static", "valueType": "string"}
      ]
    },
    {
      "nodeId": "aiChatNode",
      "name": "AI Response",
      "flowNodeType": "chatNode",
      "position": {"x": 200, "y": 100},
      "inputs": [
        {
          "key": "model",
          "valueType": "string",
          "value": "gpt-4"
        },
        {
          "key": "systemPrompt",
          "valueType": "string",
          "value": "You are a professional AI assistant that can answer various questions. Please provide accurate and helpful answers based on user questions."
        },
        {
          "key": "userChatInput",
          "valueType": "string",
          "value": ["workflowStart", "userChatInput"]
        }
      ],
      "outputs": [
        {"key": "answerText", "type": "static", "valueType": "string"}
      ]
    },
    {
      "nodeId": "outputNode",
      "name": "Output Answer",
      "flowNodeType": "answerNode",
      "position": {"x": 550, "y": 100},
      "inputs": [
        {
          "key": "text",
          "valueType": "string",
          "value": ["aiChatNode", "answerText"]
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "workflowStart",
      "target": "aiChatNode",
      "sourceHandle": "workflowStart-source-right",
      "targetHandle": "aiChatNode-target-left"
    },
    {
      "source": "aiChatNode",
      "target": "outputNode",
      "sourceHandle": "aiChatNode-source-right",
      "targetHandle": "outputNode-target-left"
    }
  ],
  "chatConfig": {
    "welcomeText": "Welcome to the AI Q&A assistant! Please enter your question.",
    "variables": []
  }
}
```

---

### Example 2: Document Translation Workflow (Based on Template)

**User Request**:
```
"Create a document translation workflow that translates user-uploaded documents from Chinese to English"
```

**Skill Processing**:

1. **Requirements Analysis**
   ```json
   {
     "purpose": "Document translation",
     "domain": "document",
     "complexity": "medium",
     "features": ["readFiles", "aiChat", "textOutput"],
     "inputs": ["userFiles"],
     "outputs": ["translated document"]
   }
   ```

2. **Template Matching**
   - `文档翻译助手.json` - Score: 0.95 (perfect match!)

3. **JSON Generation**
   - Use template directly, only adjust language direction in prompt

**Generated Workflow Structure**:
```
workflowStart → readFiles → translateNode → outputNode
```

**Key Node Configuration**:
- **readFiles Node**: Reads user-uploaded files
- **translateNode (chatNode)**: AI translates with specialized prompt
- **outputNode (answerNode)**: Outputs translated text

---

### Example 3: Incremental Modification (Add Knowledge Base)

**User Request**:
```
"I have an existing AI Q&A workflow (simple_qa_workflow.json),
I want to search the knowledge base first before AI answers,
find relevant information then generate response"
```

**Existing Workflow Structure**:
```
workflowStart → aiChatNode → outputNode
```

**Modification Goal**:
```
workflowStart → knowledgeBaseSearch → aiChatNode → outputNode
```

**Skill Processing**:

1. **Analyze Modification Intent**
   ```json
   {
     "action": "add",
     "targetNodes": ["aiChatNode"],
     "insertBefore": "aiChatNode",
     "newNodes": [
       {
         "type": "datasetSearchNode",
         "name": "Knowledge Base Search"
       }
     ],
     "modifications": {
       "aiChatNode": {
         "inputs": {
           "quoteQA": ["knowledgeBaseSearch", "searchResult"]
         }
       }
     }
   }
   ```

2. **Execute Modification**
   - Add `knowledgeBaseSearch` node
   - Modify edge: `workflowStart → knowledgeBaseSearch`
   - Add edge: `knowledgeBaseSearch → aiChatNode`
   - Modify aiChatNode's inputs (add quoteQA)

3. **Re-layout Positions**
   - workflowStart: (-150, 100)
   - knowledgeBaseSearch: (50, 100) ← newly inserted
   - aiChatNode: (400, 100) ← shifted right
   - outputNode: (750, 100) ← shifted right

4. **Validation Result**
   - ✅ All validations pass

**Modified JSON** (new and modified parts):

```json
{
  "nodes": [
    {
      "nodeId": "knowledgeBaseSearch",
      "name": "Knowledge Base Search",
      "flowNodeType": "datasetSearchNode",
      "position": {"x": 50, "y": 100},
      "inputs": [
        {
          "key": "datasetIds",
          "valueType": "selectDataset",
          "value": [],
          "required": true
        },
        {
          "key": "searchQuery",
          "valueType": "string",
          "value": ["workflowStart", "userChatInput"],
          "required": true
        },
        {
          "key": "similarity",
          "valueType": "number",
          "value": 0.5
        },
        {
          "key": "limitCount",
          "valueType": "number",
          "value": 5
        }
      ],
      "outputs": [
        {
          "key": "searchResult",
          "type": "static",
          "valueType": "datasetQuote"
        }
      ]
    },
    {
      "nodeId": "aiChatNode",
      "inputs": [
        {
          "key": "quoteQA",
          "valueType": "datasetQuote",
          "value": ["knowledgeBaseSearch", "searchResult"]
        }
      ]
    }
  ],
  "edges": [
    {
      "source": "workflowStart",
      "target": "knowledgeBaseSearch"
    },
    {
      "source": "knowledgeBaseSearch",
      "target": "aiChatNode"
    },
    {
      "source": "aiChatNode",
      "target": "outputNode"
    }
  ]
}
```

**Modification Summary Report**:
- ✅ Added 1 node: `knowledgeBaseSearch` (datasetSearchNode)
- ✅ Modified 1 node: `aiChatNode` (added quoteQA input)
- ✅ Added 1 edge: `knowledgeBaseSearch → aiChatNode`
- ✅ Modified 1 edge: `workflowStart → knowledgeBaseSearch` (originally `workflowStart → aiChatNode`)
- ✅ Re-layouted all positions

---

## Technical Implementation

### NodeId Generation Algorithm

**Rules**:
1. Fixed IDs: `workflowStart`, `userGuide` (systemConfig)
2. Semantic naming: Generate based on node name (remove spaces and Chinese, convert to camelCase)
3. Uniqueness guarantee: If conflict, add `_1`, `_2` suffix

**Examples**:
- `generateNodeId('chatNode', 'Travel Planning Assistant')` → `TravelPlanningAssistantNode`
- `generateNodeId('httpRequest468', 'Weather Query')` → `WeatherQueryNode`
- `generateNodeId('chatNode', 'Assistant', {TravelPlanningAssistantNode})` → `AssistantNode_1`

### Position Auto-Layout Algorithm

**Algorithm**: Hierarchical Layout

**Steps**:
1. Topological sort to determine layers (BFS)
2. Calculate horizontal position and vertical spacing for each layer
3. Fixed position for special nodes (userGuide: {x: -600, y: -250})

**Parameters**:
- LAYER_GAP_X = 350 (horizontal spacing between layers)
- NODE_GAP_Y = 150 (vertical spacing within layer)
- START_X = -200, START_Y = 0

### Reference Format Description

**Two Reference Formats**:

**1. Array Format (direct value reference)**:
```json
"value": ["workflowStart", "userChatInput"]
```

**2. Template Syntax (string concatenation)**:
```json
"value": "Please create a plan for me.\n\nDestination: {{$workflowStart.userChatInput$}}\n\nWeather: {{$weatherQueryNode.httpRawResponse$}}"
```

**Important**: Template syntax is `{{$nodeId.key$}}` (double braces with single $)

### Special Node Handling

**loop Node**:
- Must have `childrenNodeIdList` field
- Child nodes must have `parentNodeId` field
- Child nodes include: loopStart, [processing nodes...], loopEnd

**ifElse Node**:
- Has multiple output branches
- Each branch corresponds to different conditions

---

## Best Practices

### Do's (Recommended Practices)

- ✅ **Always validate at three levels** - format, connections, logic
- ✅ **Use meaningful nodeIds** - use semantic names (e.g., `weatherQueryNode`)
- ✅ **Prefer template matching** - template-based generation is more reliable than creating from scratch
- ✅ **Use array references for direct values** - `["nodeId", "key"]`
- ✅ **Use template references for string concatenation** - `{{$nodeId.key$}}`
- ✅ **Auto-layout positions** - use auto-layout algorithm
- ✅ **Include system config node** - always include userGuide
- ✅ **Test with validation** - use built-in validation before importing to FastGPT
- ✅ **Provide clear error messages** - include location and fix suggestions
- ✅ **Document modifications** - generate modification summary report

### Don'ts (Prohibited Practices)

- ❌ **Don't skip validation** - never skip validation
- ❌ **Don't use invalid node types** - check flowNodeType validity
- ❌ **Don't create circular references without loop nodes** - no illegal cycles
- ❌ **Don't forget required fields** - nodeId, name, flowNodeType, position, inputs, outputs
- ❌ **Don't use wrong reference format** - prohibited: `{{nodeId.key}}` (missing $)
- ❌ **Don't ignore warnings** - warnings should be fixed
- ❌ **Don't hardcode positions** - except userGuide, use auto-layout
- ❌ **Don't create unreachable nodes** - ensure reachable from workflowStart
- ❌ **Don't generate overly complex workflows** - workflows with >20 nodes should be split

---

## Troubleshooting

### FAQ

**Q1: Import to FastGPT reports "Invalid node type"**

A: Check the `flowNodeType` field, ensure using supported types. Reference `references/node_types_reference.md`. Common errors:
- `chatNode` is correct (not `aiChat`)
- Number suffixes (like `httpRequest468`) should be retained

**Q2: References between nodes not working**

A: Check reference format:
- ✅ Correct: `["workflowStart", "userChatInput"]` or `{{$workflowStart.userChatInput$}}`
- ❌ Wrong: `{$workflowStart.userChatInput$}` (single brace, should be double)

**Q3: Some nodes not executing at runtime**

A: Use built-in validation to check Level 3, ensure all nodes reachable from workflowStart

**Q4: Parallel nodes not executing in parallel**

A: Ensure multiple nodes' targets are the same aggregation node, and these nodes have no dependencies

**Q5: Loop workflow errors**

A: Must use `flowNodeType: "loop"` node, configure `parentNodeId` and `childrenNodeIdList`

### Debug Checklist

```markdown
## Phase 1: JSON Format Check
- [ ] JSON is parseable
- [ ] Contains nodes, edges, chatConfig
- [ ] All strings use double quotes
- [ ] No trailing commas

## Phase 2: Node Check
- [ ] workflowStart node exists
- [ ] At least one output node exists
- [ ] All flowNodeType valid
- [ ] All nodeId unique
- [ ] All position contains x, y

## Phase 3: Connection Check
- [ ] All edges' source and target exist
- [ ] All handle format correct
- [ ] No duplicate edges, no self-loops

## Phase 4: Reference Check
- [ ] All array references' nodes and keys exist
- [ ] All template references' nodes and keys exist
- [ ] Reference types match

## Phase 5: Logic Check
- [ ] All nodes reachable from workflowStart
- [ ] No illegal cycles
- [ ] No dead-end nodes
- [ ] All required inputs have values

## Phase 6: Runtime Test
- [ ] Import to FastGPT without errors
- [ ] Configure necessary parameters
- [ ] Run test cases
- [ ] Check output meets expectations
```

---

## Quick Reference

### Built-in Template Files

- `templates/文档翻译助手.json` - Simple workflow, document processing
- `templates/销售陪练大师.json` - Medium complexity, conversational AI
- `templates/简历筛选助手_飞书.json` - Complex workflow, data + external integration
- `templates/AI金融日报.json` - Scheduled trigger, multi-agent

### Detailed Documentation

- `references/node_types_reference.md` - Complete reference of 40+ node types
- `references/validation_rules.md` - Detailed three-layer validation rules
- `references/template_matching.md` - Template matching algorithm
- `references/json_structure_spec.md` - Complete FastGPT JSON structure specification

### Example Documents

- `examples/example1_simple_qa.md` - Complete example: Simple Q&A workflow
- `examples/example2_travel_planning.md` - Complete example: Travel planning workflow
- `examples/example3_incremental_modify.md` - Complete example: Incremental modification

### Common Commands

```bash
# Validate workflow JSON
node scripts/validate_workflow.js path/to/workflow.json

# Copy template
cp templates/文档翻译助手.json my_workflow.json

# View template list
ls -lh templates/
```

---

**Version**: 1.0
**Last Updated**: 2025-01-02
**Compatibility**: FastGPT v4.8+
