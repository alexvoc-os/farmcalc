// Tipuri pentru Planificatorul de Rotație Culturi

export interface Parcela {
  id: string;
  nume: string;
  suprafata: number; // hectare
  tipSol?: 'argilos' | 'nisipos' | 'lutos' | 'cernoziom';
  istoricCulturi: IstoricCultura[];
}

export interface IstoricCultura {
  an: number;
  culturaId: string;
  productie?: number; // kg/ha realizat
  observatii?: string;
}

export interface PlanRotatie {
  id: string;
  nume: string;
  anStart: number;
  aniPlanificati: number; // 3, 4 sau 5 ani
  parcele: Parcela[];
  planificare: PlanificareCultura[];
}

export interface PlanificareCultura {
  parcelaId: string;
  an: number;
  culturaId: string;
  esteRecomandat: boolean;
  avertismente: Avertisment[];
}

export interface Avertisment {
  tip: 'critic' | 'moderat' | 'info';
  mesaj: string;
}

export interface Cultura {
  id: string;
  nume: string;
  categorie: CategorieCultura;
  culoare: string; // pentru vizualizare
  // Reguli de rotație
  culturaAnterioaraBuna: string[]; // ID-uri culturi după care crește bine
  culturaAnterioaraRea: string[]; // ID-uri culturi de evitat
  aniPauza: number; // câți ani să nu revină pe aceeași parcelă
  fixeazaAzot: boolean; // leguminoase
  efectSol: 'pozitiv' | 'neutru' | 'negativ';
}

export type CategorieCultura =
  | 'cereale_paioase'    // grâu, orz, ovăz
  | 'cereale_prapsitoase' // porumb
  | 'oleaginoase'        // floarea soarelui, rapiță
  | 'leguminoase'        // soia, mazăre, fasole
  | 'nisa'               // in, cânepă, muștar
  | 'legume';            // sfeclă, cartofi

// Baza de date cu culturi și reguli de rotație
export const CULTURI_DB: Cultura[] = [
  // CEREALE PĂIOASE
  {
    id: 'grau',
    nume: 'Grâu',
    categorie: 'cereale_paioase',
    culoare: '#F59E0B', // amber
    culturaAnterioaraBuna: ['mazare', 'soia', 'rapita', 'floarea_soarelui', 'fasole'],
    culturaAnterioaraRea: ['grau', 'orz', 'ovaz'],
    aniPauza: 2,
    fixeazaAzot: false,
    efectSol: 'negativ',
  },
  {
    id: 'orz',
    nume: 'Orz',
    categorie: 'cereale_paioase',
    culoare: '#D97706', // amber darker
    culturaAnterioaraBuna: ['mazare', 'soia', 'rapita', 'porumb'],
    culturaAnterioaraRea: ['grau', 'orz', 'ovaz'],
    aniPauza: 2,
    fixeazaAzot: false,
    efectSol: 'negativ',
  },
  {
    id: 'ovaz',
    nume: 'Ovăz',
    categorie: 'cereale_paioase',
    culoare: '#B45309', // amber darkest
    culturaAnterioaraBuna: ['mazare', 'soia', 'cartofi'],
    culturaAnterioaraRea: ['grau', 'orz', 'ovaz'],
    aniPauza: 2,
    fixeazaAzot: false,
    efectSol: 'neutru',
  },

  // CEREALE PRĂȘITOARE
  {
    id: 'porumb',
    nume: 'Porumb',
    categorie: 'cereale_prapsitoase',
    culoare: '#EAB308', // yellow
    culturaAnterioaraBuna: ['grau', 'soia', 'mazare', 'fasole', 'rapita'],
    culturaAnterioaraRea: ['porumb', 'floarea_soarelui'],
    aniPauza: 2,
    fixeazaAzot: false,
    efectSol: 'negativ',
  },

  // OLEAGINOASE
  {
    id: 'floarea_soarelui',
    nume: 'Floarea Soarelui',
    categorie: 'oleaginoase',
    culoare: '#FBBF24', // yellow light
    culturaAnterioaraBuna: ['grau', 'orz', 'porumb'],
    culturaAnterioaraRea: ['floarea_soarelui', 'rapita', 'soia'],
    aniPauza: 6, // foarte important!
    fixeazaAzot: false,
    efectSol: 'negativ',
  },
  {
    id: 'rapita',
    nume: 'Rapiță',
    categorie: 'oleaginoase',
    culoare: '#84CC16', // lime
    culturaAnterioaraBuna: ['grau', 'orz', 'porumb'],
    culturaAnterioaraRea: ['rapita', 'floarea_soarelui', 'mustar'],
    aniPauza: 4,
    fixeazaAzot: false,
    efectSol: 'neutru',
  },

  // LEGUMINOASE (fixează azot!)
  {
    id: 'soia',
    nume: 'Soia',
    categorie: 'leguminoase',
    culoare: '#22C55E', // green
    culturaAnterioaraBuna: ['grau', 'porumb', 'orz'],
    culturaAnterioaraRea: ['soia', 'floarea_soarelui', 'mazare'],
    aniPauza: 3,
    fixeazaAzot: true,
    efectSol: 'pozitiv',
  },
  {
    id: 'mazare',
    nume: 'Mazăre',
    categorie: 'leguminoase',
    culoare: '#16A34A', // green darker
    culturaAnterioaraBuna: ['grau', 'porumb', 'orz', 'ovaz'],
    culturaAnterioaraRea: ['mazare', 'soia', 'fasole', 'linte'],
    aniPauza: 4,
    fixeazaAzot: true,
    efectSol: 'pozitiv',
  },
  {
    id: 'fasole',
    nume: 'Fasole',
    categorie: 'leguminoase',
    culoare: '#15803D', // green darkest
    culturaAnterioaraBuna: ['grau', 'porumb', 'cartofi'],
    culturaAnterioaraRea: ['fasole', 'mazare', 'soia'],
    aniPauza: 4,
    fixeazaAzot: true,
    efectSol: 'pozitiv',
  },
  {
    id: 'linte',
    nume: 'Linte',
    categorie: 'leguminoase',
    culoare: '#166534', // green dark
    culturaAnterioaraBuna: ['grau', 'orz'],
    culturaAnterioaraRea: ['linte', 'mazare', 'fasole'],
    aniPauza: 5,
    fixeazaAzot: true,
    efectSol: 'pozitiv',
  },

  // NIȘĂ
  {
    id: 'in',
    nume: 'In',
    categorie: 'nisa',
    culoare: '#3B82F6', // blue
    culturaAnterioaraBuna: ['grau', 'porumb', 'cartofi'],
    culturaAnterioaraRea: ['in', 'rapita'],
    aniPauza: 7,
    fixeazaAzot: false,
    efectSol: 'neutru',
  },
  {
    id: 'canepa',
    nume: 'Cânepă',
    categorie: 'nisa',
    culoare: '#2563EB', // blue darker
    culturaAnterioaraBuna: ['grau', 'porumb', 'mazare'],
    culturaAnterioaraRea: ['canepa'],
    aniPauza: 3,
    fixeazaAzot: false,
    efectSol: 'pozitiv', // curăță solul
  },
  {
    id: 'mustar',
    nume: 'Muștar',
    categorie: 'nisa',
    culoare: '#FCD34D', // yellow pale
    culturaAnterioaraBuna: ['grau', 'porumb'],
    culturaAnterioaraRea: ['rapita', 'mustar', 'floarea_soarelui'],
    aniPauza: 4,
    fixeazaAzot: false,
    efectSol: 'pozitiv', // biofumigant
  },
];

// Funcții helper
export function getCulturaById(id: string): Cultura | undefined {
  return CULTURI_DB.find(c => c.id === id);
}

export function getCulturiByCategorie(categorie: CategorieCultura): Cultura[] {
  return CULTURI_DB.filter(c => c.categorie === categorie);
}

export function verificaRotatie(
  culturaNoua: string,
  istoricParcela: IstoricCultura[],
  anPlanificat: number
): Avertisment[] {
  const avertismente: Avertisment[] = [];
  const cultura = getCulturaById(culturaNoua);

  if (!cultura) return avertismente;

  // Verifică anii de pauză
  const ultimaAparitie = istoricParcela
    .filter(h => h.culturaId === culturaNoua)
    .sort((a, b) => b.an - a.an)[0];

  if (ultimaAparitie) {
    const aniTrecuti = anPlanificat - ultimaAparitie.an;
    if (aniTrecuti < cultura.aniPauza) {
      avertismente.push({
        tip: 'critic',
        mesaj: `${cultura.nume} necesită ${cultura.aniPauza} ani pauză. Au trecut doar ${aniTrecuti} ani.`,
      });
    }
  }

  // Verifică cultura anterioară
  const culturaAnterioaraHist = istoricParcela
    .filter(h => h.an === anPlanificat - 1)[0];

  if (culturaAnterioaraHist) {
    const culturaAnt = getCulturaById(culturaAnterioaraHist.culturaId);

    if (cultura.culturaAnterioaraRea.includes(culturaAnterioaraHist.culturaId)) {
      avertismente.push({
        tip: 'critic',
        mesaj: `${cultura.nume} nu crește bine după ${culturaAnt?.nume || culturaAnterioaraHist.culturaId}.`,
      });
    } else if (cultura.culturaAnterioaraBuna.includes(culturaAnterioaraHist.culturaId)) {
      avertismente.push({
        tip: 'info',
        mesaj: `✓ Combinație bună: ${culturaAnt?.nume} → ${cultura.nume}`,
      });
    }
  }

  // Bonus pentru leguminoase
  if (cultura.fixeazaAzot) {
    avertismente.push({
      tip: 'info',
      mesaj: `${cultura.nume} fixează azot în sol - benefic pentru cultura următoare.`,
    });
  }

  return avertismente;
}

export const CATEGORII_CULTURI: { value: CategorieCultura; label: string; culoare: string }[] = [
  { value: 'cereale_paioase', label: 'Cereale păioase', culoare: 'bg-amber-100' },
  { value: 'cereale_prapsitoase', label: 'Cereale prășitoare', culoare: 'bg-yellow-100' },
  { value: 'oleaginoase', label: 'Oleaginoase', culoare: 'bg-lime-100' },
  { value: 'leguminoase', label: 'Leguminoase', culoare: 'bg-green-100' },
  { value: 'nisa', label: 'Culturi de nișă', culoare: 'bg-blue-100' },
];
