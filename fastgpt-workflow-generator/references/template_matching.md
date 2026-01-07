# Template Matching Strategy

Detailed algorithm for finding the most similar template from the built-in library.

---

## Overview

Template matching uses a two-stage approach:
1. **Coarse Filtering**: Fast metadata-based similarity
2. **Fine Filtering**: AI-powered semantic analysis

---

## Stage 1: Coarse Filtering

### Metadata Extraction

For each template, extract:
```json
{
  "filename": "文档翻译助手.json",
  "domain": "document",
  "complexity": "simple",
  "nodeCount": 8,
  "features": ["readFiles", "chatNode", "answerNode"],
  "hasExternalIntegration": false,
  "hasScheduledTrigger": false,
  "hasMultiAgent": false
}
```

### Similarity Calculation

**1. Domain Similarity (0.0 - 1.0)**
```
Same domain = 1.0
Related domain = 0.5
Different domain = 0.3
```

**Domain Relationships**:
- `document` ↔ `text`: 0.7
- `event` ↔ `travel`: 0.6
- `data` ↔ `analysis`: 0.8

**2. Complexity Match (0.0 - 1.0)**
```
Same = 1.0
Adjacent (simple ↔ medium) = 0.6
Distant (simple ↔ complex) = 0.3
```

**3. Feature Overlap (Jaccard Similarity)**
```
J(A, B) = |A ∩ B| / |A ∪ B|

Example:
User features: [aiChat, knowledgeBase, httpRequest]
Template features: [aiChat, readFiles, httpRequest]
Overlap: {aiChat, httpRequest} = 2
Union: 4
Jaccard = 2/4 = 0.5
```

**4. Node Count Similarity**
```
similarity = 1 - |count1 - count2| / max(count1, count2)

Example:
User: 10 nodes (estimated)
Template: 8 nodes
similarity = 1 - 2/10 = 0.8
```

### Combined Score

```
coarse_score = 0.3 * domain_sim
             + 0.2 * complexity_match
             + 0.3 * feature_overlap
             + 0.2 * node_count_sim
```

**Select Top 3** templates with highest scores.

---

## Stage 2: Fine Filtering

### Semantic Analysis Prompt

```
Compare user requirements with template:

User Requirements:
{user_requirements}

Template Characteristics:
- Purpose: {template_purpose}
- Key Features: {template_features}
- Workflow Structure: {template_structure}
- Complexity: {template_complexity}

Rate similarity on scale 0.0-1.0:
- Functional similarity: How similar are the goals?
- Structural similarity: How similar are the workflows?
- Feature compatibility: How well do features align?

Return: {
  "functional_sim": 0.0-1.0,
  "structural_sim": 0.0-1.0,
  "feature_compat": 0.0-1.0,
  "overall_semantic": weighted_average,
  "reasoning": "explanation"
}
```

### Final Score Calculation

```
final_score = 0.3 * domain_sim
            + 0.2 * complexity_match
            + 0.3 * feature_overlap
            + 0.2 * semantic_sim
```

---

## Selection Strategy

### Score Interpretation

```
Score < 0.5:
  Strategy: Create from scratch
  Reasoning: No suitable template found
  Action: Use blank template with required nodes

Score 0.5 - 0.7:
  Strategy: Use as reference, major modifications
  Reasoning: Template provides structure but needs significant changes
  Action: Copy template, modify 50%+ of nodes

Score > 0.7:
  Strategy: Use as base, minor adjustments
  Reasoning: Template closely matches requirements
  Action: Copy template, modify <30% of nodes
```

### Matching Report Format

```markdown
## Template Matching Report

**Selected Template**: 文档翻译助手.json
**Match Score**: 0.82

### Similarity Breakdown
- Domain Match: 0.9 (document ↔ document)
- Complexity Match: 1.0 (simple ↔ simple)
- Feature Overlap: 0.67 (4/6 features match)
- Semantic Similarity: 0.85

### Matching Features
✅ readFiles node
✅ chatNode for processing
✅ answerNode for output
✅ Simple linear workflow

### Differences
❌ Missing: httpRequest for external API
❌ Missing: Multi-language support
⚠️ Need to adjust: Translation prompt direction

### Recommended Modifications
1. Add httpRequest node for dictionary API
2. Modify chatNode systemPrompt for multi-language
3. Update input parameters for language selection
```

---

## Template Characteristics Database

### 文档翻译助手.json
```json
{
  "domain": "document",
  "complexity": "simple",
  "nodeCount": 8,
  "features": ["readFiles", "chatNode", "answerNode"],
  "workflow_pattern": "linear",
  "characteristics": [
    "File processing",
    "AI transformation",
    "Direct output"
  ]
}
```

### 销售陪练大师.json
```json
{
  "domain": "conversation",
  "complexity": "medium",
  "nodeCount": 10,
  "features": ["chatNode", "history", "contextManagement"],
  "workflow_pattern": "conversational",
  "characteristics": [
    "Multi-turn dialogue",
    "Role-playing",
    "Feedback generation"
  ]
}
```

### 简历筛选助手_飞书.json
```json
{
  "domain": "data",
  "complexity": "complex",
  "nodeCount": 15,
  "features": ["readFiles", "chatNode", "httpRequest", "dataProcessing"],
  "workflow_pattern": "etl",
  "hasExternalIntegration": true,
  "externalServices": ["feishu"],
  "characteristics": [
    "File parsing",
    "AI analysis and scoring",
    "External API integration",
    "Data filtering"
  ]
}
```

### AI金融日报.json
```json
{
  "domain": "news",
  "complexity": "complex",
  "nodeCount": 12,
  "features": ["scheduledTrigger", "multiAgent", "chatNode", "aggregation"],
  "workflow_pattern": "parallel",
  "hasScheduledTrigger": true,
  "hasMultiAgent": true,
  "characteristics": [
    "Cron-based scheduling",
    "Parallel agent processing",
    "Content aggregation",
    "Automated reporting"
  ]
}
```

---

## Customization Guide

### Adding New Templates

To extend the matching database:

1. **Add template JSON** to `templates/` directory
2. **Extract characteristics**:
   ```javascript
   const characteristics = {
     domain: inferDomain(workflow),
     complexity: calculateComplexity(workflow),
     features: extractFeatures(workflow),
     pattern: identifyPattern(workflow)
   };
   ```

3. **Update matching logic** to include new template

### Tuning Weights

Current weights:
```javascript
const WEIGHTS = {
  domain: 0.3,
  complexity: 0.2,
  features: 0.3,
  semantic: 0.2
};
```

Adjust based on matching accuracy:
- Increase `features` weight if feature match is most important
- Increase `semantic` weight for better intent understanding
- Decrease `nodeCount` influence if template size varies greatly

---

## Performance Optimization

### Caching

Cache template characteristics:
```javascript
const templateCache = new Map();

function getTemplateCharacteristics(filename) {
  if (!templateCache.has(filename)) {
    const characteristics = analyzeTemplate(filename);
    templateCache.set(filename, characteristics);
  }
  return templateCache.get(filename);
}
```

### Early Termination

Skip fine filtering if coarse score > 0.9:
```javascript
if (coarseScore > 0.9) {
  return {
    template: topMatch,
    score: coarseScore,
    skippedFineFiltering: true
  };
}
```

---

**See Also**:
- `../templates/README.md` - Template library documentation
- `json_structure_spec.md` - Workflow structure reference
- `../SKILL.md` - Main skill documentation
