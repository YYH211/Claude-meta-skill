# FastGPT Workflow Generator - 经验教训总结

> 基于实际案例的深度学习和自我改进

## 案例背景

**日期**: 2025-01-04
**任务**: 生成演唱会一站式出行规划多智能体协同工作流
**结果**: 初次生成失败，节点无法显示，经过两次修复最终成功

---

## 核心错误分析

### 错误1: 使用了错误的节点类型 ❌

**问题描述**:
生成的JSON使用了 `"flowNodeType": "aiChat"`，导致FastGPT无法识别节点。

**错误表现**:
- 用户导入JSON后，只能看到开始节点和输出节点
- 所有中间AI对话节点都不显示

**根本原因**:
- 没有参考真实的模板文件
- 仅根据文档描述推测了节点类型名称
- FastGPT实际使用的枚举值是 `"chatNode"` 不是 `"aiChat"`

**验证方法**:
```bash
# 检查真实模板中的节点类型
jq '.nodes[] | select(.flowNodeType | contains("chat")) | {nodeId, name, flowNodeType}' templates/简历筛选助手_飞书.json
```

**结果**:
```json
{
  "nodeId": "yKfnfEbzQvFLATL0",
  "name": "提取简历关键信息",
  "flowNodeType": "chatNode"  // ✅ 正确类型
}
```

**修复方案**:
将所有AI对话节点的 `flowNodeType` 从 `"aiChat"` 改为 `"chatNode"`

**影响的节点**:
- intentAnalysis (意图识别)
- activityAssistant (活动助理)
- travelAssistant (出行助理)
- tourismAssistant (旅游助理)
- foodAssistant (美食助理)
- aggregationNode (总助理汇总)

---

### 错误2: 变量引用格式混乱 ❌

**问题描述**:
在字符串模板中使用了错误的变量引用格式 `[workflowStart.userChatInput]`，应该使用 `{{$workflowStart.userChatInput$}}`

**两种正确的变量引用格式**:

#### 格式1: 数组格式（用于直接值引用）
```json
{
  "key": "userChatInput",
  "valueType": "string",
  "value": ["workflowStart", "userChatInput"]  // ✅ 直接引用整个值
}
```

**使用场景**:
- `value` 字段类型为数组时
- 不需要字符串拼接，直接使用其他节点的输出值
- 常见字段：`userChatInput`, `fileUrlList`, `quoteQA`

#### 格式2: 模板语法（用于字符串拼接）
```json
{
  "key": "userChatInput",
  "valueType": "string",
  "value": "用户需求：{{$workflowStart.userChatInput$}}\n简历链接：{{$sVCFgxsVIZDZZrvX.loopStartInput$}}"  // ✅ 在字符串中嵌入变量
}
```

**使用场景**:
- `value` 字段类型为字符串时
- 需要将多个变量拼接成一段文本
- 需要在文本中间插入变量值

**关键规则**:
- ✅ 正确: `{{$nodeId.key$}}` (双花括号，单美元符号)
- ❌ 错误: `{{nodeId.key}}` (缺少$)
- ❌ 错误: `[nodeId.key]` (方括号是错误的)
- ❌ 错误: `{$nodeId.key$}` (单花括号)

**真实模板验证**:
```bash
jq '.nodes[] | .inputs[] | select(.key == "userChatInput") | .value' templates/简历筛选助手_飞书.json | head -1
```

**输出**:
```
"待识别简历：{{$ppdWvuGwkktvDZtz.system_text$}}\n简历链接：{{$sVCFgxsVIZDZZrvX.loopStartInput$}}\n岗位适配度：{{$bCasgP0Tq0zG81kX.answerText$}}"
```

---

## 深层次问题分析

### 问题1: 文档与实际不一致

**发现**:
- 文档描述可能不完整或有误
- 真实的模板文件是唯一可靠的标准

**教训**:
> **永远以真实模板为准，文档仅供参考**

### 问题2: 验证流程缺失

**发现**:
- 生成JSON后没有与真实模板对比
- 没有使用jq等工具验证节点类型
- 没有检查变量引用格式

**教训**:
> **生成后必须进行三层验证：格式验证 + 模板对比 + 实际导入测试**

---

## 预防措施（固化到Skill中）

### 1. 节点类型验证规则

**必须遵守的节点类型映射**:

| 功能描述 | 正确的flowNodeType | 错误的类型 |
|---------|-------------------|-----------|
| AI对话节点 | `"chatNode"` | `"aiChat"`, `"对话节点"` |
| HTTP请求 | `"httpRequest468"` | `"httpRequest"`, `"apiCall"` |
| 知识库搜索 | `"datasetSearchNode"` | `"kbSearch"`, `"knowledgeBase"` |
| 代码执行 | `"code"` | `"javascript"`, `"script"` |
| 条件判断 | `"ifElseNode"` | `"ifElse"`, `"condition"` |
| 插件输出 | `"pluginOutput"` | `"output"`, `"answerNode"` |
| 系统配置 | `"userGuide"` 或 `"systemConfig"` | `"config"`, `"settings"` |

**验证命令**:
```bash
# 检查所有节点类型是否合法
jq '.nodes[].flowNodeType' your_workflow.json | sort | uniq

# 对比模板中的节点类型
jq '.nodes[].flowNodeType' templates/简历筛选助手_飞书.json | sort | uniq
```

### 2. 变量引用格式检查清单

**生成JSON时必须检查**:

```markdown
## 变量引用格式检查

### 数组格式检查
- [ ] value类型为数组（arrayString, arrayAny等）
- [ ] 使用格式: ["nodeId", "key"]
- [ ] nodeId在nodes数组中存在
- [ ] key是目标节点的outputs中的key

### 模板格式检查
- [ ] value类型为字符串（string）
- [ ] 使用格式: {{$nodeId.key$}}
- [ ] 双花括号 {{}}
- [ ] 单美元符号 $
- [ ] nodeId和key都存在

### 常见错误模式
- [ ] 没有使用 [nodeId.key] 这种格式
- [ ] 没有使用 {$nodeId.key$} 这种格式（单花括号）
- [ ] 没有使用 {{nodeId.key}} 这种格式（缺少$）
```

### 3. 生成后验证流程

**必须执行的三个验证步骤**:

#### 步骤1: JSON格式验证
```bash
# 检查JSON是否可解析
jq '.' your_workflow.json > /dev/null && echo "✅ JSON格式正确" || echo "❌ JSON格式错误"
```

#### 步骤2: 节点类型验证
```bash
# 提取所有flowNodeType
jq '.nodes[].flowNodeType' your_workflow.json | sort | uniq -c

# 对比模板中的类型（以chatNode为例）
jq '.nodes[] | select(.flowNodeType | contains("chat")) | .flowNodeType' your_workflow.json
# 应该输出: "chatNode"，不应该输出 "aiChat"
```

#### 步骤3: 变量引用验证
```bash
# 检查字符串中的变量引用格式
jq '.nodes[].inputs[]? | select(.value | type == "string") | .value' your_workflow.json | grep -E '\{\{.*\}\}' | head -5

# 应该看到类似: "{{$nodeId.key$}}" 的格式
# 不应该看到: "[nodeId.key]" 或 "{$nodeId.key$}"
```

---

## 更新Skill文档的建议

### 需要更新的章节

#### 1. Phase 3: JSON Generation
**添加强制检查点**:
```
4.5. 节点类型验证
   - 使用jq命令验证flowNodeType
   - 对比模板文件确认类型正确

4.6. 变量引用格式验证
   - 检查字符串中的变量引用
   - 确保使用 {{$nodeId.key$}} 格式
```

#### 2. Best Practices - Don'ts
**添加新的禁止项**:
```markdown
- ❌ **Don't use "aiChat" as flowNodeType** - must use "chatNode"
- ❌ **Don't use [nodeId.key] in strings** - must use {{$nodeId.key$}}
- ❌ **Don't guess node types** - always verify against real templates
```

#### 3. Troubleshooting - FAQ
**添加新的FAQ条目**:
```markdown
**Q6: Nodes not visible after importing JSON**

A: Check flowNodeType field:
- ✅ Correct: "chatNode" for AI dialogue
- ❌ Wrong: "aiChat" (not recognized by FastGPT)

Verify with: jq '.nodes[].flowNodeType' workflow.json

**Q7: Variable references not working**

A: Check reference format based on value type:
- Array value: ["nodeId", "key"]
- String value: {{$nodeId.key$}}

Common errors:
- [nodeId.key] → Wrong format
- {$nodeId.key$} → Single brace (should be double)
- {{nodeId.key}} → Missing $ sign
```

---

## 行动计划

### 立即行动（已完成）
- [x] 分析错误原因
- [x] 验证真实模板文件
- [x] 生成修复版JSON
- [x] 记录经验教训

### 后续改进
- [ ] 更新SKILL.md文档，添加节点类型和变量引用的明确规则
- [ ] 创建验证脚本（validate_workflow.sh）
- [ ] 建立模板对比测试用例
- [ ] 在生成JSON时自动运行验证命令

---

## 总结

**最重要的三条规则**:

1. **永远以真实模板为准**
   ```bash
   # 验证任何不确定的字段
   jq '.nodes[0]' templates/简历筛选助手_飞书.json
   ```

2. **节点类型必须精确匹配**
   - AI对话 → `"chatNode"` (不是 `"aiChat"`)
   - HTTP请求 → `"httpRequest468"` (不是 `"httpRequest"`)

3. **变量引用格式取决于value类型**
   - 数组 → `["nodeId", "key"]`
   - 字符串 → `{{$nodeId.key$}}`

**记住**: 实践出真知，模板是标准，验证是保障。

---

**文档版本**: v1.0
**创建日期**: 2025-01-04
**适用版本**: FastGPT v4.8+
**作者**: FastGPT Workflow Generator Skill (Self-Improvement)
