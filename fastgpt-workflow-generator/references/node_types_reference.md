# FastGPT Node Types Reference

Complete reference for all supported node types in FastGPT workflows.

---

## Node Type Categories

### System Nodes
- `workflowStart` - Workflow entry point
- `userGuide` (systemConfig) - System configuration
- `globalVariable` - Global variables

### AI & Processing Nodes
- `chatNode` - AI conversation
- `agent` - Agent with tool use
- `contentExtract` - Content extraction
- `classifyQuestion` - Question classification

### Data Nodes
- `datasetSearchNode` - Knowledge base search
- `datasetConcatNode` - Knowledge base concatenation

### Integration Nodes
- `httpRequest468` - HTTP request
- `lafModule` - Laf cloud function
- `code` - Code execution

### Control Flow Nodes
- `ifElseNode` - Conditional branching
- `loop`, `loopStart`, `loopEnd` - Loop control
- `stopTool` - Stop tool execution

### Input/Output Nodes
- `answerNode` - Specify reply
- `pluginInput`, `pluginOutput` - Plugin I/O
- `readFiles` - Read files
- `userSelect` - User selection
- `formInput` - Form input

### Utility Nodes
- `variableUpdate` - Variable update
- `textEditor` - Text editing
- `customFeedback` - Custom feedback

---

## Common Node Structures

### workflowStart

```json
{
  "nodeId": "workflowStart",
  "name": "Start",
  "flowNodeType": "workflowStart",
  "position": {"x": -150, "y": 100},
  "inputs": [],
  "outputs": [
    {
      "key": "userChatInput",
      "type": "static",
      "valueType": "string"
    }
  ]
}
```

### chatNode (AI Conversation)

```json
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
      "value": "Your system prompt here"
    },
    {
      "key": "temperature",
      "valueType": "number",
      "value": 0.7
    },
    {
      "key": "maxToken",
      "valueType": "number",
      "value": 2000
    },
    {
      "key": "userChatInput",
      "valueType": "string",
      "value": ["workflowStart", "userChatInput"]
    }
  ],
  "outputs": [
    {
      "key": "answerText",
      "type": "static",
      "valueType": "string"
    },
    {
      "key": "history",
      "type": "static",
      "valueType": "chatHistory"
    }
  ]
}
```

### datasetSearchNode (Knowledge Base)

```json
{
  "nodeId": "knowledgeBaseSearch",
  "name": "Search Knowledge Base",
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
}
```

### httpRequest468

```json
{
  "nodeId": "weatherQuery",
  "name": "Weather API",
  "flowNodeType": "httpRequest468",
  "position": {"x": 300, "y": 100},
  "inputs": [
    {
      "key": "system_httpMethod",
      "value": "GET"
    },
    {
      "key": "system_httpReqUrl",
      "value": "https://api.weather.com/v1?city={$VARIABLE_NODE_ID.city$}"
    },
    {
      "key": "system_httpHeader",
      "value": []
    }
  ],
  "outputs": [
    {
      "key": "httpRawResponse",
      "type": "static",
      "valueType": "any"
    },
    {
      "key": "error",
      "type": "error",
      "valueType": "string"
    }
  ]
}
```

### answerNode (Output)

```json
{
  "nodeId": "outputNode",
  "name": "Output Result",
  "flowNodeType": "answerNode",
  "position": {"x": 550, "y": 100},
  "inputs": [
    {
      "key": "text",
      "valueType": "any",
      "value": ["aiChatNode", "answerText"],
      "required": true
    }
  ],
  "outputs": []
}
```

### ifElseNode (Conditional)

```json
{
  "nodeId": "conditionCheck",
  "name": "Check Condition",
  "flowNodeType": "ifElseNode",
  "position": {"x": 200, "y": 100},
  "inputs": [
    {
      "key": "condition",
      "valueType": "string",
      "value": ["previousNode", "result"]
    },
    {
      "key": "ifList",
      "value": [
        {
          "condition": "contains 'yes'",
          "target": "yesPath"
        },
        {
          "condition": "contains 'no'",
          "target": "noPath"
        }
      ]
    }
  ],
  "outputs": [
    {
      "key": "trueOutput",
      "type": "static",
      "valueType": "any"
    },
    {
      "key": "falseOutput",
      "type": "static",
      "valueType": "any"
    }
  ]
}
```

### loop (Batch Processing)

```json
{
  "nodeId": "batchProcess",
  "name": "Batch Processing",
  "flowNodeType": "loop",
  "position": {"x": 200, "y": 100},
  "inputs": [
    {
      "key": "loopInputArray",
      "valueType": "arrayAny",
      "value": ["previousNode", "items"],
      "required": true
    },
    {
      "key": "childrenNodeIdList",
      "valueType": "arrayString",
      "value": ["loopStartNode", "processingNode", "loopEndNode"]
    }
  ],
  "outputs": [
    {
      "key": "loopArray",
      "type": "static",
      "valueType": "arrayAny"
    }
  ]
}
```

---

## Value Types

### Basic Types
- `string` - Text
- `number` - Numeric value
- `boolean` - True/false
- `object` - JSON object
- `any` - Any type

### Array Types
- `arrayString` - String array
- `arrayNumber` - Number array
- `arrayBoolean` - Boolean array
- `arrayObject` - Object array
- `arrayAny` - Mixed array

### Special Types
- `chatHistory` - Conversation history
- `datasetQuote` - Knowledge base results
- `selectDataset` - Dataset selector
- `dynamic` - Dynamic type

---

## Input Render Types

- `reference` - Reference other node output
- `input` - Single line input
- `textarea` - Multi-line text
- `numberInput` - Number input
- `switch` - Toggle switch
- `select` - Dropdown selection
- `multipleSelect` - Multiple selection
- `JSONEditor` - JSON editor
- `settingLLMModel` - AI model selector
- `selectDataset` - Dataset selector
- `hidden` - Hidden field

---

## Output Types

- `static` - Static output (always available)
- `dynamic` - Dynamic output (conditional)
- `source` - Source output (for tools)
- `error` - Error output
- `hidden` - Hidden output

---

## Special Node Patterns

### Multi-Agent Pattern

```
workflowStart → intentAnalysis
                     ↓
         ┌───────────┼───────────┐
         ↓           ↓           ↓
   agent1Node    agent2Node   agent3Node
         └───────────┼───────────┘
                     ↓
            aggregationNode → output
```

### Loop Pattern

```
Parent Loop Node
  ├─ loopStart (generates items)
  ├─ processingNode (processes each item)
  └─ loopEnd (collects results)
```

### Conditional Pattern

```
workflowStart → ifElseNode ┬→ truePath → output
                           └→ falsePath → output
```

---

## Best Practices

### Node Naming
- Use descriptive names (e.g., "Weather Query" not "Node 1")
- Follow camelCase for nodeId (e.g., "weatherQueryNode")
- Be consistent across workflow

### Input Configuration
- Always set required: true for critical inputs
- Provide default values where appropriate
- Use appropriate render types for user experience

### Output Definition
- Define all outputs explicitly
- Use descriptive keys (e.g., "answerText" not "output1")
- Match value types correctly

---

**See Also**:
- Official FastGPT Documentation
- `json_structure_spec.md` - Complete JSON format
- `validation_rules.md` - Validation requirements
