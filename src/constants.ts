/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Mission } from './types';

export const INITIAL_ROWS = 100;
export const INITIAL_COLS = 26; // A-Z

export const COL_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const SAMPLE_DATASETS = {
  empty: [],
  sales: [
    { Date: '2023-01-01', Region: 'North', Product: 'Laptop', Sales: 1200, Units: 1 },
    { Date: '2023-01-02', Region: 'South', Product: 'Mouse', Sales: 50, Units: 2 },
    { Date: '2023-01-03', Region: 'East', Product: 'Monitor', Sales: 300, Units: 1 },
    { Date: '2023-01-04', Region: 'West', Product: 'Laptop', Sales: 1200, Units: 1 },
    { Date: '2023-01-05', Region: 'North', Product: 'Keyboard', Sales: 80, Units: 1 },
    { Date: '2023-01-06', Region: 'South', Product: 'Laptop', Sales: 1200, Units: 1 },
    { Date: '2023-01-07', Region: 'East', Product: 'Mouse', Sales: 25, Units: 1 },
  ],
  finance: [
    { Month: 'Jan', Revenue: 5000, Expenses: 3000, Tax: 500 },
    { Month: 'Feb', Revenue: 6000, Expenses: 3200, Tax: 600 },
    { Month: 'Mar', Revenue: 5500, Expenses: 3100, Tax: 550 },
    { Month: 'Apr', Revenue: 7000, Expenses: 3500, Tax: 700 },
    { Month: 'May', Revenue: 8000, Expenses: 4000, Tax: 800 },
  ]
};

export const MISSIONS: Mission[] = [
  // MODULE 1: Excel Fundamentals
  {
    id: 'm1-1',
    title: 'Excel Interface & Data Entry',
    module: 'Module 1: Excel Fundamentals',
    category: 'Beginner',
    description: 'Learn the basics of moving around and entering data.',
    lesson: 'Excel is a grid of cells identified by Column (Letters) and Row (Numbers). To enter data, simply click a cell and start typing. In data analysis, the first row is usually your "headers" which describe what the data in each column is.',
    objective: 'Enter "Region" in A1, "Sales" in B1, and "North" in A2.',
    dataset: 'empty',
    initialData: {},
    hint: 'Just click a cell and type. Press Enter to confirm.',
    expectedAnswer: 'A1="Region", B1="Sales", A2="North"',
    checkSolution: (grid) => grid['A1']?.value === 'Region' && grid['B1']?.value === 'Sales' && grid['A2']?.value === 'North'
  },
  {
    id: 'm1-2',
    title: 'Basic Math (SUM & AVERAGE)',
    module: 'Module 1: Excel Fundamentals',
    category: 'Beginner',
    description: 'Calculate the total and average revenue for the financial year.',
    lesson: 'Formulas always start with an equal sign (=). SUM(Range) adds up all numbers in a selection. AVERAGE(Range) calculates the mean. For example, =SUM(A1:A5) adds everything from cell A1 to A5.',
    objective: 'In cell B7 enter =SUM(B2:B6). In B8 enter =AVERAGE(B2:B6).',
    dataset: 'finance',
    initialData: {},
    hint: 'SUM adds up numbers; AVERAGE finds the mean.',
    expectedAnswer: 'B7 should be 31500, B8 should be 6300',
    checkSolution: (grid) => {
      const sum = grid['B7']?.value;
      const avg = grid['B8']?.value;
      return Number(sum) === 31500 && Number(avg) === 6300;
    }
  },

  // MODULE 2: Data Cleaning
  {
    id: 'm2-1',
    title: 'Text Functions (UPPER & TRIM)',
    module: 'Module 2: Data Cleaning',
    category: 'Intermediate',
    description: 'Clean up messy product names by converting them to uppercase.',
    lesson: 'Cleaning data is 80% of an analyst\'s job. UPPER(cell) converts text to ALL CAPS. This is useful for standardizing names like "laptop", "Laptop", and "LAPTOP" so they map correctly in your analysis.',
    objective: 'In cell F2, use =UPPER(C2) to clean the first product name.',
    dataset: 'sales',
    initialData: {},
    hint: 'UPPER() makes text all caps (e.g. =UPPER(C2)).',
    expectedAnswer: 'F2 should contain the capitalized value from C2 (e.g. "LAPTOP"). Formula: =UPPER(C2)',
    checkSolution: (grid) => String(grid['F2']?.formula).toUpperCase().includes('UPPER') && String(grid['F2']?.value) === String(grid['C2']?.value).toUpperCase()
  },

  // MODULE 3: Advanced Functions
  {
    id: 'm3-1',
    title: 'Logical IF Analysis',
    module: 'Module 3: Functions for Analysis',
    category: 'Intermediate',
    description: 'Categorize sales performance against a target of 1000 units.',
    lesson: 'IF functions allow Excel to make decisions. The syntax is =IF(test, value_if_true, value_if_false). For example, =IF(A1>10, "Yes", "No") checks if A1 is greater than 10.',
    objective: 'In F2, use: =IF(D2>1000,"High","Low"). (Row 2 has 1200 sales).',
    dataset: 'sales',
    initialData: {},
    hint: '=IF(condition, "Result If True", "Result If False")',
    expectedAnswer: 'F2 should be "High" because D2 (1200) > 1000',
    checkSolution: (grid) => String(grid['F2']?.formula).toUpperCase().includes('IF') && String(grid['F2']?.value).toLowerCase() === 'high'
  },
  {
    id: 'm3-2',
    title: 'Powerful VLOOKUP',
    module: 'Module 3: Functions for Analysis',
    category: 'Intermediate',
    description: 'Find data instantly across large tables.',
    lesson: 'VLOOKUP stands for "Vertical Lookup". It searches for a value in the first column of a table and returns a value in the same row from a column you specify. =VLOOKUP(lookup_val, range, col_index, [exact_match]). Use 0 for exact match.',
    objective: 'In G1, find Sales for "East" using =VLOOKUP("East", B2:D8, 3, 0)',
    dataset: 'sales',
    initialData: {},
    hint: 'VLOOKUP needs: lookup value, range, column index, and 0 for exact match.',
    expectedAnswer: 'G1 should be 300. Formula: =VLOOKUP("East", B2:D8, 3, 0)',
    checkSolution: (grid) => String(grid['G1']?.formula).toUpperCase().includes('VLOOKUP') && Number(grid['G1']?.value) === 300
  },

  // MODULE 4: Pivot Tables
  {
    id: 'm4-1',
    title: 'Pivot Table Basics',
    module: 'Module 4: Data Analysis Techniques',
    category: 'Intermediate',
    description: 'Identify trends using Pivot Tables.',
    lesson: 'Pivot Tables are the crown jewel of Excel. They aggregate large datasets instantly. You can summarize millions of rows by dragging fields into Rows and Values. It\'s like building a puzzle but for data!',
    objective: 'Switch to the Pivot tab and drag Region to Rows and Sales to Values.',
    dataset: 'sales',
    initialData: {},
    hint: 'Pivot tables are the #1 tool for data analysts.',
    checkSolution: () => true // Manual check for now as simulation is limited
  },

  // MODULE 5: Data Visualization
  {
    id: 'm5-1',
    title: 'Charts & Graphs',
    module: 'Module 5: Data Visualization',
    category: 'Intermediate',
    description: 'Visualize sales trends using the Chart tab.',
    lesson: 'Charts bring data to life. A Column Chart is best for comparing categories (like Regions), while a Line Chart is best for trends over time. Design tip: Keep it clean and avoid 3D charts!',
    objective: 'Switch to the Charts tab and select "Column Chart" to visualize Regional Sales.',
    dataset: 'sales',
    initialData: {},
    hint: 'Charts help stakeholders understand data at a glance.',
    checkSolution: () => true
  },

  // MODULE 6: Advanced Excel
  {
    id: 'm6-1',
    title: 'Power Analysis Tools',
    module: 'Module 6: Advanced Excel',
    category: 'Advanced',
    description: 'Use advanced auditing tools for deep analysis.',
    lesson: 'Data profiling is the art of understanding your data before analyzing it. Functions like LEN() tell you how many characters are in a cell, helping you find inconsistent IDs or messy text formatting.',
    objective: 'In H1 enter =LEN(B2). In H2 find the MAX(D2:D8).',
    dataset: 'sales',
    initialData: {},
    hint: 'LEN, MAX, MIN and ROUND are essential for data profiling.',
    expectedAnswer: 'H1: =LEN(B2) which is 5, H2: =MAX(D2:D8) which is 1200',
    checkSolution: (grid) => Number(grid['H1']?.value) === 5 && Number(grid['H2']?.value) === 1200
  },

  // MODULE 7: REAL WORLD PROJECTS
  {
    id: 'p1',
    title: 'Project 1: Sales Performance Dashboard',
    module: 'Module 7: Real-World Projects',
    category: 'Project',
    description: 'Build a full sales overview for the Regional Manager.',
    lesson: 'Now it\'s graduation time. Your job is to take raw sales data and turn it into actionable insights. Use every tool: cleaning, formulas, and pivots to create a polished summary report.',
    objective: 'Summarize all regional sales using Pivot Tables.',
    dataset: 'sales',
    initialData: {},
    hint: 'Combine your knowledge of cleaning, formulas, and charts.',
    checkSolution: (grid) => true
  },
  {
    id: 'p2',
    title: 'Project 2: Financial Audit',
    module: 'Module 7: Real-World Projects',
    category: 'Project',
    description: 'Check for tax inconsistencies in the report.',
    lesson: 'Accountants make mistakes! As an analyst, you often audit financial data. Use IF statements to flag any tax entries that don\'t match the expected percentage based on revenue.',
    objective: 'In E2, flag if Tax is > 11% of Revenue using =IF(D2/B2 > 0.11, "Review", "OK").',
    dataset: 'finance',
    initialData: {},
    hint: 'D is Tax, B is Revenue. E2 is the target cell.',
    expectedAnswer: '=IF(D2/B2 > 0.11, "Review", "OK")',
    checkSolution: (grid) => String(grid['E2']?.formula).toUpperCase().includes('IF') && !!grid['E2']?.value
  },
  {
    id: 'p3',
    title: 'Project 3: Healthcare Dataset Analysis',
    module: 'Module 7: Real-World Projects',
    category: 'Project',
    description: 'Analyze patient waiting times and costs.',
    lesson: 'In healthcare, efficiency saves lives (and money). Analyzing waiting times per department helps hospital managers allocate staff better. Use Pivot Tables to find the averages.',
    objective: 'Calculate the average waiting time and total cost per department.',
    dataset: 'finance',
    initialData: {},
    hint: 'Use Pivot Tables for quick department summaries.',
    checkSolution: (grid) => true
  },
  {
    id: 'p4',
    title: 'Project 4: Customer Segmentation',
    module: 'Module 7: Real-World Projects',
    category: 'Project',
    description: 'Segment customers based on their purchase volume.',
    lesson: 'Marketing teams use segmentation to target specific groups. "High Value" customers drive most revenue. Use VLOOKUP or IF to bucket customers based on their sales volume.',
    objective: 'Use VLOOKUP or nested IFs to categorize customers.',
    dataset: 'sales',
    initialData: {},
    hint: 'High-value customers are those with > 1000 units sold.',
    checkSolution: (grid) => true
  },
  {
    id: 'p5',
    title: 'Project 5: Business KPI Dashboard',
    module: 'Module 7: Real-World Projects',
    category: 'Project',
    description: 'Final Exam: Create a KPI dashboard tracking Revenue and Expenses.',
    lesson: 'The ultimate skill: The Dashboard. This is where you combine multiple data points into a single "Command Center" for business owners. This capstone project proves your analyst mastery.',
    objective: 'Build a summary sheet with key metrics and a combo chart.',
    dataset: 'finance',
    initialData: {},
    hint: 'This is the capstone project. Good luck!',
    checkSolution: (grid) => true
  }
];
