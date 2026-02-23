import { Cultura, Mecanizare, CostFix, Manopera } from '@/types';
import { genereazaId } from './calcule';

export interface TemplateCultura {
  id: string;
  nume: string;
  descriere: string;
  icon: string; // nume icon Lucide (Wheat, Sprout, etc.)
  mecanizare: Omit<Mecanizare, 'id'>[]; // fără ID, se generează la import
  manopera: Omit<Manopera, 'id'>[];
  costuriFixe: Omit<CostFix, 'id'>[];
  productieEstimata: number; // kg/ha
  pretVanzareEstimat: number; // lei/kg
  subventiePerHa: number;
}

export const TEMPLATES_CULTURI: TemplateCultura[] = [
  {
    id: 'template-grau',
    nume: 'Grâu',
    descriere: 'Fișă tehnologică standard pentru grâu (zona Câmpia Română)',
    icon: 'Wheat',
    mecanizare: [
      {
        operatiune: 'Dezmiriștit',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Fertilizat cu îngrășăminte chimice',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'NPK 20:20:0', um: 'kg', cantitate: 200, pretUnitar: 2.8 },
        ],
      },
      {
        operatiune: 'Pregătire pat germinativ',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Semănat grâu',
        consumMotorina: 5,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [
          { id: genereazaId(), denumire: 'Sămânță grâu certificată', um: 'kg', cantitate: 220, pretUnitar: 2.5 },
        ],
      },
      {
        operatiune: 'Erbicidat + Insecticid',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Erbicid (ex. Omnera)', um: 'kg', cantitate: 0.8, pretUnitar: 117 },
          { id: genereazaId(), denumire: 'Insecticid (ex. Deltagri)', um: 'l', cantitate: 0.3, pretUnitar: 52 },
        ],
      },
      {
        operatiune: 'Fungicid + stimulator foliar',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Fungicid (ex. Falcon Pro)', um: 'l', cantitate: 0.6, pretUnitar: 170 },
          { id: genereazaId(), denumire: 'Stimulator foliar', um: 'l', cantitate: 2, pretUnitar: 23 },
        ],
      },
      {
        operatiune: 'Recoltat grâu',
        consumMotorina: 22,
        pretMotorina: 8.0,
        retributii: 132,
        materiale: [],
      },
    ],
    manopera: [
      {
        activitate: 'Operator utilaje',
        tip: 'permanent',
        orePerHa: 4,
        costOrar: 35,
      },
      {
        activitate: 'Supraveghere și management',
        tip: 'permanent',
        orePerHa: 0.5,
        costOrar: 50,
      },
    ],
    costuriFixe: [
      { element: 'Arendă', costPerHa: 800 },
      { element: 'Asigurare culturi', costPerHa: 120 },
      { element: 'Impozit teren', costPerHa: 50 },
    ],
    productieEstimata: 5500,
    pretVanzareEstimat: 0.95,
    subventiePerHa: 1200,
  },
  {
    id: 'template-porumb',
    nume: 'Porumb',
    descriere: 'Fișă tehnologică standard pentru porumb (zona Câmpia Română)',
    icon: 'Wheat',
    mecanizare: [
      {
        operatiune: 'Dezmiriștit',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Fertilizat de bază',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'NPK 15:15:15', um: 'kg', cantitate: 250, pretUnitar: 2.5 },
        ],
      },
      {
        operatiune: 'Pregătire teren',
        consumMotorina: 12,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Semănat porumb',
        consumMotorina: 6,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [
          { id: genereazaId(), denumire: 'Sămânță porumb hibrid', um: 'kg', cantitate: 25, pretUnitar: 18 },
        ],
      },
      {
        operatiune: 'Erbicidat preemergent',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Erbicid preemergent', um: 'l', cantitate: 4, pretUnitar: 45 },
        ],
      },
      {
        operatiune: 'Fertilizare în vegetație',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Uree', um: 'kg', cantitate: 150, pretUnitar: 1.8 },
        ],
      },
      {
        operatiune: 'Erbicidat postemergent',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Erbicid postemergent', um: 'l', cantitate: 2.5, pretUnitar: 60 },
        ],
      },
      {
        operatiune: 'Recoltat porumb',
        consumMotorina: 25,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
    ],
    manopera: [
      {
        activitate: 'Operator utilaje',
        tip: 'permanent',
        orePerHa: 5,
        costOrar: 35,
      },
      {
        activitate: 'Supraveghere cultură',
        tip: 'permanent',
        orePerHa: 0.8,
        costOrar: 50,
      },
    ],
    costuriFixe: [
      { element: 'Arendă', costPerHa: 850 },
      { element: 'Asigurare culturi', costPerHa: 140 },
      { element: 'Impozit teren', costPerHa: 50 },
    ],
    productieEstimata: 8000,
    pretVanzareEstimat: 1.1,
    subventiePerHa: 1200,
  },
  {
    id: 'template-floarea-soarelui',
    nume: 'Floarea-Soarelui',
    descriere: 'Fișă tehnologică standard pentru floarea-soarelui',
    icon: 'Sun',
    mecanizare: [
      {
        operatiune: 'Dezmiriștit',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Fertilizat de bază',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'NPK 16:16:16', um: 'kg', cantitate: 200, pretUnitar: 2.6 },
        ],
      },
      {
        operatiune: 'Pregătire pat germinativ',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Semănat floarea-soarelui',
        consumMotorina: 5,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [
          { id: genereazaId(), denumire: 'Sămânță floarea-soarelui hibrid', um: 'kg', cantitate: 7, pretUnitar: 35 },
        ],
      },
      {
        operatiune: 'Erbicidat',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Erbicid selective', um: 'l', cantitate: 2, pretUnitar: 55 },
        ],
      },
      {
        operatiune: 'Insecticid + Fungicid',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Insecticid', um: 'l', cantitate: 0.4, pretUnitar: 65 },
          { id: genereazaId(), denumire: 'Fungicid', um: 'l', cantitate: 0.5, pretUnitar: 120 },
        ],
      },
      {
        operatiune: 'Recoltat',
        consumMotorina: 20,
        pretMotorina: 8.0,
        retributii: 140,
        materiale: [],
      },
    ],
    manopera: [
      {
        activitate: 'Operator utilaje',
        tip: 'permanent',
        orePerHa: 4.5,
        costOrar: 35,
      },
      {
        activitate: 'Management cultură',
        tip: 'permanent',
        orePerHa: 0.6,
        costOrar: 50,
      },
    ],
    costuriFixe: [
      { element: 'Arendă', costPerHa: 750 },
      { element: 'Asigurare culturi', costPerHa: 130 },
      { element: 'Impozit teren', costPerHa: 50 },
    ],
    productieEstimata: 3000,
    pretVanzareEstimat: 2.5,
    subventiePerHa: 1200,
  },
  {
    id: 'template-rapita',
    nume: 'Rapiță',
    descriere: 'Fișă tehnologică standard pentru rapiță de toamnă',
    icon: 'Leaf',
    mecanizare: [
      {
        operatiune: 'Dezmiriștit',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Fertilizat de bază',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'NPK 18:46:0', um: 'kg', cantitate: 180, pretUnitar: 3.0 },
        ],
      },
      {
        operatiune: 'Pregătire teren',
        consumMotorina: 10,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [],
      },
      {
        operatiune: 'Semănat rapiță',
        consumMotorina: 5,
        pretMotorina: 8.0,
        retributii: 150,
        materiale: [
          { id: genereazaId(), denumire: 'Sămânță rapiță hibrid', um: 'kg', cantitate: 5, pretUnitar: 45 },
        ],
      },
      {
        operatiune: 'Erbicidat toamnă',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Erbicid rapiță', um: 'l', cantitate: 1.5, pretUnitar: 70 },
        ],
      },
      {
        operatiune: 'Insecticid toamnă',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Insecticid (purice)', um: 'l', cantitate: 0.3, pretUnitar: 85 },
        ],
      },
      {
        operatiune: 'Fertilizare primăvară',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Uree', um: 'kg', cantitate: 180, pretUnitar: 1.8 },
        ],
      },
      {
        operatiune: 'Fungicid primăvară',
        consumMotorina: 1,
        pretMotorina: 8.0,
        retributii: 80,
        materiale: [
          { id: genereazaId(), denumire: 'Fungicid rapiță', um: 'l', cantitate: 1, pretUnitar: 150 },
        ],
      },
      {
        operatiune: 'Recoltat rapiță',
        consumMotorina: 18,
        pretMotorina: 8.0,
        retributii: 130,
        materiale: [],
      },
    ],
    manopera: [
      {
        activitate: 'Operator utilaje',
        tip: 'permanent',
        orePerHa: 4.8,
        costOrar: 35,
      },
      {
        activitate: 'Supraveghere cultură',
        tip: 'permanent',
        orePerHa: 0.7,
        costOrar: 50,
      },
    ],
    costuriFixe: [
      { element: 'Arendă', costPerHa: 780 },
      { element: 'Asigurare culturi', costPerHa: 135 },
      { element: 'Impozit teren', costPerHa: 50 },
    ],
    productieEstimata: 3500,
    pretVanzareEstimat: 2.3,
    subventiePerHa: 1200,
  },
];

// Funcție helper pentru a crea Cultura din template
export function createCulturaFromTemplate(
  template: TemplateCultura,
  hectare: number = 100
): Cultura {
  return {
    id: genereazaId(),
    nume: template.nume,
    hectare,
    inputuri: [], // Inputuri separate inițial goale
    mecanizare: template.mecanizare.map(m => ({
      ...m,
      id: genereazaId(),
      materiale: m.materiale?.map(mat => ({
        ...mat,
        id: genereazaId(),
      })) || [],
    })),
    manopera: template.manopera.map(man => ({
      ...man,
      id: genereazaId(),
    })),
    costuriFixe: template.costuriFixe.map(cf => ({
      ...cf,
      id: genereazaId(),
    })),
    productie: template.productieEstimata,
    pretVanzare: template.pretVanzareEstimat,
    subventiePerHa: template.subventiePerHa,
  };
}
