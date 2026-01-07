# FastGPT Workflow Validation Rules

Complete reference for the three-layer validation system.

---

## Overview

The validation system checks workflow JSON at three levels:
1. **Format Validation**: JSON structure and syntax
2. **Connection Validation**: Node references and edges
3. **Logic Validation**: Workflow completeness and correctness

---

## Level 1: Format Validation

### Required Top-Level Fields

```json
{
  "nodes": [],      // ✅ Required, must be non-empty array
  "edges": [],      // ✅ Required, can be empty array
  "chatConfig": {}  // ✅ Required, must be object
}
```

### Node Required Fields

Each node must contain:
- `nodeId` (string, unique)
- `name` (string)
- `flowNodeType` (string, valid type)
- `position` (object with x, y numbers)
- `inputs` (array)
- `outputs` (array)

### Valid Node Types

Common types (see node_types_reference.md for complete list):
- `workflowStart`, `userGuide`, `chatNode`, `answerNode`
- `datasetSearchNode`, `httpRequest468`, `code`
- `ifElseNode`, `loop`, `loopStart`, `loopEnd`

### ChatConfig Structure

```json
{
  "welcomeText": "string",
  "variables": [],
  "questionGuide": {"open": boolean},
  "fileSelectConfig": {"canSelectFile": boolean, "canSelectImg": boolean}
}
```

---

## Level 2: Connection Validation

### Edge Format

```json
{
  "source": "nodeId",
  "target": "nodeId",
  "sourceHandle": "nodeId-source-right",
  "targetHandle": "nodeId-target-left"
}
```

**Handle Format Rules**:
- Source: `{nodeId}-source-{direction}`
- Target: `{nodeId}-target-{direction}`
- Direction: `left`, `right`, `top`, `bottom`

### Node Reference Validation

**Array Format**:
```json
"value": ["sourceNodeId", "outputKey"]
```

**Checks**:
- ✅ sourceNodeId exists in nodes
- ✅ outputKey exists in source node's outputs
- ✅ Value types match

**Template Format**:
```json
"value": "Text with {{$nodeId.key$}} reference"
```

**Checks**:
- ✅ nodeId exists in nodes
- ✅ key exists in node's outputs

---

## Level 3: Logic Validation

### Required Nodes

✅ Must have `workflowStart` node
✅ Must have at least one output node (answerNode or pluginOutput)
✅ Should have `userGuide` node (systemConfig)

### Connectivity Check

All nodes must be reachable from `workflowStart` (except userGuide).

**Algorithm**: Depth-First Search
```
visited = {workflowStart}
for each edge where source in visited:
  add target to visited
report nodes not in visited
```

### Cycle Detection

Cycles are only allowed with `loop` nodes.

**Algorithm**: Detect back edges in DFS
```
If cycle found AND no loop node in cycle:
  Report error
```

### Special Node Validation

**Loop Nodes**:
```json
{
  "flowNodeType": "loop",
  "inputs": [{
    "key": "childrenNodeIdList",
    "value": ["loopStart_id", "processing_id", "loopEnd_id"]
  }]
}
```

**Checks**:
- ✅ Has childrenNodeIdList
- ✅ All child nodes have parentNodeId pointing to this loop
- ✅ Has loopStart and loopEnd in children

---

## Auto-Fix Capabilities

### Level 1 Fixes

```javascript
// Add missing chatConfig
if (!workflow.chatConfig) {
  workflow.chatConfig = {
    welcomeText: "",
    variables: []
  };
}

// Add default positions
nodes.forEach(node => {
  if (!node.position) {
    node.position = {x: 0, y: 0};
  }
});

// Fix template reference format (single brace to double brace)
input.value = input.value.replace(
  /\{(\$[^}]+\$)\}/g,
  '{{$1}}'
);
```

### Level 2 Fixes

```javascript
// Fix handle format
edge.sourceHandle = `${edge.source}-source-right`;
edge.targetHandle = `${edge.target}-target-left`;

// Remove invalid edges
edges = edges.filter(edge =>
  nodeIds.has(edge.source) && nodeIds.has(edge.target)
);
```

### Level 3 Fixes

Level 3 errors typically require manual fixes:
- Adding missing output nodes
- Breaking illegal cycles
- Connecting unreachable nodes

---

## Validation Error Messages

### Format Errors

```
❌ Missing required field: nodes[2].position
   Fix: Add position object with x and y coordinates

❌ Invalid flowNodeType: "aiChat"
   Fix: Use "chatNode" instead

❌ Invalid JSON: Unexpected token at line 45
   Fix: Check for trailing commas or missing quotes
```

### Connection Errors

```
❌ Reference not found: ["missingNode", "output"]
   Fix: Check nodeId spelling or create the referenced node

❌ Type mismatch: string → number
   Fix: Ensure input valueType matches output valueType

❌ Invalid handle format: "node1-output"
   Fix: Use "node1-source-right" format
```

### Logic Errors

```
❌ Missing required node: workflowStart
   Fix: Add workflow start node with flowNodeType: "workflowStart"

❌ Unreachable nodes: [node3, node4]
   Fix: Add edges connecting these nodes to workflow

❌ Illegal cycle detected: node1 → node2 → node1
   Fix: Use loop node or break the cycle
```

---

## Validation Report Format

```json
{
  "validation": {
    "level1_format": {
      "valid": true,
      "errors": [],
      "warnings": []
    },
    "level2_connections": {
      "valid": false,
      "errors": [
        {
          "level": "error",
          "field": "nodes[3].inputs[1].value",
          "message": "Referenced node not found: nonexistentNode",
          "suggestion": "Check node IDs or create the missing node"
        }
      ],
      "warnings": []
    },
    "level3_logic": {
      "valid": true,
      "errors": [],
      "warnings": [
        {
          "level": "warning",
          "message": "Node 'processingNode' has no output connections",
          "suggestion": "Connect this node to an output or delete it"
        }
      ]
    },
    "overall": {
      "passed": false,
      "criticalErrors": 0,
      "errors": 1,
      "warnings": 1
    }
  }
}
```

---

## Validation Checklist

### Before Import to FastGPT

- [ ] Level 1: Format validation passes
- [ ] Level 2: All connections valid
- [ ] Level 3: Logic complete
- [ ] No critical errors
- [ ] Warnings reviewed and addressed

### Runtime Validation

After importing to FastGPT:
- [ ] All nodes appear correctly
- [ ] Connections display properly
- [ ] Test run completes without errors
- [ ] Output matches expectations

---

**See Also**:
- `node_types_reference.md` - Valid node types
- `json_structure_spec.md` - Complete JSON format
- `../scripts/validate_workflow.js` - Validation script
