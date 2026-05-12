/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GridData, CellValue } from '../types';

/**
 * Parses a cell reference like 'A1' into {row, col} indices.
 */
export const parseReference = (ref: string) => {
  const match = ref.match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;
  const colStr = match[1];
  const row = parseInt(match[2], 10);
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return { row: row - 1, col: col - 1 };
};

/**
 * Converts row/col indices to a cell ID like 'A1'.
 */
export const getCellId = (row: number, col: number) => {
  let colStr = '';
  let tempCol = col + 1;
  while (tempCol > 0) {
    let remainder = (tempCol - 1) % 26;
    colStr = String.fromCharCode(65 + remainder) + colStr;
    tempCol = Math.floor((tempCol - 1) / 26);
  }
  return `${colStr}${row + 1}`;
};

/**
 * Extracts numeric values from a range string (e.g., 'A1:A10').
 */
export const getRangeValues = (range: string, grid: GridData): number[] => {
  if (!range.includes(':')) {
    const ref = parseReference(range);
    if (!ref) return [];
    const val = Number(grid[getCellId(ref.row, ref.col)]?.value);
    return isNaN(val) ? [] : [val];
  }

  const [start, end] = range.split(':');
  const startRef = parseReference(start);
  const endRef = parseReference(end);
  if (!startRef || !endRef) return [];

  const values: number[] = [];
  for (let r = Math.min(startRef.row, endRef.row); r <= Math.max(startRef.row, endRef.row); r++) {
    for (let c = Math.min(startRef.col, endRef.col); c <= Math.max(startRef.col, endRef.col); c++) {
      const id = getCellId(r, c);
      const val = Number(grid[id]?.value);
      if (!isNaN(val)) values.push(val);
    }
  }
  return values;
};

/**
 * The core Formula Dispatcher.
 */
const functionMap: Record<string, (args: string[], grid: GridData) => CellValue> = {
  SUM: (args, grid) => getRangeValues(args[0], grid).reduce((a, b) => a + b, 0),
  
  AVERAGE: (args, grid) => {
    const vals = getRangeValues(args[0], grid);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  },

  COUNT: (args, grid) => getRangeValues(args[0], grid).length,

  MAX: (args, grid) => {
    const vals = getRangeValues(args[0], grid);
    return vals.length ? Math.max(...vals) : 0;
  },

  MIN: (args, grid) => {
    const vals = getRangeValues(args[0], grid);
    return vals.length ? Math.min(...vals) : 0;
  },

  ROUND: (args, grid) => {
    const val = evaluateFormula(args[0], grid, true);
    const precision = args[1] ? Number(evaluateFormula(args[1], grid, true)) : 0;
    return typeof val === 'number' ? Number(val.toFixed(precision)) : '#VALUE!';
  },

  ABS: (args, grid) => {
    const val = Number(evaluateFormula(args[0], grid, true));
    return isNaN(val) ? '#VALUE!' : Math.abs(val);
  },

  CONCAT: (args, grid) => {
    return args.map(arg => evaluateFormula(arg, grid, true)).join('');
  },

  UPPER: (args, grid) => {
    const val = evaluateFormula(args[0], grid, true);
    return String(val).toUpperCase();
  },

  LOWER: (args, grid) => {
    const val = evaluateFormula(args[0], grid, true);
    return String(val).toLowerCase();
  },

  LEN: (args, grid) => {
    const val = evaluateFormula(args[0], grid, true);
    return String(val).length;
  },

  TRIM: (args, grid) => {
    const val = evaluateFormula(args[0], grid, true);
    return String(val).trim();
  },

  IF: (args, grid) => {
    const conditionStr = args[0];
    const trueVal = evaluateFormula(args[1], grid, true);
    const falseVal = evaluateFormula(args[2], grid, true);

    try {
      const result = evaluateFormula(conditionStr, grid, true);
      return result ? trueVal : falseVal;
    } catch {
      return '#ERROR!';
    }
  },

  VLOOKUP: (args, grid) => {
    const lookupValue = evaluateFormula(args[0], grid, true);
    const rangeStr = args[1];
    const colIndex = Number(evaluateFormula(args[2], grid, true));
    
    if (!rangeStr.includes(':')) return '#REF!';
    const [start, end] = rangeStr.split(':');
    const startRef = parseReference(start);
    const endRef = parseReference(end);
    
    if (!startRef || !endRef) return '#REF!';

    for (let r = Math.min(startRef.row, endRef.row); r <= Math.max(startRef.row, endRef.row); r++) {
      const firstColId = getCellId(r, Math.min(startRef.col, endRef.col));
      if (grid[firstColId]?.value == lookupValue) {
        const targetCol = Math.min(startRef.col, endRef.col) + colIndex - 1;
        return grid[getCellId(r, targetCol)]?.value ?? null;
      }
    }
    return '#N/A';
  }
};

/**
 * Main Evaluator
 */
export const evaluateFormula = (content: string, grid: GridData, isNested = false): CellValue => {
  if (content === null || content === undefined) return null;
  const strContent = String(content).trim();
  
  let formula = strContent;
  
  if (strContent.startsWith('=')) {
    formula = strContent.substring(1).trim();
  } else if (!isNested) {
    if (!isNaN(Number(strContent)) && strContent.trim() !== '') {
      return Number(strContent);
    }
    return strContent;
  } else {
    // It's nested. It might be a string literal, number, or expression.
    if (/^["'].*["']$/.test(strContent)) {
      return strContent.replace(/^["'](.*)["']$/, '$1');
    }
    if (!isNaN(Number(strContent)) && strContent.trim() !== '') {
      return Number(strContent);
    }
  }

  const funcMatch = formula.match(/^([A-Z]+)\((.*)\)$/i);
  if (funcMatch) {
    const funcName = funcMatch[1].toUpperCase();
    const argsString = funcMatch[2];
    
    const args: string[] = [];
    let currentArg = '';
    let parenLevel = 0;
    for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        if (char === '(') parenLevel++;
        if (char === ')') parenLevel--;
        if (char === ',' && parenLevel === 0) {
            args.push(currentArg.trim());
            currentArg = '';
        } else {
            currentArg += char;
        }
    }
    args.push(currentArg.trim());

    const implementation = functionMap[funcName];
    if (implementation) {
      try {
        return implementation(args, grid);
      } catch (e) {
        return '#ERROR!';
      }
    }
    return '#NAME?';
  }

  const refMatch = formula.match(/^([A-Z]+[0-9]+)$/i);
  if (refMatch) {
    return grid[refMatch[1].toUpperCase()]?.value ?? 0;
  }

  // Expression evaluation (math/logical)
  try {
    let evalExpr = formula;
    
    // Replace single = with === for JS evaluation, but don't touch >=, <=, !=, or existing ==/===
    // This allows IF(A1="Yes", ...) to work correctly.
    evalExpr = evalExpr.replace(/(?<![<>!=])=(?!=)/g, '===');

    const allRefs = formula.match(/([A-Z]+[0-9]+)/gi) || [];
    allRefs.forEach(ref => {
      const val = grid[ref.toUpperCase()]?.value ?? 0;
      const safeVal = typeof val === 'string' ? `"${val}"` : String(val);
      evalExpr = evalExpr.replace(new RegExp(`\\b${ref}\\b`, 'gi'), safeVal);
    });
    return new Function(`return ${evalExpr}`)();
  } catch (e) {
    return '#VALUE!';
  }
};

