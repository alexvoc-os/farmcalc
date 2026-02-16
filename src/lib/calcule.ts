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
  const venitBrut = cultura.productie * cultura.pretVanzare;
  const marjaBruta = venitBrut - costTotal;
  const marjaProcentuala = venitBrut > 0 ? (marjaBruta / venitBrut) * 100 : 0;

  // Break-even (kg necesari pentru a acoperi costurile)
  const breakEvenKg = cultura.pretVanzare > 0 ? costTotal / cultura.pretVanzare : 0;

  return {
    costInputuri,
    costMecanizare,
    costManopera,
    costuriFixe,
    costTotal,
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
  return Math.random().toString(36).substring(2, 9);
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
