/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CellValue = string | number | boolean | null;

export interface CellData {
  value: CellValue;
  formula: string;
  isEditing?: boolean;
}

export type GridData = Record<string, CellData>;

export interface Selection {
  start: { row: number; col: number } | null;
  end: { row: number; col: number } | null;
}

export interface Mission {
  id: string;
  title: string;
  module: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced' | 'Project';
  description: string;
  lesson?: string;
  objective: string;
  dataset: string;
  initialData: Record<string, string>;
  checkSolution: (grid: GridData) => boolean;
  expectedAnswer?: string;
  hint: string;
}

export type TabType = 'sheet' | 'pivot' | 'chart' | 'training';
