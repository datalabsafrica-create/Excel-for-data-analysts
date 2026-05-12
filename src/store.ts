/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { GridData, Selection, CellData, TabType, Mission } from './types';
import { evaluateFormula, getCellId } from './lib/formula';
import { SAMPLE_DATASETS, MISSIONS } from './constants';

interface ExcelStore {
  grid: GridData;
  selection: Selection;
  activeTab: TabType;
  ribbonTab: string;
  currentMission: Mission | null;
  completedMissions: string[];
  history: GridData[];
  sidebarOpen: boolean;
  modulesUnlocked: boolean;
  
  updateCell: (id: string, formula: string) => void;
  setSelection: (selection: Selection) => void;
  setActiveTab: (tab: TabType) => void;
  setRibbonTab: (tab: string) => void;
  loadDataset: (datasetName: 'sales' | 'finance' | 'empty') => void;
  startMission: (missionId: string) => void;
  checkMission: () => boolean;
  clearGrid: () => void;
  toggleSidebar: () => void;
  unlockModules: () => void;
}

export const useExcelStore = create<ExcelStore>((set, get) => ({
  grid: {},
  selection: { start: null, end: null },
  activeTab: 'training',
  ribbonTab: 'Insert',
  currentMission: null,
  completedMissions: [],
  history: [],
  sidebarOpen: true,
  modulesUnlocked: false,

  updateCell: (id: string, formula: string) => {
    set((state) => {
      const newGrid = { ...state.grid };
      
      // Update cell with new formula
      const val = formula.startsWith('=') 
        ? evaluateFormula(formula, state.grid)
        : isNaN(Number(formula)) || formula === '' ? formula : Number(formula);
      
      newGrid[id] = { value: val, formula };

      // Re-evaluate all other cells that might depend on this (simple pass)
      Object.keys(newGrid).forEach(key => {
        if (newGrid[key].formula.startsWith('=')) {
          newGrid[key].value = evaluateFormula(newGrid[key].formula, newGrid);
        }
      });

      return { grid: newGrid };
    });
  },

  setSelection: (selection) => set({ selection }),
  
  setActiveTab: (activeTab) => set({ activeTab }),

  setRibbonTab: (ribbonTab) => set({ ribbonTab }),

  loadDataset: (datasetName) => {
    const data = SAMPLE_DATASETS[datasetName];
    const newGrid: GridData = {};
    
    data.forEach((row, rowIndex) => {
      Object.entries(row).forEach(([colKey, val], colIndex) => {
        const headerId = getCellId(0, colIndex);
        newGrid[headerId] = { value: colKey, formula: colKey };
        
        const cellId = getCellId(rowIndex + 1, colIndex);
        newGrid[cellId] = { value: val as any, formula: String(val) };
      });
    });

    set({ grid: newGrid, activeTab: 'sheet' });
  },

  startMission: (missionId) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (mission) {
      set({ currentMission: mission });
      get().loadDataset(mission.dataset as 'sales' | 'finance' | 'empty');
    } else {
      set({ currentMission: null, activeTab: 'training' });
    }
  },

  checkMission: () => {
    const { currentMission, grid, completedMissions } = get();
    if (!currentMission) return false;
    const isCorrect = currentMission.checkSolution(grid);
    
    if (isCorrect && !completedMissions.includes(currentMission.id)) {
      set({ completedMissions: [...completedMissions, currentMission.id] });
    }
    
    return isCorrect;
  },

  clearGrid: () => set({ grid: {} }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  unlockModules: () => set({ modulesUnlocked: true }),
}));
