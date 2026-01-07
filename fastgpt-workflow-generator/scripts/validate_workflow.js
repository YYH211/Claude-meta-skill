#!/usr/bin/env node
/**
 * FastGPT Workflow Validator
 *
 * Validates FastGPT workflow JSON files using the three-layer validation system.
 *
 * Usage:
 *   node validate_workflow.js <workflow.json>
 *   node validate_workflow.js --help
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Valid node types (subset, extend as needed)
const VALID_NODE_TYPES = [
  'workflowStart', 'userGuide', 'chatNode', 'answerNode',
  'datasetSearchNode', 'datasetConcatNode', 'httpRequest468',
  'code', 'ifElseNode', 'loop', 'loopStart', 'loopEnd',
  'readFiles', 'userSelect', 'formInput', 'variableUpdate',
  'textEditor', 'agent', 'contentExtract', 'classifyQuestion',
  'pluginInput', 'pluginOutput', 'lafModule', 'stopTool',
  'globalVariable', 'comment'
];

function printHeader(text) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${text}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function printSuccess(text) {
  console.log(`${colors.green}✅ ${text}${colors.reset}`);
}

function printError(text) {
  console.log(`${colors.red}❌ ${text}${colors.reset}`);
}

function printWarning(text) {
  console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`);
}

function printInfo(text) {
  console.log(`${colors.blue}ℹ️  ${text}${colors.reset}`);
}

// Level 1: Format Validation
function validateFormat(workflow) {
  const errors = [];
  const warnings = [];

  // Check top-level structure
  if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
    errors.push({ level: 'critical', message: 'Missing or invalid nodes array' });
  }
  if (!workflow.edges || !Array.isArray(workflow.edges)) {
    errors.push({ level: 'critical', message: 'Missing or invalid edges array' });
  }
  if (!workflow.chatConfig || typeof workflow.chatConfig !== 'object') {
    errors.push({ level: 'error', message: 'Missing or invalid chatConfig object' });
  }

  if (workflow.nodes) {
    workflow.nodes.forEach((node, index) => {
      // Check required fields
      const requiredFields = ['nodeId', 'name', 'flowNodeType', 'position', 'inputs', 'outputs'];
      requiredFields.forEach(field => {
        if (!(field in node)) {
          errors.push({
            level: 'error',
            field: `nodes[${index}].${field}`,
            message: `Missing required field: ${field}`
          });
        }
      });

      // Validate flowNodeType
      if (node.flowNodeType && !VALID_NODE_TYPES.includes(node.flowNodeType)) {
        warnings.push({
          level: 'warning',
          field: `nodes[${index}].flowNodeType`,
          message: `Unknown node type: ${node.flowNodeType} (may be valid but not in validator list)`
        });
      }

      // Validate position
      if (node.position) {
        if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
          errors.push({
            level: 'error',
            field: `nodes[${index}].position`,
            message: 'Position must have numeric x and y coordinates'
          });
        }
      }

      // Check inputs/outputs are arrays
      if (node.inputs && !Array.isArray(node.inputs)) {
        errors.push({
          level: 'error',
          field: `nodes[${index}].inputs`,
          message: 'Inputs must be an array'
        });
      }
      if (node.outputs && !Array.isArray(node.outputs)) {
        errors.push({
          level: 'error',
          field: `nodes[${index}].outputs`,
          message: 'Outputs must be an array'
        });
      }
    });
  }

  return {
    valid: errors.filter(e => e.level === 'error' || e.level === 'critical').length === 0,
    errors,
    warnings
  };
}

// Level 2: Connection Validation
function validateConnections(workflow) {
  const errors = [];
  const warnings = [];
  const nodeMap = new Map();

  workflow.nodes.forEach(node => {
    nodeMap.set(node.nodeId, node);
  });

  // Validate edges
  workflow.edges.forEach((edge, index) => {
    // Check source and target exist
    if (!nodeMap.has(edge.source)) {
      errors.push({
        level: 'error',
        field: `edges[${index}].source`,
        message: `Referenced source node not found: ${edge.source}`
      });
    }
    if (!nodeMap.has(edge.target)) {
      errors.push({
        level: 'error',
        field: `edges[${index}].target`,
        message: `Referenced target node not found: ${edge.target}`
      });
    }

    // Validate handle format
    const sourceHandlePattern = /^.+-source-(left|right|top|bottom)$/;
    const targetHandlePattern = /^.+-target-(left|right|top|bottom)$/;

    if (edge.sourceHandle && !sourceHandlePattern.test(edge.sourceHandle)) {
      warnings.push({
        level: 'warning',
        field: `edges[${index}].sourceHandle`,
        message: `Invalid sourceHandle format: ${edge.sourceHandle}`
      });
    }
    if (edge.targetHandle && !targetHandlePattern.test(edge.targetHandle)) {
      warnings.push({
        level: 'warning',
        field: `edges[${index}].targetHandle`,
        message: `Invalid targetHandle format: ${edge.targetHandle}`
      });
    }
  });

  // Validate node references in inputs
  workflow.nodes.forEach((node, nodeIndex) => {
    if (!node.inputs) return;

    node.inputs.forEach((input, inputIndex) => {
      // Check array reference format
      if (Array.isArray(input.value) && input.value.length === 2) {
        const [refNodeId, refOutputKey] = input.value;

        const refNode = nodeMap.get(refNodeId);
        if (!refNode) {
          errors.push({
            level: 'error',
            field: `nodes[${nodeIndex}].inputs[${inputIndex}].value`,
            message: `Referenced node not found: ${refNodeId}`
          });
        } else if (refNode.outputs) {
          const outputExists = refNode.outputs.some(out => out.key === refOutputKey);
          if (!outputExists) {
            errors.push({
              level: 'error',
              field: `nodes[${nodeIndex}].inputs[${inputIndex}].value`,
              message: `Referenced output key not found: ${refNodeId}.${refOutputKey}`
            });
          }
        }
      }

      // Check template reference format {$nodeId.key$}
      if (typeof input.value === 'string') {
        const templateRefs = input.value.match(/\{\$([^.}]+)\.([^}$]+)\$\}/g);
        if (templateRefs) {
          templateRefs.forEach(ref => {
            const match = ref.match(/\{\$([^.}]+)\.([^}$]+)\$\}/);
            if (match) {
              const [, refNodeId, refOutputKey] = match;
              const refNode = nodeMap.get(refNodeId);
              if (!refNode && refNodeId !== 'VARIABLE_NODE_ID') {
                errors.push({
                  level: 'error',
                  field: `nodes[${nodeIndex}].inputs[${inputIndex}].value`,
                  message: `Template reference to non-existent node: ${refNodeId}`
                });
              }
            }
          });
        }

        // Check for incorrect format {{$...}}
        const incorrectFormat = input.value.match(/\{\{\$[^}]+\$\}\}/g);
        if (incorrectFormat) {
          errors.push({
            level: 'error',
            field: `nodes[${nodeIndex}].inputs[${inputIndex}].value`,
            message: `Incorrect reference format: Use {$nodeId.key$} not {{$nodeId.key$}}`
          });
        }
      }
    });
  });

  return {
    valid: errors.filter(e => e.level === 'error').length === 0,
    errors,
    warnings
  };
}

// Level 3: Logic Validation
function validateLogic(workflow) {
  const errors = [];
  const warnings = [];

  // Check required nodes
  const hasWorkflowStart = workflow.nodes.some(n => n.flowNodeType === 'workflowStart');
  const hasSystemConfig = workflow.nodes.some(n =>
    n.flowNodeType === 'systemConfig' || n.flowNodeType === 'userGuide'
  );
  const hasOutput = workflow.nodes.some(n =>
    n.flowNodeType === 'answerNode' || n.flowNodeType === 'pluginOutput'
  );

  if (!hasWorkflowStart) {
    errors.push({ level: 'critical', message: 'Missing required node: workflowStart' });
  }
  if (!hasSystemConfig) {
    warnings.push({ level: 'warning', message: 'Missing recommended node: userGuide (systemConfig)' });
  }
  if (!hasOutput) {
    errors.push({ level: 'error', message: 'Missing output node (answerNode or pluginOutput)' });
  }

  // Connectivity check (DFS)
  const reachable = new Set();
  const edgeMap = new Map();

  workflow.edges.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source).push(edge.target);
  });

  function dfs(nodeId) {
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);

    const neighbors = edgeMap.get(nodeId) || [];
    neighbors.forEach(neighbor => dfs(neighbor));
  }

  const startNode = workflow.nodes.find(n => n.flowNodeType === 'workflowStart');
  if (startNode) {
    dfs(startNode.nodeId);
  }

  // Check unreachable nodes
  workflow.nodes.forEach(node => {
    if (!reachable.has(node.nodeId) &&
        node.flowNodeType !== 'systemConfig' &&
        node.flowNodeType !== 'userGuide' &&
        node.flowNodeType !== 'globalVariable') {
      warnings.push({
        level: 'warning',
        message: `Node "${node.name}" (${node.nodeId}) is unreachable from workflowStart`
      });
    }
  });

  return {
    valid: errors.filter(e => e.level === 'error' || e.level === 'critical').length === 0,
    errors,
    warnings
  };
}

// Main validation function
function validate(filePath) {
  printHeader('FastGPT Workflow Validator');

  // Read file
  printInfo(`Reading file: ${filePath}`);
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    printError(`Failed to read file: ${err.message}`);
    return false;
  }

  // Parse JSON
  printInfo('Parsing JSON...');
  let workflow;
  try {
    workflow = JSON.parse(content);
  } catch (err) {
    printError(`Invalid JSON: ${err.message}`);
    return false;
  }
  printSuccess('JSON parsed successfully');

  // Level 1: Format Validation
  printHeader('Level 1: Format Validation');
  const formatResult = validateFormat(workflow);
  if (formatResult.valid) {
    printSuccess('Format validation passed');
  } else {
    printError('Format validation failed');
  }
  formatResult.errors.forEach(err => printError(err.message));
  formatResult.warnings.forEach(warn => printWarning(warn.message));

  // Level 2: Connection Validation
  printHeader('Level 2: Connection Validation');
  const connResult = validateConnections(workflow);
  if (connResult.valid) {
    printSuccess('Connection validation passed');
  } else {
    printError('Connection validation failed');
  }
  connResult.errors.forEach(err => printError(err.message));
  connResult.warnings.forEach(warn => printWarning(warn.message));

  // Level 3: Logic Validation
  printHeader('Level 3: Logic Validation');
  const logicResult = validateLogic(workflow);
  if (logicResult.valid) {
    printSuccess('Logic validation passed');
  } else {
    printError('Logic validation failed');
  }
  logicResult.errors.forEach(err => printError(err.message));
  logicResult.warnings.forEach(warn => printWarning(warn.message));

  // Summary
  printHeader('Validation Summary');
  const totalErrors = formatResult.errors.length + connResult.errors.length + logicResult.errors.length;
  const totalWarnings = formatResult.warnings.length + connResult.warnings.length + logicResult.warnings.length;

  console.log(`Total Errors: ${colors.red}${totalErrors}${colors.reset}`);
  console.log(`Total Warnings: ${colors.yellow}${totalWarnings}${colors.reset}`);

  const overallValid = formatResult.valid && connResult.valid && logicResult.valid;
  if (overallValid) {
    printSuccess('Overall: PASSED ✨');
    console.log(`\n${colors.green}The workflow is valid and ready to import to FastGPT!${colors.reset}\n`);
    return true;
  } else {
    printError('Overall: FAILED');
    console.log(`\n${colors.red}Please fix the errors before importing to FastGPT.${colors.reset}\n`);
    return false;
  }
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Usage: node validate_workflow.js <workflow.json>

Validates FastGPT workflow JSON files using a three-layer validation system:
  Level 1: Format Validation (JSON structure and syntax)
  Level 2: Connection Validation (node references and edges)
  Level 3: Logic Validation (workflow completeness and correctness)

Options:
  --help, -h    Show this help message

Examples:
  node validate_workflow.js my_workflow.json
  node validate_workflow.js ../templates/文档翻译助手.json
    `);
    process.exit(0);
  }

  const filePath = args[0];
  if (!fs.existsSync(filePath)) {
    printError(`File not found: ${filePath}`);
    process.exit(1);
  }

  const success = validate(filePath);
  process.exit(success ? 0 : 1);
}

module.exports = { validate, validateFormat, validateConnections, validateLogic };
