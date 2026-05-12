/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useExcelStore } from '../store';
import { COL_LABELS, INITIAL_ROWS, INITIAL_COLS } from '../constants';
import { getCellId } from '../lib/formula';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Grid: React.FC = () => {
  const { grid, updateCell, selection, setSelection } = useExcelStore();
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCellClick = (row: number, col: number, e: React.MouseEvent) => {
    const id = getCellId(row, col);
    setSelection({
      start: { row, col },
      end: { row, col }
    });
  };

  const handleDoubleClick = (row: number, col: number) => {
    const id = getCellId(row, col);
    setEditingCell(id);
    setEditValue(grid[id]?.formula ?? '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selection.start || editingCell) return;

    const { row, col } = selection.start;
    if (e.key === 'ArrowUp') setSelection({ start: { row: Math.max(0, row - 1), col }, end: { row: Math.max(0, row - 1), col } });
    if (e.key === 'ArrowDown') setSelection({ start: { row: row + 1, col }, end: { row: row + 1, col } });
    if (e.key === 'ArrowLeft') setSelection({ start: { row, col: Math.max(0, col - 1) }, end: { row, col: Math.max(0, col - 1) } });
    if (e.key === 'ArrowRight') setSelection({ start: { row, col: col + 1 }, end: { row, col: col + 1 } });
    
    if (e.key === 'Enter') {
      handleDoubleClick(row, col);
    }
  };

  const submitEdit = () => {
    if (editingCell) {
      updateCell(editingCell, editValue);
      setEditingCell(null);
    }
  };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  return (
    <div 
      className="flex-1 overflow-auto bg-gray-50 p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="inline-grid border border-excel-border bg-white" 
           style={{ gridTemplateColumns: `40px repeat(${INITIAL_COLS}, 100px)` }}>
        
        {/* Header Row */}
        <div className="h-[25px] bg-excel-header-bg border-b border-r border-excel-border flex items-center justify-center font-bold text-[11px]"></div>
        {COL_LABELS.map((label, i) => (
          <div key={label} className="h-[25px] bg-excel-header-bg border-b border-r border-excel-border flex items-center justify-center font-bold text-[11px] text-gray-500">
            {label}
          </div>
        ))}

        {/* Grid Content */}
        {Array.from({ length: INITIAL_ROWS }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Row Number */}
            <div className="h-[25px] bg-excel-header-bg border-b border-r border-excel-border flex items-center justify-center font-bold text-[11px] text-gray-500">
              {rowIndex + 1}
            </div>
            
            {Array.from({ length: INITIAL_COLS }).map((_, colIndex) => {
              const id = getCellId(rowIndex, colIndex);
              const isSelected = selection.start?.row === rowIndex && selection.start?.col === colIndex;
              const cell = grid[id];

              return (
                <div
                  key={id}
                  id={`cell-${id}`}
                  className={cn(
                    "h-[25px] border-b border-r border-gray-100 px-2 flex items-center overflow-hidden text-[13px] border-excel-border/30 cursor-cell relative",
                    isSelected && "ring-2 ring-excel-green-dark z-10 bg-excel-green-dark/5",
                    !isSelected && "hover:bg-gray-50"
                  )}
                  onClick={(e) => {
                    if (isSelected && editingCell !== id) {
                      handleDoubleClick(rowIndex, colIndex);
                    } else {
                      handleCellClick(rowIndex, colIndex, e);
                    }
                  }}
                  onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
                >
                  {editingCell === id ? (
                    <input
                      ref={inputRef}
                      className="absolute inset-0 w-full h-full border-none outline-none px-2 z-20 shadow-xl"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={submitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitEdit();
                        if (e.key === 'Escape') setEditingCell(null);
                      }}
                      autoCapitalize="none"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  ) : (
                    <span className="truncate">
                      {cell?.value?.toString() ?? ''}
                    </span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
