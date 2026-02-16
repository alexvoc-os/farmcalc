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
}

export interface Input {
  id: string;
  produs: string;
  categorie: 'seminte' | 'ingrasaminte' | 'erbicide' | 'fungicide' | 'insecticide';
  cantitatePerHa: number;
  unitateMasura: string;
  pretUnitar: number;
}

export interface Mecanizare {
  id: string;
  operatiune: string;
  consumMotorina: number; // litri/ha
  pretMotorina: number;
  oreLucru: number;
  costReparatii: number;
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
  costInputuri: number;
  costMecanizare: number;
  costManopera: number;
  costuriFixe: number;
  costTotal: number;
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
