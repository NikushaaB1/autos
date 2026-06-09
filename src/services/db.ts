import type { OilRecord } from '../types';

const STORAGE_KEY = 'ts_auto_oil_database';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Seed data
const initialRecords: Omit<OilRecord, 'id' | 'dateAdded'>[] = [
  {
    code: '61074780',
    make: 'Mercedes-Benz',
    model: 'E 350 (W212)',
    year: 2016,
    engine: '3.5 V6',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'MB 229.51 დაშვება, ორიგინალი ფილტრი.',
  },
  {
    code: 'CK47875',
    make: 'BMW',
    model: 'X5 (F15)',
    year: 2015,
    engine: '3.0d N57',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'BMW Longlife-04 დაშვება.',
  },
  {
    code: 'W712/83',
    make: 'Volkswagen',
    model: 'Golf VI',
    year: 2012,
    engine: '1.4 TSI',
    oilType: 'სინთეტიკური',
    viscosity: '5W-40',
    note: 'VW 502.00 / 505.00 დაშვება, ტურბო ძრავი.',
  },
  {
    code: 'HU6006',
    make: 'Audi',
    model: 'A4 (B9)',
    year: 2018,
    engine: '2.0 TFSI',
    oilType: 'სინთეტიკური',
    viscosity: '0W-20',
    note: 'VW 508.00 / 509.00 Longlife IV, მწვანე ზეთი.',
  },
  {
    code: 'W68X90',
    make: 'Toyota',
    model: 'Prius (XW30)',
    year: 2013,
    engine: '1.8 Hybrid',
    oilType: 'სინთეტიკური',
    viscosity: '0W-20',
    note: 'დაბალი სიბლანტის ზეთი ჰიბრიდული ძრავისთვის.',
  },
  {
    code: 'HU918/5X',
    make: 'BMW',
    model: '328i (F30)',
    year: 2014,
    engine: '2.0 Turbo N20',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'BMW Longlife-01 დაშვება.',
  },
  {
    code: 'SC7078P',
    make: 'Porsche',
    model: 'Cayenne (92A)',
    year: 2015,
    engine: '3.6 V6',
    oilType: 'სინთეტიკური',
    viscosity: '5W-40',
    note: 'Porsche A40 დაშვება, სპორტული მუშაობისთვის.',
  },
  {
    code: '29002',
    make: 'Subaru',
    model: 'Forester',
    year: 2011,
    engine: '2.5 FB25',
    oilType: 'სინთეტიკური',
    viscosity: '0W-20',
    note: 'ოპოზიტური ძრავის სპეციალური დაშვებით.',
  },
  {
    code: 'W4900',
    make: 'Lexus',
    model: 'RX 350',
    year: 2017,
    engine: '3.5 V6 2GR-FKS',
    oilType: 'სინთეტიკური',
    viscosity: '0W-20',
    note: 'Toyota/Lexus ორიგინალი ზეთი API SP / ILSAC GF-6A.',
  },
  {
    code: '22009',
    make: 'Toyota',
    model: 'Camry (XV50)',
    year: 2015,
    engine: '2.5 2AR-FE',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'ორიგინალი რეკომენდაცია, გამძლე ძრავი.',
  },
  {
    code: 'CUK1919',
    make: 'Mercedes-Benz',
    model: 'C 250 (W205)',
    year: 2015,
    engine: '2.0 Turbo M274',
    oilType: 'სინთეტიკური',
    viscosity: '5W-40',
    note: 'MB 229.5 დაშვება, სალონის ნახშირის ფილტრთან ერთად.',
  },
  {
    code: 'W920/32',
    make: 'Subaru',
    model: 'Impreza',
    year: 2008,
    engine: '2.0 EJ20',
    oilType: 'ნახევრად სინთეტიკური',
    viscosity: '10W-40',
    note: 'ძველი თაობის ოპოზიტური ძრავისთვის.',
  },
  {
    code: 'HU911/4X',
    make: 'BMW',
    model: 'M5 (E60)',
    year: 2007,
    engine: '5.0 V10 S85',
    oilType: 'სინთეტიკური',
    viscosity: '10W-60',
    note: 'სპორტული M-Power ძრავის რეკომენდაცია.',
  },
  {
    code: 'HU711/6Z',
    make: 'Volkswagen',
    model: 'Passat B7',
    year: 2013,
    engine: '2.0 TDI',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'VW 507.00 DPF ფილტრიანი დიზელისთვის.',
  },
  {
    code: 'HU7025',
    make: 'Audi',
    model: 'Q7 (4M)',
    year: 2016,
    engine: '3.0 TDI V6',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'VW 504.00/507.00 დაშვება.',
  },
  {
    code: 'C2733',
    make: 'Porsche',
    model: 'Macan',
    year: 2018,
    engine: '2.0 Turbo',
    oilType: 'სინთეტიკური',
    viscosity: '0W-40',
    note: 'Mobil 1 ESP Formula, Porsche C30 დაშვება.',
  },
  {
    code: '1919',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG (W463)',
    year: 2020,
    engine: '4.0 BiTurbo V8',
    oilType: 'სინთეტიკური',
    viscosity: '5W-40',
    note: 'MB 229.52 დაშვება, AMG სპორტული ძრავი.',
  },
  {
    code: 'HU722Z',
    make: 'სხვა',
    model: 'Opel Astra J',
    year: 2011,
    engine: '1.4 Turbo',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'Dexos 2 დაშვება, გერმანული სტანდარტით.',
  },
  {
    code: 'A9401',
    make: 'Toyota',
    model: 'Land Cruiser 200',
    year: 2016,
    engine: '4.5 D-4D Diesel',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'სუპერ ტურბოდიზელის სპეციალური ფილტრაცია.',
  },
  {
    code: 'FAF10656',
    make: 'სხვა',
    model: 'Nissan X-Trail',
    year: 2014,
    engine: '2.0 dCi',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'Renault-Nissan dCi სტანდარტი.',
  },
  {
    code: 'YEC0149',
    make: 'სხვა',
    model: 'Honda Accord',
    year: 2015,
    engine: '2.4 i-VTEC',
    oilType: 'სინთეტიკური',
    viscosity: '0W-20',
    note: 'VTEC ძრავის მაღალი ბრუნებისთვის.',
  },
  {
    code: '10779',
    make: 'Lexus',
    model: 'GS 350',
    year: 2013,
    engine: '3.5 V6 2GR-FSE',
    oilType: 'სინთეტიკური',
    viscosity: '5W-30',
    note: 'მაღალი საიმედოობის სპორტ-სედანი.',
  },
  {
    code: '10599',
    make: 'Subaru',
    model: 'Outback',
    year: 2016,
    engine: '2.5i FB25',
    oilType: 'სინთეტიკური',
    viscosity: '0W-20',
    note: 'Lineartronic ვარიატორთან თავსებადი ძრავი.',
  }
];

export const dbService = {
  // Read records
  getRecords(): OilRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial data with date ranges over the last few days
      const seeded: OilRecord[] = initialRecords.map((item, index) => {
        // Distribute dates in the last 10 days
        const date = new Date();
        date.setDate(date.getDate() - (10 - Math.floor(index / 2)));
        return {
          ...item,
          id: `oil-${index + 1}-${generateId()}`,
          dateAdded: date.toISOString(),
        };
      });
      this.saveRecords(seeded);
      return seeded;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse database from localStorage', e);
      return [];
    }
  },

  // Save records
  saveRecords(records: OilRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  // Create record
  addRecord(record: Omit<OilRecord, 'id' | 'dateAdded'>): OilRecord {
    const records = this.getRecords();
    const newRecord: OilRecord = {
      ...record,
      id: `oil-${Date.now()}-${generateId()}`,
      dateAdded: new Date().toISOString(),
    };
    records.unshift(newRecord); // Add to the top
    this.saveRecords(records);
    return newRecord;
  },

  // Update record
  updateRecord(id: string, updatedFields: Partial<OilRecord>): OilRecord {
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
  restoreDatabase(records: OilRecord[]): void {
    this.saveRecords(records);
  },

  // Clear database
  clearDatabase(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
