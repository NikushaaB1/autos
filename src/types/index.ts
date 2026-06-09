export interface OilRecord {
  id: string;
  code: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  oilType: string;
  viscosity: string;
  note: string;
  dateAdded: string; // ISO date string
}

export interface PartRecord {
  id: string;
  code: string;           // Part code / SKU
  name: string;           // Part name
  category: string;       // Category (ამორტიზატორი, საკიდარი, etc.)
  make: string;           // Car brand
  model: string;          // Car model
  year: number;           // Car year
  quantity: number;       // Quantity
  price: number;          // Price (GEL)
  supplier: string;       // Supplier name
  note: string;
  dateAdded: string;      // ISO date string
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}

export interface MakeStats {
  make: string;
  count: number;
  percentage: number;
}

export interface ViscosityStats {
  viscosity: string;
  count: number;
}

export interface HistoryStats {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalRecords: number;
  brandsCount: number;
  viscositiesCount: number;
  recentRecords: OilRecord[];
  topViscosities: ViscosityStats[];
  makeDistribution: MakeStats[];
  historyStats: HistoryStats[];
}
