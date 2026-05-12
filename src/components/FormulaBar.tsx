/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExcelStore } from '../store';
import { getCellId } from '../lib/formula';

export const FormulaBar: React.FC = () => {
  const { grid, selection, updateCell } = useExcelStore();
  
  const activeId = selection.start ? getCellId(selection.start.row, selection.start.col) : null;
  const currentFormula = activeId ? (grid[activeId]?.formula ?? '') : '';

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeId) {
      updateCell(activeId, e.target.value);
    }
  };

  return (
    <div className="flex items-center bg-white border-b border-excel-border h-8 shrink-0">
      <div className="flex items-center justify-center w-16 h-full border-r border-excel-border text-[11px] font-semibold text-gray-700 bg-white">
        {activeId ?? ''}
      </div>
      <div className="px-3 italic text-gray-500 font-serif font-bold text-xs select-none border-r border-excel-border h-full flex items-center">
        fx
      </div>
      <input
        className="flex-1 h-full px-2 text-[13px] border-none outline-none focus:ring-0 placeholder:text-gray-300"
        value={currentFormula}
        onChange={handleUpdate}
        placeholder="Enter value or formula (e.g. =SUM(A1:A5))"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
};
