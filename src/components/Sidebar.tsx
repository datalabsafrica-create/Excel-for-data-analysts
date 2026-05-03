/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useExcelStore } from '../store';
import { MISSIONS } from '../constants';
import { 
  BookOpen, 
  Table as TableIcon, 
  BarChart2, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  Play,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentMission, 
    startMission, 
    checkMission,
    completedMissions,
    clearGrid,
    sidebarOpen,
    toggleSidebar
  } = useExcelStore();

  // Handle closing sidebar on mobile when mission starts or tab changes
  const handleTabSelect = (tab: any) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const handleStartMission = (id: string) => {
    startMission(id);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const [showHint, setShowHint] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState<'lesson' | 'task'>('lesson');

  const currentMissionIndex = MISSIONS.findIndex(m => m.id === currentMission?.id);
  const nextMission = MISSIONS[currentMissionIndex + 1];

  // Reset view mode when mission changes
  React.useEffect(() => {
    if (currentMission) {
      setViewMode('lesson');
      setSuccess(false);
      setError(false);
      setShowHint(false);
    }
  }, [currentMission?.id]);

  const handleCheck = () => {
    // If already in error state, reset briefly to re-trigger animation
    if (error) setError(false);
    
    setTimeout(() => {
      const isCorrect = checkMission();
      if (isCorrect) {
        setSuccess(true);
        setError(false);
      } else {
        setError(true);
      }
    }, 10);
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : 260,
          width: sidebarOpen ? 260 : 0,
          opacity: sidebarOpen ? 1 : 0
        }}
        className="fixed md:relative right-0 h-[calc(100vh-40px-44px)] md:h-full border-l border-excel-border bg-white flex flex-col overflow-hidden shrink-0 z-50 shadow-2xl md:shadow-none"
      >
        <div className="flex border-b border-excel-border p-1 gap-1 bg-excel-header-bg">
          <button 
            onClick={() => handleTabSelect('training')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold rounded transition-all ${activeTab === 'training' ? 'bg-white shadow-sm text-excel-green' : 'text-gray-500 hover:bg-gray-200/50'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Missions
          </button>
          <button 
            onClick={() => handleTabSelect('pivot')}
            className={`relative flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold rounded transition-all ${activeTab === 'pivot' ? 'bg-white shadow-sm text-excel-green' : 'text-gray-500 hover:bg-gray-200/50'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            Pivot
            {currentMission?.objective.toLowerCase().includes('pivot') && activeTab !== 'pivot' && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse border border-white" />
            )}
          </button>
          <button 
            onClick={() => handleTabSelect('chart')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold rounded transition-all ${activeTab === 'chart' ? 'bg-white shadow-sm text-excel-green' : 'text-gray-500 hover:bg-gray-200/50'}`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Charts
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-w-[260px]">
          <AnimatePresence mode="wait">
            {activeTab === 'training' && (
              <motion.div 
                key="training"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {!currentMission ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[12px] font-bold text-excel-green uppercase tracking-wider">Course Curriculum</h3>
                      <span className="text-[10px] font-bold text-excel-green">{completedMissions.length}/{MISSIONS.length} Done</span>
                    </div>
                    
                    {Array.from(new Set(MISSIONS.map(m => m.module))).map(moduleName => (
                      <div key={moduleName} className="space-y-2">
                         <h4 className="text-[11px] font-bold text-gray-400 uppercase border-b border-excel-border pb-1">{moduleName}</h4>
                         <div className="space-y-2">
                            {MISSIONS.filter(m => m.module === moduleName).map(m => {
                              const isCompleted = completedMissions.includes(m.id);
                              return (
                                <button
                                  key={m.id}
                                  onClick={() => handleStartMission(m.id)}
                                  className={`w-full text-left p-2.5 rounded border transition-all group relative overflow-hidden ${
                                    isCompleted 
                                      ? 'border-excel-green bg-excel-green/5 opacity-80' 
                                      : 'border-excel-border hover:border-excel-green hover:bg-excel-light-green'
                                  }`}
                                >
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                      m.category === 'Project' ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-excel-green bg-excel-light-green border-excel-green/20'
                                    }`}>
                                      {m.category}
                                    </span>
                                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-excel-green" />}
                                  </div>
                                  <h4 className={`font-bold text-[12px] leading-tight ${isCompleted ? 'text-excel-green' : 'text-excel-text'}`}>{m.title}</h4>
                                </button>
                              );
                            })}
                         </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-excel-border">
                      <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Career Insights</div>
                      <div className="p-3 bg-gray-50 rounded border border-excel-border space-y-2">
                         <div className="flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-excel-green shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-600 leading-tight"><strong>Analyst Tip:</strong> Cleaning takes 80% of the job. Master text functions!</p>
                         </div>
                         <div className="flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-excel-green shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-600 leading-tight"><strong>Portfolio Tip:</strong> Your projects in Module 7 should be your top CV highlights.</p>
                         </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => handleStartMission('')}
                        className="text-[11px] font-bold text-excel-green hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Back to Curriculum
                      </button>
                      {completedMissions.includes(currentMission.id) && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-excel-green">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-excel-light-green rounded border border-[#c5e0d1] p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-bold text-white bg-excel-green px-1.5 py-0.5 rounded leading-none lowercase tracking-tighter">
                            {currentMission.category}
                         </span>
                         <h3 className="text-[13px] font-bold text-excel-green uppercase tracking-tight">{currentMission.title}</h3>
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {viewMode === 'lesson' ? (
                          <motion.div
                            key="lesson"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-4"
                          >
                            <div className="bg-white/60 rounded p-3 border border-[#c5e0d1]">
                              <p className="text-[10px] font-bold text-excel-green uppercase mb-1">Concept Lesson:</p>
                              <p className="text-[11px] text-excel-text leading-relaxed">{currentMission.lesson || currentMission.description}</p>
                            </div>
                            <button 
                              onClick={() => setViewMode('task')}
                              className="w-full bg-excel-green text-white py-2 rounded text-[11px] font-bold hover:bg-excel-green-dark transition-colors flex items-center justify-center gap-2"
                            >
                              <Play className="w-3 h-3" /> Start Practical Task
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="task"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="space-y-4"
                          >
                            <p className="text-[12px] text-excel-text leading-tight">{currentMission.description}</p>
                            <div className="bg-white/60 rounded p-2.5 border border-[#c5e0d1]">
                              <p className="text-[10px] font-bold text-excel-green uppercase mb-1">Learning Task:</p>
                              <p className="text-[11px] text-excel-text font-medium italic">{currentMission.objective}</p>
                            </div>
  
                            {currentMission.objective.toLowerCase().includes('pivot') && activeTab !== 'pivot' && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => handleTabSelect('pivot')}
                                className="w-full bg-orange-100 text-orange-700 py-2 rounded text-[11px] font-bold border border-orange-200 flex items-center justify-center gap-2 hover:bg-orange-200 transition-colors"
                              >
                                <Layers className="w-4 h-4" /> Go to Pivot Tab to Start
                              </motion.button>
                            )}
                            
                            <div className="space-y-2">
                              <motion.button 
                                animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
                                onClick={handleCheck}
                                className={`w-full py-2 rounded text-[12px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                                  success 
                                    ? 'bg-white border-2 border-excel-green text-excel-green' 
                                    : error 
                                      ? 'bg-red-500 text-white' 
                                      : 'bg-excel-green text-white hover:bg-excel-green-dark'
                                }`}
                              >
                                {success ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" /> 
                                    Module Mastered!
                                  </>
                                ) : error ? (
                                  <>
                                    <AlertCircle className="w-4 h-4" />
                                    Wrong Answer - Check Below
                                  </>
                                ) : "Verify Solution"}
                              </motion.button>
  
                              <AnimatePresence>
                                {error && currentMission.expectedAnswer && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded text-[11px] text-red-800 leading-snug"
                                  >
                                    <p className="font-bold mb-1">Correct Solution:</p>
                                    <div className="bg-white/50 p-2 rounded border border-red-100 font-mono text-[10px]">
                                      {currentMission.expectedAnswer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {success && nextMission && (
                                <motion.button
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  onClick={() => handleStartMission(nextMission.id)}
                                  className="w-full bg-excel-green text-white py-2.5 rounded text-[12px] font-bold hover:bg-excel-green-dark transition-all shadow-md flex items-center justify-center gap-2 mt-2 border-2 border-white"
                                >
                                  Next Module: {nextMission.title} <Play className="w-3 h-3 fill-current" />
                                </motion.button>
                              )}
  
                              <button 
                                onClick={() => setShowHint(!showHint)}
                                className="w-full bg-white text-gray-600 border border-excel-border py-2 rounded text-[11px] font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                              >
                                <HelpCircle className="w-3.5 h-3.5" /> {showHint ? "Hide Hint" : "Need a Hint?"}
                              </button>
                              
                              <AnimatePresence>
                                {showHint && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-3 bg-yellow-50 border border-yellow-200 rounded text-[11px] text-yellow-800 leading-snug"
                                  >
                                    <strong>Excel Tip:</strong> {currentMission.hint}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
  
                            <button 
                              onClick={() => setViewMode('lesson')}
                              className="w-full text-center text-[10px] text-gray-400 hover:text-excel-green font-bold transition-colors"
                            >
                              Review Lesson
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
  
                    <div className="pt-4 border-t border-excel-border">
                       <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Training Insights</div>
                       <div className="h-24 bg-excel-header-bg rounded border border-excel-border flex items-end justify-around p-3 gap-1">
                          {MISSIONS.map((m, i) => {
                            const isDone = completedMissions.includes(m.id);
                            return (
                              <motion.div 
                                key={m.id} 
                                initial={{ height: '25%' }}
                                animate={{ height: isDone ? '100%' : '25%' }}
                                className={`w-4 rounded-t-sm transition-all duration-500 border-t-2 ${isDone ? 'bg-excel-green border-excel-green-dark' : 'bg-excel-green/10 border-excel-green/40'}`}
                                title={m.title}
                              ></motion.div>
                            );
                          })}
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
  
            {activeTab === 'pivot' && (
               <motion.div key="pivot" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Pivot Table Simulator</h3>
                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                      <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-xs text-gray-500">Drag fields to Rows or Values to start analysis.</p>
                    </div>
                    {/* Simplified Pivot controls would go here */}
                    <div className="space-y-4 pt-4">
                      <div className="text-xs font-bold text-gray-400">AVAILABLE FIELDS</div>
                      <div className="flex flex-wrap gap-2">
                         {['Date', 'Region', 'Product', 'Sales', 'Units'].map(f => (
                           <div key={f} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-xs shadow-sm cursor-move">
                             {f}
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
               </motion.div>
            )}
  
            {activeTab === 'chart' && (
               <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Visualization</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2">
                        <BarChart2 className="w-6 h-6 text-blue-500" />
                        <span className="text-[10px] font-bold">Bar Chart</span>
                      </button>
                      {/* Additional chart buttons */}
                    </div>
                    <p className="text-[10px] text-gray-500 italic mt-2">Select a range in the grid to generate a chart automatically.</p>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 min-w-[260px]">
           <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">QUICK ACTIONS</div>
           <button 
             onClick={clearGrid}
             className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
            >
             <RotateCcw className="w-3 h-3" /> Reset Worksheet
           </button>
        </div>
      </motion.div>
    </>
  );
};
