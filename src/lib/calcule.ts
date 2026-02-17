import { Cultura, RezultatCalcul, Input, Mecanizare, Manopera, CostFix } from '@/types';

export function calculeazaCosturi(cultura: Cultura): RezultatCalcul {
  // Costuri inputuri per hectar
  const costInputuri = cultura.inputuri.reduce((total, input) => {
    return total + (input.cantitatePerHa * input.pretUnitar);
  }, 0);

  // Costuri mecanizare per hectar
  const costMecanizare = cultura.mecanizare.reduce((total, mec) => {
    const costMotorina = mec.consumMotorina * mec.pretMotorina;
    return total + costMotorina + mec.costReparatii;
  }, 0);

  // Costuri manoperă per hectar
  const costManopera = cultura.manopera.reduce((total, man) => {
    return total + (man.orePerHa * man.costOrar);
  }, 0);

  // Costuri fixe per hectar
  const costuriFixe = cultura.costuriFixe.reduce((total, fix) => {
    return total + fix.costPerHa;
  }, 0);

  // Total
  const costTotal = costInputuri + costMecanizare + costManopera + costuriFixe;

  // Venit și marjă
  const venitVanzare = cultura.productie * cultura.pretVanzare;
  const venitSubventii = cultura.subventiePerHa || 0;
  const venitBrut = venitVanzare + venitSubventii;
  const marjaBruta = venitBrut - costTotal;
  const marjaProcentuala = venitBrut > 0 ? (marjaBruta / venitBrut) * 100 : 0;

  // Break-even (kg necesari pentru a acoperi costurile, fără subvenții)
  const costuriDeAcoperit = costTotal - venitSubventii;
  const breakEvenKg = cultura.pretVanzare > 0 ? Math.max(0, costuriDeAcoperit / cultura.pretVanzare) : 0;

  return {
    costInputuri,
    costMecanizare,
    costManopera,
    costuriFixe,
    costTotal,
    venitVanzare,
    venitSubventii,
    venitBrut,
    marjaBruta,
    marjaProcentuala,
    breakEvenKg,
  };
}

export function formateazaNumar(numar: number, decimale: number = 0): string {
  return numar.toLocaleString('ro-RO', {
    minimumFractionDigits: decimale,
    maximumFractionDigits: decimale,
  });
}

export function formateazaLei(suma: number): string {
  return `${formateazaNumar(suma, 0)} lei`;
}

export function formateazaProcent(procent: number): string {
  return `${formateazaNumar(procent, 1)}%`;
}

export function genereazaId(): string {
  // Generează UUID valid pentru Supabase
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback pentru browsere mai vechi
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Valori default pentru culturile comune
export const DEFAULTS_CULTURI: Record<string, Partial<Cultura>> = {
  'Grâu': {
    productie: 5500,
    pretVanzare: 0.95,
  },
  'Porumb': {
    productie: 9000,
    pretVanzare: 0.85,
  },
  'Floarea Soarelui': {
    productie: 2800,
    pretVanzare: 2.10,
  },
  'Rapiță': {
    productie: 3200,
    pretVanzare: 2.30,
  },
  'Soia': {
    productie: 2500,
    pretVanzare: 2.00,
  },
  'Orz': {
    productie: 5000,
    pretVanzare: 0.80,
  },
  'Ovăz': {
    productie: 4000,
    pretVanzare: 0.75,
  },
};
