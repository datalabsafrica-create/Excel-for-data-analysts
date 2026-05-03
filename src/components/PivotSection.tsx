/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useExcelStore } from '../store';
import { getCellId } from '../lib/formula';
import { Layers, ChevronDown, GripVertical, Plus, Info, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Pivot Tables",
    content: "Pivot tables allow you to aggregate thousands of rows into a simple summary. Let's learn how to build one step-by-step.",
    target: "header"
  },
  {
    title: "1. Choose a Dimension (Rows)",
    content: "Drag a category like 'Region' or 'Category' into the ORANGE zone. This defines how your data is grouped.",
    target: "row-zone"
  },
  {
    title: "2. Choose a Metric (Values)",
    content: "Drag a numeric field like 'Sales' or 'Units' into the BLUE zone. This calculates the totals for your rows.",
    target: "val-zone"
  },
  {
    title: "3. Analyze the Results",
    content: "Excel instantly sums up every record. Check the 'Grand Total' at the bottom to see your overall performance.",
    target: "result-table"
  }
];

export const PivotSection: React.FC = () => {
  const { grid } = useExcelStore();
  const [rowField, setRowField] = useState<string>('Region');
  const [valueField, setValueField] = useState<string>('Sales');
  const [tutorialStep, setTutorialStep] = useState<number>(-1);

  // Auto-start tutorial for first-time visitors
  useEffect(() => {
    const hasSeen = localStorage.getItem('excel_pivot_tutorial_seen');
    if (!hasSeen) {
      setTutorialStep(0);
      localStorage.setItem('excel_pivot_tutorial_seen', 'true');
    }
  }, []);

  // Extract headers from Row 0
  const headers = useMemo(() => {
    const h = [];
    for (let c = 0; c < 10; c++) {
      const val = grid[getCellId(0, c)]?.value;
      if (val) h.push(String(val));
    }
    return h;
  }, [grid]);

  // Simple Data Processing for Pivot
  const pivotData = useMemo(() => {
    const results: Record<string, number> = {};
    const rowIdx = headers.indexOf(rowField);
    const valIdx = headers.indexOf(valueField);

    if (rowIdx === -1 || valIdx === -1) return [];

    // Scan data starting from Row 1
    for (let r = 1; r < 50; r++) {
      const rowVal = grid[getCellId(r, rowIdx)]?.value;
      const numVal = Number(grid[getCellId(r, valIdx)]?.value);

      if (rowVal && !isNaN(numVal)) {
        const key = String(rowVal);
        results[key] = (results[key] || 0) + numVal;
      }
    }

    return Object.entries(results).map(([key, val]) => ({ key, val }));
  }, [grid, rowField, valueField, headers]);

  return (
    <div className="h-full flex flex-col p-8 space-y-8 bg-gray-50/50 overflow-auto relative">
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {tutorialStep >= 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-orange-200 max-w-sm w-full p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <button onClick={() => setTutorialStep(-1)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{TUTORIAL_STEPS[tutorialStep].title}</h4>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{TUTORIAL_STEPS[tutorialStep].content}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === tutorialStep ? 'w-4 bg-orange-500' : 'w-1.5 bg-gray-200'}`} />
                  ))}
                </div>
                <button 
                  onClick={() => tutorialStep < TUTORIAL_STEPS.length - 1 ? setTutorialStep(s => s + 1) : setTutorialStep(-1)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors flex items-center gap-1"
                >
                  {tutorialStep === TUTORIAL_STEPS.length - 1 ? "Got it!" : "Next Step"} <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between" id="header">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 text-white p-2 rounded-lg shadow-lg shadow-orange-100">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 uppercase">Pivot Table Builder</h3>
            <p className="text-xs text-gray-500 font-medium">Drag fields to summarize your data</p>
          </div>
        </div>
        <button 
          onClick={() => setTutorialStep(0)}
          className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-2 rounded-lg transition-colors border border-orange-100"
        >
          <Info className="w-4 h-4" /> Show Tutorial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* DRAG & DROP CONTROLS */}
        <div className="md:col-span-4 space-y-6">
          {/* Available Fields */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Fields</h4>
            <div className="flex flex-wrap gap-2">
              {headers.map(h => (
                <motion.div
                  key={h}
                  drag
                  dragSnapToOrigin
                  whileDrag={{ scale: 1.05, zIndex: 50 }}
                  onDragEnd={(_, info) => {
                    const rowZone = document.getElementById('row-zone')?.getBoundingClientRect();
                    const valZone = document.getElementById('val-zone')?.getBoundingClientRect();
                    
                    if (rowZone && info.point.x > rowZone.left && info.point.x < rowZone.right && 
                        info.point.y > rowZone.top && info.point.y < rowZone.bottom) {
                      setRowField(h);
                    }
                    if (valZone && info.point.x > valZone.left && info.point.x < valZone.right && 
                        info.point.y > valZone.top && info.point.y < valZone.bottom) {
                      setValueField(h);
                    }
                  }}
                  className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg text-[12px] font-bold text-gray-700 cursor-grab active:cursor-grabbing flex items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  <GripVertical className="w-3 h-3 text-gray-400" />
                  {h}
                </motion.div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 italic">Tip: Drag a field into the boxes below</p>
          </div>

          {/* Zones */}
          <div className="space-y-4">
            <div 
              id="row-zone"
              className={`p-5 rounded-2xl border-2 border-dashed transition-all relative overflow-hidden ${
                rowField ? 'border-orange-500 bg-orange-50/50' : 'border-gray-200 bg-white'
              } ${tutorialStep === 1 ? 'ring-4 ring-orange-400 ring-offset-2' : ''}`}
            >
              <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Rows (Dimension)</h5>
              <AnimatePresence mode="wait">
                {rowField ? (
                  <motion.div 
                    key={rowField}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex justify-between items-center"
                  >
                    {rowField}
                    <button onClick={() => setRowField('')} className="hover:bg-white/20 rounded p-0.5">×</button>
                  </motion.div>
                ) : (
                  <div className="h-10 flex items-center justify-center text-gray-300 text-xs italic">Drop here</div>
                )}
              </AnimatePresence>
            </div>

            <div 
              id="val-zone"
              className={`p-5 rounded-2xl border-2 border-dashed transition-all relative overflow-hidden ${
                valueField ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 bg-white'
              } ${tutorialStep === 2 ? 'ring-4 ring-blue-400 ring-offset-2' : ''}`}
            >
              <h5 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Values (Aggregation: SUM)</h5>
              <AnimatePresence mode="wait">
                {valueField ? (
                  <motion.div 
                    key={valueField}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex justify-between items-center"
                  >
                    {valueField}
                    <button onClick={() => setValueField('')} className="hover:bg-white/20 rounded p-0.5">×</button>
                  </motion.div>
                ) : (
                  <div className="h-10 flex items-center justify-center text-gray-300 text-xs italic">Drop here</div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RESULT TABLE */}
        <div id="result-table" className={`md:col-span-8 bg-white rounded-2x border transition-all ${tutorialStep === 3 ? 'ring-4 ring-orange-400 ring-offset-2 border-orange-500' : 'border-gray-200'} shadow-xl overflow-hidden flex flex-col`}>
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <span className="text-xs font-bold text-gray-600">Pivot Summary</span>
               <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">LIVE ANALYSIS</span>
            </div>
            <div className="flex-1 overflow-auto max-h-[500px]">
              <table className="w-full text-sm">
                 <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider sticky top-0">
                   <tr>
                     <th className="px-6 py-4 text-left">{rowField || 'Dimension'}</th>
                     <th className="px-6 py-4 text-right">Total {valueField || 'Metric'}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {pivotData.map((d, i) => (
                     <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-50">{d.key}</td>
                        <td className="px-6 py-4 text-right font-mono text-gray-600">{d.val.toLocaleString()}</td>
                     </tr>
                   ))}
                   {(!rowField || !valueField || pivotData.length === 0) && (
                     <tr>
                       <td colSpan={2} className="px-6 py-20 text-center text-gray-400 italic">
                         {(!rowField || !valueField) 
                           ? "Configure rows and values to see results" 
                           : "No data found for the selected fields"
                         }
                       </td>
                     </tr>
                   )}
                 </tbody>
                 {(rowField && valueField && pivotData.length > 0) && (
                   <tfoot className="bg-gray-50 font-bold sticky bottom-0 border-t-2 border-gray-200">
                      <tr>
                         <td className="px-6 py-4 text-gray-900">Grand Total</td>
                         <td className="px-6 py-4 text-right text-orange-600 font-mono">
                           {pivotData.reduce((a, b) => a + b.val, 0).toLocaleString()}
                         </td>
                      </tr>
                   </tfoot>
                 )}
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};
