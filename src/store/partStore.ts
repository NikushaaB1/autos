import { create } from 'zustand';
import type { PartRecord } from '../types';
import { partsDbService } from '../services/partsDb';

interface PartState {
  records: PartRecord[];
  searchQuery: string;
  selectedCategory: string | null;
  currentPage: number;
  recordsPerPage: number;

  // Actions
  fetchRecords: () => void;
  addRecord: (record: Omit<PartRecord, 'id' | 'dateAdded'>) => void;
  updateRecord: (id: string, record: Partial<PartRecord>) => void;
  deleteRecord: (id: string) => void;
  importCSV: (csvText: string) => { success: boolean; count: number; error?: string };
  restoreDatabase: (records: PartRecord[]) => void;

  // UI Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setCurrentPage: (page: number) => void;

  // Selectors
  getFilteredRecords: () => PartRecord[];
}

export const usePartStore = create<PartState>((set, get) => ({
  records: [],
  searchQuery: '',
  selectedCategory: null,
  currentPage: 1,
  recordsPerPage: 10,

  fetchRecords: () => {
    const records = partsDbService.getRecords();
    set({ records });
  },

  addRecord: (recordData) => {
    partsDbService.addRecord(recordData);
    get().fetchRecords();
    set({ currentPage: 1 });
  },

  updateRecord: (id, recordData) => {
    partsDbService.updateRecord(id, recordData);
    get().fetchRecords();
  },

  deleteRecord: (id) => {
    partsDbService.deleteRecord(id);
    get().fetchRecords();

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

      // Headers expected: კოდი, დასახელება, კატეგორია, მარკა, მოდელი, წელი, რაოდენობა, ფასი, მომწოდებელი, შენიშვნა
      const recordsToImport: Omit<PartRecord, 'id' | 'dateAdded'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const matches = line.match(/(\".*?\"|[^\",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cols = matches.map(c => c.replace(/^"|"$/g, '').trim());

        if (cols.length < 2) continue;

        const code = cols[0] || '';
        const name = cols[1] || 'უცნობი';
        const category = cols[2] || 'სხვა';
        const make = cols[3] || 'სხვა';
        const model = cols[4] || 'უცნობი';
        const year = parseInt(cols[5]) || new Date().getFullYear();
        const quantity = parseInt(cols[6]) || 1;
        const price = parseFloat(cols[7]) || 0;
        const supplier = cols[8] || '';
        const note = cols[9] || '';

        recordsToImport.push({
          code, name, category, make, model, year, quantity, price, supplier, note
        });
      }

      if (recordsToImport.length === 0) {
        return { success: false, count: 0, error: 'დასაიმპორტებელი მონაცემები ვერ მოიძებნა.' };
      }

      const currentRecords = partsDbService.getRecords();

      const newSeeded: PartRecord[] = recordsToImport.map((item, index) => {
        return {
          ...item,
          id: `part-imported-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 5)}`,
          dateAdded: new Date().toISOString(),
        };
      });

      const updated = [...newSeeded, ...currentRecords];
      partsDbService.restoreDatabase(updated);
      get().fetchRecords();
      set({ currentPage: 1 });

      return { success: true, count: recordsToImport.length };
    } catch (e: any) {
      console.error(e);
      return { success: false, count: 0, error: e.message || 'დაფიქსირდა შეცდომა CSV იმპორტის დროს.' };
    }
  },

  restoreDatabase: (records) => {
    partsDbService.restoreDatabase(records);
    get().fetchRecords();
    set({ currentPage: 1, searchQuery: '', selectedCategory: null });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category, currentPage: 1 });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  getFilteredRecords: () => {
    const { records, searchQuery, selectedCategory } = get();
    return records.filter((r) => {
      // Filter by category
      if (selectedCategory && r.category !== selectedCategory) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        return (
          r.code.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.make.toLowerCase().includes(query) ||
          r.model.toLowerCase().includes(query) ||
          r.year.toString().includes(query) ||
          r.supplier.toLowerCase().includes(query) ||
          r.note.toLowerCase().includes(query)
        );
      }

      return true;
    });
  },
}));
