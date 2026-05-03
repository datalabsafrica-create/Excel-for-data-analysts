/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useExcelStore } from '../store';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Zap,
  MousePointer2,
  Table,
  BarChart,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Calculator,
  Eraser,
  Save,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Papa from 'papaparse';
import { getCellId } from '../lib/formula';

export const Toolbar: React.FC = () => {
  const { loadDataset, grid, clearGrid, updateCell, ribbonTab, setRibbonTab, setActiveTab } = useExcelStore();

  const handleExportCSV = () => {
    const rows: string[][] = [];
    for(let r=0; r<50; r++) {
      const row: string[] = [];
      for(let c=0; c<10; c++) {
        row.push(String(grid[getCellId(r, c)]?.value ?? ''));
      }
      rows.push(row);
    }
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'excel_simulator_export.csv';
    a.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          clearGrid();
          results.data.forEach((row: any, rIdx: number) => {
            row.forEach((val: any, cIdx: number) => {
              updateCell(getCellId(rIdx, cIdx), String(val));
            });
          });
        }
      });
    }
  };

  const menuItems = ['File', 'Home', 'Insert', 'Draw', 'Page Layout', 'Formulas', 'Data', 'Review'];

  return (
    <div className="bg-white border-b border-excel-border shrink-0">
      {/* Menu Bar (File, Home, Insert...) */}
      <div className="flex items-center gap-4 px-4 h-8 bg-white text-excel-text text-[13px] font-normal border-b border-excel-border/50 overflow-x-auto no-scrollbar whitespace-nowrap">
        {menuItems.map(item => (
          <div 
            key={item}
            onClick={() => setRibbonTab(item)}
            className={`cursor-pointer h-full flex items-center px-1 transition-all ${
              ribbonTab === item 
                ? 'font-semibold text-excel-green border-b-2 border-excel-green' 
                : 'hover:text-excel-green'
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main Ribbon */}
      <div className="flex items-center gap-6 px-4 h-16 bg-white overflow-x-auto no-scrollbar whitespace-nowrap min-w-0">
        {ribbonTab === 'File' && (
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 items-center justify-center border-r border-excel-border pr-6 h-12">
              <div className="flex gap-4">
                <button className="flex flex-col items-center p-1 rounded hover:bg-excel-light-green transition-colors">
                  <Save className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">Save</span>
                </button>
                <button 
                  onClick={clearGrid}
                  className="flex flex-col items-center p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">Clear</span>
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Actions</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center h-12">
              <div className="flex gap-4">
                <label className="flex flex-col items-center justify-center p-1 rounded hover:bg-excel-light-green cursor-pointer transition-colors group">
                  <Upload className="w-5 h-5 text-excel-text mb-0.5" />
                  <span className="text-[10px] font-medium">Import</span>
                  <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
                </label>
                <button 
                  onClick={handleExportCSV}
                  className="flex flex-col items-center justify-center p-1 rounded hover:bg-excel-light-green text-excel-text transition-colors group"
                >
                  <Download className="w-5 h-5 text-excel-text mb-0.5" />
                  <span className="text-[10px] font-medium">Export</span>
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">I/O</span>
            </div>
          </div>
        )}

        {ribbonTab === 'Home' && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-1 items-center justify-center border-r border-excel-border pr-6 h-12">
              <div className="flex gap-3">
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><Bold className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><Italic className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><Underline className="w-4 h-4" /></button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Font</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center border-r border-excel-border pr-6 h-12">
              <div className="flex gap-3">
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><AlignLeft className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><AlignCenter className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><AlignRight className="w-4 h-4" /></button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Alignment</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center h-12">
              <button 
                onClick={() => setActiveTab('sheet')}
                className="bg-excel-green text-white px-4 py-1.5 rounded text-[11px] font-bold hover:bg-excel-green-dark transition-colors"
              >
                Analyze Data
              </button>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Analysis</span>
            </div>
          </div>
        )}

        {(ribbonTab === 'Insert' || ribbonTab === 'Draw' || ribbonTab === 'Page Layout') && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-1 items-center justify-center border-r border-excel-border pr-6 h-12">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveTab('pivot')}
                  className="flex flex-col items-center p-1 rounded hover:bg-excel-light-green transition-colors"
                >
                  <Table className="w-5 h-5 mb-0.5 text-orange-600" />
                  <span className="text-[10px]">Pivot Table</span>
                </button>
                <button 
                  onClick={() => setActiveTab('chart')}
                  className="flex flex-col items-center p-1 rounded hover:bg-excel-light-green transition-colors"
                >
                  <BarChart className="w-5 h-5 mb-0.5 text-blue-600" />
                  <span className="text-[10px]">Chart</span>
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Tables</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center h-12">
              <div className="flex gap-4">
                <button className="flex flex-col items-center p-1 rounded hover:bg-excel-light-green transition-colors">
                  <Type className="w-5 h-5 mb-0.5 text-gray-600" />
                  <span className="text-[10px]">Text Box</span>
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Illustrations</span>
            </div>
          </div>
        )}

        {ribbonTab === 'Formulas' && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-1 items-center justify-center border-r border-excel-border pr-6 h-12">
              <div className="flex gap-4">
                <button 
                  onClick={() => updateCell(getCellId(0, 0), '=SUM(A1:A5)')}
                  className="flex flex-col items-center p-1 rounded hover:bg-excel-light-green transition-colors"
                >
                  <Calculator className="w-5 h-5 mb-0.5 text-excel-green" />
                  <span className="text-[10px]">AutoSum</span>
                </button>
                <button className="flex flex-col items-center p-1 rounded hover:bg-excel-light-green transition-colors">
                  <RefreshCw className="w-5 h-5 mb-0.5 text-blue-600" />
                  <span className="text-[10px]">Logic</span>
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Library</span>
            </div>
          </div>
        )}

        {(ribbonTab === 'Data' || ribbonTab === 'Review') && (
          <div className="flex gap-6">
            <div className="flex flex-col gap-1 items-center justify-center border-r border-excel-border pr-6 h-12">
              <div className="flex gap-2">
                <button 
                  onClick={() => loadDataset('sales')}
                  className="flex flex-col items-center justify-center p-1 rounded hover:bg-excel-light-green text-excel-text transition-colors group"
                >
                  <Zap className="w-5 h-5 text-orange-500 mb-0.5" />
                  <span className="text-[10px] font-medium">Sales</span>
                </button>
                <button 
                  onClick={() => loadDataset('finance')}
                  className="flex flex-col items-center justify-center p-1 rounded hover:bg-excel-light-green text-excel-text transition-colors group"
                >
                  <FileSpreadsheet className="w-5 h-5 text-excel-green mb-0.5" />
                  <span className="text-[10px] font-medium">Finance</span>
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Datasets</span>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center h-12">
              <div className="flex gap-3">
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><Filter className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors"><Search className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-excel-light-green rounded transition-colors uppercase font-bold text-[10px] text-excel-green">Clean</button>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Sort & Filter</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
