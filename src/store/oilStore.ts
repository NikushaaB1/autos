import { create } from 'zustand';
import type { OilRecord, DashboardStats, MakeStats, ViscosityStats, HistoryStats } from '../types';
import { dbService } from '../services/db';

interface OilState {
  records: OilRecord[];
  searchQuery: string;
  selectedMake: string | null;
  currentPage: number;
  recordsPerPage: number;
  
  // Actions
  fetchRecords: () => void;
  addRecord: (record: Omit<OilRecord, 'id' | 'dateAdded'>) => void;
  updateRecord: (id: string, record: Partial<OilRecord>) => void;
  deleteRecord: (id: string) => void;
  importCSV: (csvText: string) => { success: boolean; count: number; error?: string };
  restoreDatabase: (records: OilRecord[]) => void;
  
  // UI Actions
  setSearchQuery: (query: string) => void;
  setSelectedMake: (make: string | null) => void;
  setCurrentPage: (page: number) => void;
  
  // Selectors
  getFilteredRecords: () => OilRecord[];
  getStats: () => DashboardStats;
}

export const useOilStore = create<OilState>((set, get) => ({
  records: [],
  searchQuery: '',
  selectedMake: null,
  currentPage: 1,
  recordsPerPage: 10,

  fetchRecords: () => {
    const records = dbService.getRecords();
    set({ records });
  },

  addRecord: (recordData) => {
    dbService.addRecord(recordData);
    get().fetchRecords();
    set({ currentPage: 1 }); // Go to page 1 to see the new record
  },

  updateRecord: (id, recordData) => {
    dbService.updateRecord(id, recordData);
    get().fetchRecords();
  },

  deleteRecord: (id) => {
    dbService.deleteRecord(id);
    get().fetchRecords();
    
    // Adjust page if current page becomes empty
    const { currentPage, recordsPerPage } = get();
    const filteredCount = get().getFilteredRecords().length;
    const maxPage = Math.max(1, Math.ceil(filteredCount / recordsPerPage));
    if (currentPage > maxPage) {
      set({ currentPage: maxPage });
    }
  },

  importCSV: (csvText) => {
    try {
      const lines = csvText.split(/\r?\n/);
      if (lines.length <= 1) {
        return { success: false, count: 0, error: 'ფაილი ცარიელია ან არასწორი ფორმატის ტიპისაა.' };
      }

      // Simple CSV parser
      // Headers expected: ზეთის კოდი, ავტომობილის მარკა, ავტომობილის მოდელი, გამოშვების წელი, ძრავი, ზეთის ტიპი, სიბლანტე, შენიშვნა
      // We also handle English or standard headers or assume column mapping:
      // index 0: code, 1: make, 2: model, 3: year, 4: engine, 5: oilType, 6: viscosity, 7: note
      const recordsToImport: Omit<OilRecord, 'id' | 'dateAdded'>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by comma, handling quotes if any
        // Regex to split by commas not inside quotes
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cols = matches.map(c => c.replace(/^"|"$/g, '').trim());

        if (cols.length < 2) continue; // Skip invalid lines

        const code = cols[0] || '';
        const make = cols[1] || 'სხვა';
        const model = cols[2] || 'უცნობი';
        const year = parseInt(cols[3]) || new Date().getFullYear();
        const engine = cols[4] || '-';
        const oilType = cols[5] || 'სინთეტიკური';
        const viscosity = cols[6] || '5W-30';
        const note = cols[7] || '';

        recordsToImport.push({
          code,
          make,
          model,
          year,
          engine,
          oilType,
          viscosity,
          note
        });
      }

      if (recordsToImport.length === 0) {
        return { success: false, count: 0, error: 'დასაიმპორტებელი მონაცემები ვერ მოიძებნა.' };
      }

      // Add all to DB
      const currentRecords = dbService.getRecords();
      
      const newSeeded: OilRecord[] = recordsToImport.map((item, index) => {
        return {
          ...item,
          id: `oil-imported-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 5)}`,
          dateAdded: new Date().toISOString(),
        };
      });

      const updated = [...newSeeded, ...currentRecords];
      dbService.restoreDatabase(updated);
      get().fetchRecords();
      set({ currentPage: 1 });

      return { success: true, count: recordsToImport.length };
    } catch (e: any) {
      console.error(e);
      return { success: false, count: 0, error: e.message || 'დაფიქსირდა შეცდომა CSV იმპორტის დროს.' };
    }
  },

  restoreDatabase: (records) => {
    dbService.restoreDatabase(records);
    get().fetchRecords();
    set({ currentPage: 1, searchQuery: '', selectedMake: null });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  setSelectedMake: (make) => {
    set({ selectedMake: make, currentPage: 1 });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  getFilteredRecords: () => {
    const { records, searchQuery, selectedMake } = get();
    return records.filter((r) => {
      // Filter by make first
      if (selectedMake) {
        if (selectedMake === 'სხვა') {
          // Check if it's not one of the standard makes
          const standardMakes = [
            'Mercedes-Benz',
            'BMW',
            'Audi',
            'Volkswagen',
            'Subaru',
            'Toyota',
            'Lexus',
            'Porsche',
          ];
          if (standardMakes.includes(r.make)) {
            return false;
          }
        } else if (r.make.toLowerCase() !== selectedMake.toLowerCase()) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          r.code.toLowerCase().includes(query) ||
          r.make.toLowerCase().includes(query) ||
          r.model.toLowerCase().includes(query) ||
          r.engine.toLowerCase().includes(query) ||
          r.year.toString().includes(query) ||
          r.viscosity.toLowerCase().includes(query) ||
          r.note.toLowerCase().includes(query)
        );
      }

      return true;
    });
  },

  getStats: () => {
    const { records } = get();
    const totalRecords = records.length;

    // Standard makes
    const standardMakes = [
      'Mercedes-Benz',
      'BMW',
      'Audi',
      'Volkswagen',
      'Subaru',
      'Toyota',
      'Lexus',
      'Porsche',
    ];

    // Compute Brand Distribution
    const makeCounts: Record<string, number> = {};
    records.forEach((r) => {
      const isStandard = standardMakes.some(
        (m) => m.toLowerCase() === r.make.toLowerCase()
      );
      const key = isStandard ? r.make : 'სხვა';
      makeCounts[key] = (makeCounts[key] || 0) + 1;
    });

    const makeDistribution: MakeStats[] = Object.keys(makeCounts).map((make) => ({
      make,
      count: makeCounts[make],
      percentage: totalRecords > 0 ? Math.round((makeCounts[make] / totalRecords) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Compute Viscosity Distribution
    const viscosityCounts: Record<string, number> = {};
    records.forEach((r) => {
      const v = r.viscosity.trim() || 'სხვა';
      viscosityCounts[v] = (viscosityCounts[v] || 0) + 1;
    });

    const topViscosities: ViscosityStats[] = Object.keys(viscosityCounts).map((v) => ({
      viscosity: v,
      count: viscosityCounts[v],
    })).sort((a, b) => b.count - a.count);

    const viscositiesCount = topViscosities.length;
    const brandsCount = new Set(records.map((r) => r.make)).size;

    // Get 5 most recent records
    const recentRecords = [...records]
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 5);

    // Compute History Stats (Records created in last 7 days)
    const historyCounts: Record<string, number> = {};
    const dateArr: string[] = [];
    
    // Generate last 7 days dates in DD.MM format
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      dateArr.push(label);
      historyCounts[label] = 0;
    }

    records.forEach((r) => {
      const rDate = new Date(r.dateAdded);
      const label = `${rDate.getDate().toString().padStart(2, '0')}.${(rDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (historyCounts[label] !== undefined) {
        historyCounts[label]++;
      }
    });

    // Make history cumulative or direct count. Let's make it direct additions per day
    const historyStats: HistoryStats[] = dateArr.map((date) => ({
      date,
      count: historyCounts[date],
    }));

    return {
      totalRecords,
      brandsCount,
      viscositiesCount,
      recentRecords,
      topViscosities,
      makeDistribution,
      historyStats,
    };
  },
}));
