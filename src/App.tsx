/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Grid } from './components/Grid';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { FormulaBar } from './components/FormulaBar';
import { ChartSection } from './components/ChartSection';
import { PivotSection } from './components/PivotSection';
import { useExcelStore } from './store';
import { MISSIONS } from './constants';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, BookOpen, Zap, Menu, X } from 'lucide-react';

export default function App() {
  const { grid, activeTab, completedMissions, currentMission, sidebarOpen, toggleSidebar } = useExcelStore();
  const filledCellsCount = Object.keys(grid).length;
  const progressPercent = Math.round((completedMissions.length / MISSIONS.length) * 100);

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none bg-excel-bg">
      {/* App Header */}
      <header className="h-10 bg-excel-green text-white px-4 flex items-center justify-between shrink-0 shadow-sm z-50">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleSidebar}
            className="p-1 hover:bg-white/10 rounded md:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm tracking-tight text-white">Excel</span>
          <span className="font-normal text-sm tracking-tight text-white/90">Simulator</span>
          <span className="opacity-70 text-[11px] ml-4 hidden md:inline font-normal shrink-0">Data Analyst Training v2.0</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold shrink-0">
          <span className="opacity-90 text-white">User: Senior_Analyst_01</span>
          <div className="w-6 h-6 rounded-full bg-excel-green-dark flex items-center justify-center border border-white/20 text-[10px] text-white">
            SA
          </div>
        </div>
      </header>

      <Toolbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {activeTab === 'training' && !currentMission ? (
            <main className="flex-1 overflow-auto bg-excel-bg p-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl border border-excel-border shadow-sm p-8">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-excel-green rounded-2xl flex items-center justify-center text-white">
                         <Layers className="w-8 h-8" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-excel-text">Excel Data Analyst Mastery</h1>
                        <p className="text-gray-500">Transform from beginner to job-ready analyst.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-4 rounded-lg bg-excel-light-green/30 border border-excel-green/20">
                         <h3 className="font-bold text-excel-green mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> 7 Core Modules
                         </h3>
                         <p className="text-xs text-gray-600">Step-by-step curriculum covering everything from SUM to Dashboard projects.</p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                         <h3 className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Portfolio Projects
                         </h3>
                         <p className="text-xs text-gray-600">Build real-world business reports and segments as your final assignments.</p>
                      </div>
                   </div>

                   <div className="space-y-4 mb-8">
                      <h2 className="font-bold text-excel-text border-b border-excel-border pb-2">Choose Your Starting Point</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {[
                           { level: 'Beginner', icon: '🌱', startId: 'm1-1', desc: 'Interface & Basic Math' },
                           { level: 'Intermediate', icon: '🚀', startId: 'm2-1', desc: 'Cleaning & Logical IF' },
                           { level: 'Advanced', icon: '💎', startId: 'm6-1', desc: 'Profiling & Projects' }
                         ].map(item => (
                           <button 
                             key={item.level}
                             onClick={() => useExcelStore.getState().startMission(item.startId)}
                             className="text-left p-4 rounded-xl border border-excel-border hover:border-excel-green hover:shadow-md transition-all group"
                           >
                             <div className="text-2xl mb-2">{item.icon}</div>
                             <div className="font-bold text-excel-text group-hover:text-excel-green">{item.level}</div>
                             <div className="text-[10px] text-gray-500">{item.desc}</div>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h2 className="font-bold text-excel-text border-b border-excel-border pb-2">Course Progress</h2>
                      <div className="flex items-center gap-4">
                         <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-excel-green transition-all" style={{ width: `${progressPercent}%` }}></div>
                         </div>
                         <span className="font-bold text-excel-green">{progressPercent}%</span>
                      </div>
                      <p className="text-xs text-gray-500 italic">Select a module from the sidebar on the right to begin your journey!</p>
                   </div>
                </div>
              </div>
            </main>
          ) : activeTab === 'sheet' || activeTab === 'training' ? (
            <>
              <FormulaBar />
              <main className="flex-1 overflow-hidden relative border-t border-excel-border">
                <Grid />
              </main>
            </>
          ) : activeTab === 'chart' ? (
            <main className="flex-1 overflow-auto border-t border-excel-border">
              <ChartSection />
            </main>
          ) : activeTab === 'pivot' ? (
            <main className="flex-1 overflow-auto bg-excel-bg border-t border-excel-border">
              <PivotSection />
            </main>
          ) : null}
        </div>
        <Sidebar />
      </div>

      <footer className="h-6 bg-excel-green text-white text-[11px] px-4 flex items-center justify-between shrink-0 z-50 font-medium whitespace-nowrap">
        <div className="flex items-center gap-6 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
               <span>Ready</span>
            </div>
            <span className="opacity-30">|</span>
            <div className="flex items-center gap-3">
              <span>Training:</span>
              <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden border border-white/10 hidden sm:block">
                <motion.div 
                  className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <span className="opacity-30">|</span>
            <span className="opacity-80">Modules: {completedMissions.length}/{MISSIONS.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="hidden sm:flex items-center gap-4 opacity-70">
            <span>Average: --</span>
            <span>Sum: --</span>
          </div>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span>100%</span>
        </div>
      </footer>
    </div>
  );
}


