import * as XLSX from 'xlsx';
import { Cultura, RezultatCalcul } from '@/types';

/**
 * Exportă fișa tehnologică completă într-un fișier Excel (.xlsx)
 * cu multiple sheet-uri pentru toate datele culturilor
 */
export function exportToExcel(cultura: Cultura, rezultat: RezultatCalcul) {
  // Creare workbook nou
  const wb = XLSX.utils.book_new();

  // === SHEET 1: Informații Generale ===
  const infoGenerala = [
    ['FIȘĂ TEHNOLOGICĂ - CALCULAȚIE COSTURI'],
    [''],
    ['Cultură:', cultura.nume],
    ['Suprafață:', cultura.hectare, 'ha'],
    ['Producție estimată:', cultura.productie, 'kg/ha'],
    ['Preț vânzare:', cultura.pretVanzare, 'lei/kg'],
    ['Subvenție/ha:', cultura.subventiePerHa, 'lei'],
    [''],
    ['Data export:', new Date().toLocaleDateString('ro-RO')],
    ['Oră export:', new Date().toLocaleTimeString('ro-RO')],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(infoGenerala);
  XLSX.utils.book_append_sheet(wb, ws1, 'Informații Generale');

  // === SHEET 2: Lucrări Agricole ===
  const lucrariFiltrate = [...cultura.mecanizare].sort((a, b) => {
    if (!a.data && !b.data) return 0;
    if (!a.data) return 1;
    if (!b.data) return -1;
    return new Date(a.data).getTime() - new Date(b.data).getTime();
  });

  const lucrariHeader = [
    'Nr.',
    'Data',
    'Operațiune',
    'Consum motorină (L/ha)',
    'Preț motorină (lei/L)',
    'Cost motorină (lei/ha)',
    'Retribuții (lei/ha)',
    'Cost materiale (lei/ha)',
    'TOTAL OPERAȚIUNE (lei/ha)'
  ];

  const lucrariData = lucrariFiltrate.map((mec, idx) => {
    const costMotorina = (mec.consumMotorina || 0) * (mec.pretMotorina || 0);
    const costMateriale = (mec.materiale || []).reduce((sum, m) => sum + (m.cantitate || 0) * (m.pretUnitar || 0), 0);
    const totalOp = costMotorina + (mec.retributii || 0) + costMateriale;

    return [
      idx + 1,
      mec.data || '-',
      mec.operatiune,
      mec.consumMotorina || 0,
      mec.pretMotorina || 0,
      costMotorina,
      mec.retributii || 0,
      costMateriale,
      totalOp
    ];
  });

  const lucrariSheet = [
    ['LUCRĂRI AGRICOLE (FIȘĂ TEHNOLOGICĂ)'],
    [''],
    lucrariHeader,
    ...lucrariData,
    [],
    ['', '', '', '', '', '', 'TOTAL LUCRĂRI:', '', rezultat.costMecanizare]
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(lucrariSheet);
  XLSX.utils.book_append_sheet(wb, ws2, 'Lucrări Agricole');

  // === SHEET 3: Materiale din Operațiuni (detaliat) ===
  const materialeHeader = ['Operațiune', 'Material', 'UM', 'Cantitate/ha', 'Preț unitar', 'Cost total (lei/ha)'];
  const materialeData: any[] = [];

  lucrariFiltrate.forEach(mec => {
    if (mec.materiale && mec.materiale.length > 0) {
      mec.materiale.forEach(mat => {
        materialeData.push([
          mec.operatiune,
          mat.denumire,
          mat.um,
          mat.cantitate,
          mat.pretUnitar,
          (mat.cantitate || 0) * (mat.pretUnitar || 0)
        ]);
      });
    }
  });

  const materialeSheet = [
    ['MATERIALE FOLOSITE ÎN OPERAȚIUNI'],
    [''],
    materialeHeader,
    ...materialeData,
    [],
    ['', '', '', '', 'TOTAL MATERIALE:', rezultat.totalMaterialeOperatiuni]
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(materialeSheet);
  XLSX.utils.book_append_sheet(wb, ws3, 'Materiale Operațiuni');

  // === SHEET 4: Manoperă ===
  const manoperaHeader = ['Nr.', 'Activitate', 'Tip', 'Ore/ha', 'Cost orar (lei)', 'Cost total (lei/ha)'];
  const manoperaData = cultura.manopera.map((man, idx) => [
    idx + 1,
    man.activitate,
    man.tip === 'permanent' ? 'Permanent' : man.tip === 'sezonier' ? 'Sezonier' : 'Servicii terți',
    man.orePerHa,
    man.costOrar,
    (man.orePerHa || 0) * (man.costOrar || 0)
  ]);

  const manoperaSheet = [
    ['MANOPERĂ'],
    [''],
    manoperaHeader,
    ...manoperaData,
    [],
    ['', '', '', '', 'TOTAL MANOPERĂ:', rezultat.costManopera]
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(manoperaSheet);
  XLSX.utils.book_append_sheet(wb, ws4, 'Manoperă');

  // === SHEET 5: Costuri Fixe ===
  const costuriFixeHeader = ['Nr.', 'Element', 'Cost/ha (lei)'];
  const costuriFixeData = cultura.costuriFixe.map((cost, idx) => [
    idx + 1,
    cost.element,
    cost.costPerHa
  ]);

  const costuriFixeSheet = [
    ['COSTURI FIXE'],
    [''],
    costuriFixeHeader,
    ...costuriFixeData,
    [],
    ['', 'TOTAL COSTURI FIXE:', rezultat.costuriFixe]
  ];
  const ws5 = XLSX.utils.aoa_to_sheet(costuriFixeSheet);
  XLSX.utils.book_append_sheet(wb, ws5, 'Costuri Fixe');

  // === SHEET 6: Rezumat Financiar ===
  const rezumatSheet = [
    ['REZUMAT FINANCIAR'],
    [''],
    ['COSTURI / HECTAR'],
    ['Materiale din operațiuni:', rezultat.totalMaterialeOperatiuni, 'lei/ha'],
    ['Mecanizare (motorină + retribuții):', rezultat.totalCostMotorina + rezultat.totalRetributii, 'lei/ha'],
    ['Manoperă suplimentară:', rezultat.costManopera, 'lei/ha'],
    ['Costuri fixe:', rezultat.costuriFixe, 'lei/ha'],
    ['TOTAL COST/HA:', rezultat.costTotal, 'lei/ha'],
    [''],
    ['VENITURI / HECTAR'],
    ['Vânzare producție:', rezultat.venitVanzare, 'lei/ha'],
    ['Subvenții:', rezultat.venitSubventii, 'lei/ha'],
    ['TOTAL VENIT/HA:', rezultat.venitBrut, 'lei/ha'],
    [''],
    ['INDICATORI'],
    ['Marjă brută/ha:', rezultat.marjaBruta, 'lei/ha'],
    ['Marjă procentuală:', (rezultat.marjaProcentuala).toFixed(2), '%'],
    ['Break-even:', rezultat.breakEvenKg, 'kg/ha'],
    [''],
    ['TOTAL FERMĂ (' + cultura.hectare + ' ha)'],
    ['Cost total fermă:', rezultat.costTotal * cultura.hectare, 'lei'],
    ['Venit total fermă:', rezultat.venitBrut * cultura.hectare, 'lei'],
    ['Profit/Pierdere fermă:', rezultat.marjaBruta * cultura.hectare, 'lei'],
  ];
  const ws6 = XLSX.utils.aoa_to_sheet(rezumatSheet);
  XLSX.utils.book_append_sheet(wb, ws6, 'Rezumat Financiar');

  // Generare fișier și download
  const fileName = `Fisa_Tehnologica_${cultura.nume}_${cultura.hectare}ha_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
