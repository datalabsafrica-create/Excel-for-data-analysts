/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell as ReCell
} from 'recharts';
import { useExcelStore } from '../store';
import { getCellId } from '../lib/formula';

export const ChartSection: React.FC = () => {
  const { grid, selection } = useExcelStore();

  const chartData = useMemo(() => {
    if (!selection.start || !selection.end) return [];

    const data: any[] = [];
    const { start, end } = selection;
    
    // Assume columns are headers if we have multiple rows
    // This is a simple heuristic for the simulator
    const startRow = Math.min(start.row, end.row);
    const endRow = Math.max(start.row, end.row);
    const startCol = Math.min(start.col, end.col);
    const endCol = Math.max(start.col, end.col);

    for (let r = startRow; r <= endRow; r++) {
      const rowObj: any = { name: String(grid[getCellId(r, startCol)]?.value || `Row ${r + 1}`) };
      for (let c = startCol + 1; c <= endCol; c++) {
        const header = String(grid[getCellId(startRow, c)]?.value || `Col ${c}`);
        rowObj[header] = Number(grid[getCellId(r, c)]?.value) || 0;
      }
      data.push(rowObj);
    }
    // Remove if first row was header (heuristically)
    return data.slice(1);
  }, [grid, selection]);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
        <BarChart className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm font-medium">No valid data selected</p>
        <p className="text-xs uppercase tracking-widest mt-1">Select a range (e.g. A1:B10) with headers</p>
      </div>
    );
  }

  const keys = Object.keys(chartData[0] || {}).filter(k => k !== 'name');

  return (
    <div className="h-full flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Dynamic Analysis Chart</h3>
        <div className="flex gap-2">
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">LIVE SYNC</div>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 20 }} />
            {keys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={index === 0 ? '#10B981' : '#3B82F6'} 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
             <div className="text-[10px] font-bold text-emerald-600 uppercase">Max Value</div>
             <div className="text-lg font-bold text-emerald-900">
               {Math.max(...chartData.map(d => Object.values(d).filter(v => typeof v === 'number').reduce((a:any, b:any) => Math.max(a, b), 0)))}
             </div>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
             <div className="text-[10px] font-bold text-blue-600 uppercase">Data Points</div>
             <div className="text-lg font-bold text-blue-900">{chartData.length}</div>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
             <div className="text-[10px] font-bold text-gray-600 uppercase">Analysis</div>
             <div className="text-[10px] text-gray-500 italic">Auto-generated from grid selection</div>
          </div>
      </div>
    </div>
  );
};
