import type { PartRecord } from '../types';

const STORAGE_KEY = 'ts_auto_parts_database';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Seed data
const initialRecords: Omit<PartRecord, 'id' | 'dateAdded'>[] = [
  {
    code: 'SK-001',
    name: 'წინა ამორტიზატორი',
    category: 'ამორტიზატორი',
    make: 'Mercedes-Benz',
    model: 'E-Class (W212)',
    year: 2015,
    quantity: 2,
    price: 280,
    supplier: 'AutoParts GE',
    note: 'Bilstein B4 OE ხარისხი, წყვილი.',
  },
  {
    code: 'SK-002',
    name: 'უკანა საკიდრის ბერკეტი',
    category: 'საკიდარი',
    make: 'BMW',
    model: 'X5 (F15)',
    year: 2016,
    quantity: 1,
    price: 195,
    supplier: 'Germanparts',
    note: 'Lemförder, მარჯვენა მხარე.',
  },
  {
    code: 'SK-003',
    name: 'სამუხრუჭე ხუნდი წინა',
    category: 'სამუხრუჭე სისტემა',
    make: 'Audi',
    model: 'A4 (B9)',
    year: 2018,
    quantity: 4,
    price: 85,
    supplier: 'TRW Parts',
    note: 'TRW GDB1960, ნახევრადმეტალური.',
  },
  {
    code: 'SK-004',
    name: 'საჭის რეიკა',
    category: 'საჭის სისტემა',
    make: 'Toyota',
    model: 'Camry (XV50)',
    year: 2014,
    quantity: 1,
    price: 450,
    supplier: 'AutoParts GE',
    note: 'ელექტროჰიდრავლიკური, განახლებული.',
  },
  {
    code: 'SK-005',
    name: 'შრუსი გარე',
    category: 'ტრანსმისია',
    make: 'Volkswagen',
    model: 'Golf VII',
    year: 2017,
    quantity: 2,
    price: 120,
    supplier: 'GKN Driveline',
    note: 'GKN ორიგინალი, ABS სენსორით.',
  },
  {
    code: 'SK-006',
    name: 'თვლის საკისარი წინა',
    category: 'საკისარი',
    make: 'Subaru',
    model: 'Forester',
    year: 2013,
    quantity: 2,
    price: 75,
    supplier: 'NSK Bearings',
    note: 'NSK, 4WD მოდელისთვის.',
  },
  {
    code: 'SK-007',
    name: 'სტაბილიზატორის თრაპეცია',
    category: 'საკიდარი',
    make: 'Lexus',
    model: 'RX 350',
    year: 2016,
    quantity: 2,
    price: 45,
    supplier: 'CTR Parts',
    note: 'CTR CLHO-49, წინა.',
  },
  {
    code: 'SK-008',
    name: 'სამუხრუჭე დისკი უკანა',
    category: 'სამუხრუჭე სისტემა',
    make: 'Porsche',
    model: 'Cayenne (92A)',
    year: 2015,
    quantity: 2,
    price: 320,
    supplier: 'Brembo',
    note: 'Brembo 09.C400.11, ვენტილირებული.',
  },
  {
    code: 'SK-009',
    name: 'ქვედა ბერკეტი',
    category: 'საკიდარი',
    make: 'Mercedes-Benz',
    model: 'C-Class (W205)',
    year: 2017,
    quantity: 1,
    price: 165,
    supplier: 'Meyle',
    note: 'Meyle HD, გაძლიერებული ვერსია.',
  },
  {
    code: 'SK-010',
    name: 'კარდანის ჯვარაკი',
    category: 'ტრანსმისია',
    make: 'BMW',
    model: 'M5 (E60)',
    year: 2008,
    quantity: 1,
    price: 55,
    supplier: 'GKN Driveline',
    note: 'Hardy Spicer, უკანა კარდანისთვის.',
  },
];

export const partsDbService = {
  // Read records
  getRecords(): PartRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial data
      const seeded: PartRecord[] = initialRecords.map((item, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (10 - Math.floor(index / 2)));
        return {
          ...item,
          id: `part-${index + 1}-${generateId()}`,
          dateAdded: date.toISOString(),
        };
      });
      this.saveRecords(seeded);
      return seeded;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse parts database from localStorage', e);
      return [];
    }
  },

  // Save records
  saveRecords(records: PartRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  // Create record
  addRecord(record: Omit<PartRecord, 'id' | 'dateAdded'>): PartRecord {
    const records = this.getRecords();
    const newRecord: PartRecord = {
      ...record,
      id: `part-${Date.now()}-${generateId()}`,
      dateAdded: new Date().toISOString(),
    };
    records.unshift(newRecord);
    this.saveRecords(records);
    return newRecord;
  },

  // Update record
  updateRecord(id: string, updatedFields: Partial<PartRecord>): PartRecord {
    const records = this.getRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`ჩანაწერი ID-ით "${id}" ვერ მოიძებნა.`);
    }
    const updatedRecord = { ...records[index], ...updatedFields };
    records[index] = updatedRecord;
    this.saveRecords(records);
    return updatedRecord;
  },

  // Delete record
  deleteRecord(id: string): void {
    const records = this.getRecords();
    const filtered = records.filter((r) => r.id !== id);
    this.saveRecords(filtered);
  },

  // Replace whole database (restore backup)
  restoreDatabase(records: PartRecord[]): void {
    this.saveRecords(records);
  },

  // Clear database
  clearDatabase(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
