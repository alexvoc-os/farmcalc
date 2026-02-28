export interface Cultura {
  id: string;
  nume: string;
  hectare: number;
  inputuri: Input[];
  mecanizare: Mecanizare[];
  manopera: Manopera[];
  costuriFixe: CostFix[];
  productie: number; // kg/ha
  pretVanzare: number; // lei/kg
  subventiePerHa: number; // lei/ha (APIA, eco, etc.)
  anAgricol?: string; // An agricol în format YYYY-YYYY (ex: 2024-2025)
}

export interface Input {
  id: string;
  produs: string;
  categorie: 'seminte' | 'ingrasaminte' | 'erbicide' | 'fungicide' | 'insecticide';
  cantitatePerHa: number;
  unitateMasura: string;
  pretUnitar: number;
}

// Material legat de o operațiune
export interface MaterialOperatiune {
  id: string;
  denumire: string;
  um: string; // unitate măsură (kg, l, etc.)
  cantitate: number;
  pretUnitar: number;
}

export interface Mecanizare {
  id: string;
  operatiune: string; // PĂSTRAT pentru compatibilitate cu date vechi
  data?: string; // format ISO "2024-05-15" (opțional)

  // NOI - legături la entități din sistem de management
  lucrareId?: string; // ID lucrare din listă predefinită
  utilajId?: string; // ID tractor
  implementId?: string; // ID implement

  consumMotorina: number; // litri/ha
  pretMotorina: number;
  retributii: number; // manopera/retribuții pentru această operațiune (lei/ha)
  materiale: MaterialOperatiune[]; // materiale folosite în această operațiune
}

export interface Manopera {
  id: string;
  activitate: string;
  tip: 'permanent' | 'sezonier' | 'terti';
  orePerHa: number;
  costOrar: number;
}

export interface CostFix {
  id: string;
  element: string;
  costPerHa: number;
}

export interface RezultatCalcul {
  // Costuri detaliate
  costInputuri: number;
  costMecanizare: number;
  costManopera: number;
  costuriFixe: number;
  costTotal: number;
  // Detalii mecanizare
  totalConsumMotorina: number; // litri/ha total
  totalCostMotorina: number; // lei/ha
  totalRetributii: number; // lei/ha (manopera din operațiuni)
  totalMaterialeOperatiuni: number; // lei/ha (materiale legate de operațiuni)
  // Venituri
  venitVanzare: number;
  venitSubventii: number;
  venitBrut: number;
  marjaBruta: number;
  marjaProcentuala: number;
  breakEvenKg: number;
}

export type CategorieInput = Input['categorie'];

export const CULTURI_PREDEFINITE = [
  'Grâu',
  'Porumb',
  'Orz',
  'Ovăz',
  'Floarea Soarelui',
  'Rapiță',
  'Soia'
] as const;

export const CATEGORII_INPUT: { value: CategorieInput; label: string }[] = [
  { value: 'seminte', label: 'Semințe' },
  { value: 'ingrasaminte', label: 'Îngrășăminte' },
  { value: 'erbicide', label: 'Erbicide' },
  { value: 'fungicide', label: 'Fungicide' },
  { value: 'insecticide', label: 'Insecticide' },
];

// === SISTEM MANAGEMENT UTILAJE ===

// Lucrare agricolă (compusă din utilaj + implement + consum)
export interface LucrareAgricolaPredefinita {
  id: string;
  nume: string; // Generat automat: "Plug 5 trupițe + John Deere 6230"
  utilajId: string; // ID tractor
  implementId: string; // ID implement
  consumMotorina: number; // litri/ha
  descriere?: string; // Opțional - note suplimentare
}

// Tractor din fermă
export interface Utilaj {
  id: string;
  nume: string; // "John Deere 6230"
  marca: string; // "John Deere"
  model: string; // "6230"
  putereCP: number; // 230
  anFabricatie: number; // 2018
  consumMediuLOra?: number; // 12 L/h (opțional, pentru calcul automat viitor)
  valoare?: number; // valoare de inventar (opțional)
  isGlobal: boolean; // true = predefinit, false = custom user
}

// Implement agricol
export interface Implement {
  id: string;
  nume: string; // "Plug reversibil 5 trupițe"
  tip: 'plug' | 'disc' | 'semanatoare' | 'combinator' | 'tocator' | 'stropitoare' | 'combina' | 'altele';
  latimeLucru?: number; // metri (opțional)
  numarRanduri?: number; // pentru semănători, secerători (opțional)
  greutate?: number; // kg - pentru calcul rezistență (opțional)
  isGlobal: boolean; // true = predefinit, false = custom user
}
