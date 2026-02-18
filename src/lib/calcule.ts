import { Cultura, RezultatCalcul, Input, Mecanizare, Manopera, CostFix } from '@/types';

export function calculeazaCosturi(cultura: Cultura): RezultatCalcul {
  // Costuri inputuri separate per hectar
  const costInputuri = cultura.inputuri.reduce((total, input) => {
    return total + (input.cantitatePerHa * input.pretUnitar);
  }, 0);

  // Calcule detaliate mecanizare
  let totalConsumMotorina = 0;
  let totalCostMotorina = 0;
  let totalRetributii = 0;
  let totalMaterialeOperatiuni = 0;

  cultura.mecanizare.forEach((mec) => {
    // Motorină
    totalConsumMotorina += mec.consumMotorina || 0;
    totalCostMotorina += (mec.consumMotorina || 0) * (mec.pretMotorina || 0);

    // Retribuții/manoperă per operațiune
    totalRetributii += mec.retributii || 0;

    // Materiale legate de operațiune
    if (mec.materiale && mec.materiale.length > 0) {
      mec.materiale.forEach((mat) => {
        totalMaterialeOperatiuni += (mat.cantitate || 0) * (mat.pretUnitar || 0);
      });
    }
  });

  // Cost total mecanizare = motorină + retribuții + materiale operațiuni
  const costMecanizare = totalCostMotorina + totalRetributii + totalMaterialeOperatiuni;

  // Costuri manoperă suplimentară (cea separată, nu din operațiuni)
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
    // Detalii mecanizare
    totalConsumMotorina,
    totalCostMotorina,
    totalRetributii,
    totalMaterialeOperatiuni,
    // Venituri
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
