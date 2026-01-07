# FastGPT Workflow JSON Structure Specification

Complete specification of the FastGPT workflow JSON format.

---

## Top-Level Structure

```json
{
  "nodes": [],
  "edges": [],
  "chatConfig": {}
}
```

**Required Fields**:
- `nodes` (array): List of workflow nodes
- `edges` (array): Connections between nodes
- `chatConfig` (object): Chat configuration

---

## Node Structure

### Complete Node Schema

```typescript
interface WorkflowNode {
  // Required fields
  nodeId: string;              // Unique identifier
  name: string;                // Display name
  flowNodeType: string;        // Node type (see node_types_reference.md)
  position: {x: number, y: number};  // Canvas position
  inputs: InputItem[];         // Input configuration
  outputs: OutputItem[];       // Output configuration

  // Optional fields
  version?: string;            // Node version
  intro?: string;              // Node description
  avatar?: string;             // Icon path
  showStatus?: boolean;        // Show execution status
  catchError?: boolean;        // Catch errors
  parentNodeId?: string;       // Parent node (for loop children)

  // Plugin-specific
  pluginId?: string;
  isFolder?: boolean;

  // UI state (not required for execution)
  isFolded?: boolean;
}
```

### Node Input Item

```typescript
interface InputItem {
  // Required
  key: string;                 // Input field key
  valueType: WorkflowIOValueType;  // Value type
  renderTypeList: string[];    // UI render types

  // Value
  value?: any;                 // Current value
  defaultValue?: any;          // Default value

  // Validation
  required?: boolean;          // Is required
  min?: number;                // Minimum value/length
  max?: number;                // Maximum value/length
  maxLength?: number;          // Max string length
  minLength?: number;          // Min string length
  step?: number;               // Number step
  precision?: number;          // Decimal precision

  // UI
  label?: string;              // Display label
  description?: string;        // Help text
  placeholder?: string;        // Placeholder text
  toolDescription?: string;    // AI-readable description
  debugLabel?: string;         // Debug label
  valueDesc?: string;          // Value description

  // Options
  list?: Array<{label: string, value: any}>;  // Select options

  // Special configurations
  customInputConfig?: object;  // Custom input config
  datasetOptions?: any[];      // Dataset options
  llmModelType?: string;       // LLM model type

  // Metadata
  canEdit?: boolean;           // Can edit
  isPro?: boolean;             // Pro feature
  isToolOutput?: boolean;      // Tool output
  deprecated?: boolean;        // Deprecated field
}
```

### Node Output Item

```typescript
interface OutputItem {
  // Required
  id: string;                  // Output ID
  key: string;                 // Output key
  type: OutputType;            // Output type (static/dynamic/error)
  valueType: WorkflowIOValueType;  // Value type

  // Optional
  label?: string;              // Display label
  description?: string;        // Description
  valueDesc?: string;          // Value description
  value?: any;                 // Value
  defaultValue?: any;          // Default value
  required?: boolean;          // Is required
  invalid?: boolean;           // Is invalid
  deprecated?: boolean;        // Deprecated

  // Custom fields
  customFieldConfig?: object;  // Custom field config
}
```

---

## Edge Structure

```typescript
interface WorkflowEdge {
  source: string;              // Source node ID
  target: string;              // Target node ID
  sourceHandle: string;        // Source connection point
  targetHandle: string;        // Target connection point

  // Optional
  id?: string;                 // Edge ID
  type?: string;               // Edge type (default: "default")
}
```

**Handle Format**:
- Source: `${nodeId}-source-${direction}`
- Target: `${nodeId}-target-${direction}`
- Direction: `left` | `right` | `top` | `bottom`

**Example**:
```json
{
  "source": "workflowStart",
  "target": "aiChatNode",
  "sourceHandle": "workflowStart-source-right",
  "targetHandle": "aiChatNode-target-left"
}
```

---

## ChatConfig Structure

```typescript
interface ChatConfig {
  // Welcome message
  welcomeText?: string;

  // Variables
  variables?: Variable[];

  // Question guide
  questionGuide?: boolean | {
    open: boolean;
    model?: string;
    customPrompt?: string;
  };

  // TTS configuration
  ttsConfig?: {
    type: "none" | "web" | "model";
    model?: string;
    voice?: string;
    speed?: number;
  };

  // Whisper (voice input)
  whisperConfig?: {
    open: boolean;
    autoSend: boolean;
    autoTTSResponse: boolean;
  };

  // Scheduled trigger
  scheduledTriggerConfig?: {
    cronString: string;        // Cron expression
    timezone: string;          // Timezone (e.g., "Asia/Shanghai")
    defaultPrompt: string;     // Default prompt
  };

  // Chat input guide
  chatInputGuide?: {
    open: boolean;
    textList: string[];
    customUrl?: string;
  };

  // File selection
  fileSelectConfig?: {
    canSelectFile: boolean;
    canSelectImg: boolean;
    maxFiles?: number;
  };

  // Auto-execute
  autoExecute?: {
    open: boolean;
    defaultPrompt: string;
  };

  // Instruction
  instruction?: string;
}
```

### Variable Structure

```typescript
interface Variable {
  id: string;
  key: string;
  label: string;
  type: "input" | "select" | "internal";
  valueType: WorkflowIOValueType;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  enums?: Array<{label: string, value: any}>;
  icon?: string;
}
```

---

## Value Types

```typescript
enum WorkflowIOValueType {
  // Basic types
  string = "string",
  number = "number",
  boolean = "boolean",
  object = "object",
  any = "any",

  // Array types
  arrayString = "arrayString",
  arrayNumber = "arrayNumber",
  arrayBoolean = "arrayBoolean",
  arrayObject = "arrayObject",
  arrayAny = "arrayAny",

  // Special types
  chatHistory = "chatHistory",
  datasetQuote = "datasetQuote",
  dynamic = "dynamic",
  selectDataset = "selectDataset",
  selectApp = "selectApp"  // deprecated
}
```

---

## Reference Formats

### Array Reference

Used for direct value passing:

```json
{
  "key": "userChatInput",
  "value": ["workflowStart", "userChatInput"]
}
```

**Format**: `[sourceNodeId, outputKey]`

### Template Reference

Used for string interpolation:

```json
{
  "key": "text",
  "value": "User input: {{$workflowStart.userChatInput$}}\nWeather: {{$weatherNode.response$}}"
}
```

**Format**: `{{$nodeId.outputKey$}}` (double braces with single `$`)

**Important**: Must use double braces `{{$...$}}` not single brace `{$...$}`

### Variable Reference

For global variables:

```json
{
  "key": "apiKey",
  "value": "{$VARIABLE_NODE_ID.api_key$}"
}
```

---

## Special Node IDs

- `VARIABLE_NODE_ID` - References global variables
- `workflowStart` - Standard name for start node
- `userGuide` - Standard name for system config node

---

## Complete Example

```json
{
  "nodes": [
    {
      "nodeId": "userGuide",
      "name": "System Configuration",
      "flowNodeType": "userGuide",
      "position": {"x": -600, "y": -250},
      "version": "481",
      "inputs": [
        {
          "key": "welcomeText",
          "renderTypeList": ["hidden"],
          "valueType": "string",
          "value": ""
        },
        {
          "key": "variables",
          "renderTypeList": ["hidden"],
          "valueType": "any",
          "value": []
        }
      ],
      "outputs": []
    },
    {
      "nodeId": "workflowStart",
      "name": "Start",
      "flowNodeType": "workflowStart",
      "position": {"x": -150, "y": 100},
      "version": "481",
      "inputs": [
        {
          "key": "userChatInput",
          "renderTypeList": ["reference", "textarea"],
          "valueType": "string",
          "label": "User Question",
          "required": true
        }
      ],
      "outputs": [
        {
          "id": "userChatInput",
          "key": "userChatInput",
          "label": "User Question",
          "type": "static",
          "valueType": "string"
        }
      ]
    },
    {
      "nodeId": "aiChatNode",
      "name": "AI Response",
      "flowNodeType": "chatNode",
      "position": {"x": 200, "y": 100},
      "showStatus": true,
      "version": "4.9.7",
      "inputs": [
        {
          "key": "model",
          "renderTypeList": ["settingLLMModel"],
          "valueType": "string",
          "value": "gpt-4"
        },
        {
          "key": "temperature",
          "renderTypeList": ["hidden"],
          "valueType": "number",
          "value": 0.7
        },
        {
          "key": "systemPrompt",
          "renderTypeList": ["textarea"],
          "valueType": "string",
          "value": "You are a helpful AI assistant.",
          "max": 3000
        },
        {
          "key": "userChatInput",
          "renderTypeList": ["reference"],
          "valueType": "string",
          "value": ["workflowStart", "userChatInput"],
          "required": true
        }
      ],
      "outputs": [
        {
          "id": "answerText",
          "key": "answerText",
          "label": "AI Response Content",
          "type": "static",
          "valueType": "string"
        },
        {
          "id": "history",
          "key": "history",
          "label": "Chat History",
          "type": "static",
          "valueType": "chatHistory"
        }
      ]
    },
    {
      "nodeId": "outputNode",
      "name": "Output",
      "flowNodeType": "answerNode",
      "position": {"x": 550, "y": 100},
      "version": "481",
      "inputs": [
        {
          "key": "text",
          "renderTypeList": ["textarea", "reference"],
          "valueType": "any",
          "value": ["aiChatNode", "answerText"],
          "required": true
        }
      ],
      "outputs": []
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
    "welcomeText": "Welcome! Ask me anything.",
    "variables": [],
    "questionGuide": {
      "open": false
    },
    "fileSelectConfig": {
      "canSelectFile": false,
      "canSelectImg": false,
      "maxFiles": 10
    }
  }
}
```

---

## Version Compatibility

### Version Field

Node `version` field indicates FastGPT version:
- "481" - FastGPT v4.8.1
- "4.9.7" - FastGPT v4.9.7

### Backward Compatibility

Newer versions usually maintain backward compatibility. However:
- Deprecated fields may be removed
- New required fields may be added
- Node types may change

**Best Practice**: Target the version you're deploying to.

---

## Validation Requirements

See `validation_rules.md` for complete validation requirements.

**Quick Checklist**:
- ✅ All required fields present
- ✅ Valid flowNodeType
- ✅ Unique nodeId per node
- ✅ Valid edge references
- ✅ Correct reference formats
- ✅ Type compatibility
- ✅ No circular dependencies (except loops)

---

**See Also**:
- `node_types_reference.md` - All node types
- `validation_rules.md` - Validation rules
- `../templates/` - Example workflows
