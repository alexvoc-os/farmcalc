import { supabase } from './supabase';
import { Cultura } from '@/types';

// Interfață pentru cultura din baza de date (snake_case)
interface CulturaDB {
  id: string;
  user_id: string;
  nume: string;
  hectare: number;
  inputuri: any[];
  mecanizare: any[];
  manopera: any[];
  costuri_fixe: any[];
  productie: number;
  pret_vanzare: number;
  subventie_per_ha: number;
  an_agricol: string;
  created_at: string;
  updated_at: string;
}

// Convertește din format DB în format aplicație
// Include migrare automată pentru date vechi
function fromDB(db: CulturaDB): Cultura {
  // Migrează mecanizare din format vechi la format nou
  const mecanizareMigrata = (db.mecanizare || []).map((mec: any) => ({
    id: mec.id,
    operatiune: mec.operatiune || '',
    consumMotorina: mec.consumMotorina || 0,
    pretMotorina: mec.pretMotorina || 8.0,
    // Câmpuri noi - folosește valori existente sau default
    retributii: mec.retributii ?? 0,
    materiale: mec.materiale ?? [],
  }));

  return {
    id: db.id,
    nume: db.nume,
    hectare: db.hectare,
    inputuri: db.inputuri || [],
    mecanizare: mecanizareMigrata,
    manopera: db.manopera || [],
    costuriFixe: db.costuri_fixe || [],
    productie: db.productie,
    pretVanzare: db.pret_vanzare,
    subventiePerHa: db.subventie_per_ha || 0,
    anAgricol: db.an_agricol,
  };
}

// Convertește din format aplicație în format DB
function toDB(cultura: Cultura, userId: string, anAgricol: string): Omit<CulturaDB, 'created_at' | 'updated_at'> {
  return {
    id: cultura.id,
    user_id: userId,
    nume: cultura.nume,
    hectare: cultura.hectare,
    inputuri: cultura.inputuri,
    mecanizare: cultura.mecanizare,
    manopera: cultura.manopera,
    costuri_fixe: cultura.costuriFixe,
    productie: cultura.productie,
    pret_vanzare: cultura.pretVanzare,
    subventie_per_ha: cultura.subventiePerHa,
    an_agricol: cultura.anAgricol || anAgricol, // Folosește an din cultură sau parametrul
  };
}

// Obține toate culturile utilizatorului curent pentru un an agricol specific
export async function getCulturi(anAgricol: string): Promise<Cultura[]> {
  if (!supabase) return [];

  // TEMPORARY: Returnează TOATE culturile utilizatorului (fără filtrare după an_agricol)
  // Filtrarea se va face în cod după ce coloana an_agricol va fi adăugată
  const { data, error } = await supabase
    .from('culturi')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Eroare la încărcarea culturilor:', error);
    return [];
  }

  // Filtrare și setare an_agricol în JavaScript
  return (data || []).map(row => {
    const cultura = fromDB(row);
    // Dacă cultura nu are an_agricol, setează-l la anul curent
    if (!cultura.anAgricol) {
      cultura.anAgricol = anAgricol;
    }
    return cultura;
  }).filter(c => c.anAgricol === anAgricol); // Filtrare după an în JavaScript
}

// Obține o cultură după ID
export async function getCultura(id: string): Promise<Cultura | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('culturi')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Eroare la încărcarea culturii:', error);
    return null;
  }

  return data ? fromDB(data) : null;
}

// Salvează o cultură (insert sau update)
export async function saveCultura(cultura: Cultura, anAgricol: string): Promise<Cultura | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Utilizatorul nu este autentificat');
    return null;
  }

  const dbData = toDB(cultura, user.id, anAgricol);

  const { data, error } = await supabase
    .from('culturi')
    .upsert(dbData, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Eroare la salvarea culturii:', error);
    return null;
  }

  return data ? fromDB(data) : null;
}

// Șterge o cultură
export async function deleteCultura(id: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('culturi')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Eroare la ștergerea culturii:', error);
    return false;
  }

  return true;
}

// Verifică dacă utilizatorul este autentificat
export async function isAuthenticated(): Promise<boolean> {
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

// Migrare automată: Setează an_agricol pentru toate culturile care nu au acest câmp
export async function migreazaCulturiLaAnAgricol(): Promise<{ success: boolean; count: number }> {
  if (!supabase) return { success: false, count: 0 };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('Utilizator neautentificat - skip migrare');
      return { success: false, count: 0 };
    }

    // Verifică dacă mai sunt culturi fără an_agricol
    const { data: culturiFaraN, error: checkError } = await supabase
      .from('culturi')
      .select('id')
      .is('an_agricol', null);

    if (checkError) {
      console.error('Eroare verificare culturi:', checkError);
      return { success: false, count: 0 };
    }

    const numarCulturiFaraAn = culturiFaraN?.length || 0;

    if (numarCulturiFaraAn === 0) {
      console.log('Toate culturile au deja an_agricol setat');
      return { success: true, count: 0 };
    }

    console.log(`Setare an_agricol pentru ${numarCulturiFaraAn} culturi...`);

    // Update toate culturile fără an_agricol la 2024-2025
    const { error: updateError } = await supabase
      .from('culturi')
      .update({ an_agricol: '2024-2025' })
      .is('an_agricol', null);

    if (updateError) {
      console.error('Eroare la update culturi:', updateError);
      return { success: false, count: 0 };
    }

    console.log(`✅ ${numarCulturiFaraAn} culturi actualizate la 2024-2025`);
    return { success: true, count: numarCulturiFaraAn };
  } catch (error) {
    console.error('Eroare în migrare:', error);
    return { success: false, count: 0 };
  }
}

// Obține anii agricoli disponibili pentru utilizatorul curent
export async function getAniAgricoliDisponibili(): Promise<string[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('culturi')
    .select('an_agricol')
    .order('an_agricol', { ascending: false });

  if (error) {
    console.error('Eroare la încărcarea anilor agricoli:', error);
    return [];
  }

  // Extrage anii unici
  const ani = [...new Set((data || []).map(row => row.an_agricol))];
  return ani;
}

// Copiază toate culturile din anul anterior într-un an nou
// Păstrează structura (lucrări, inputuri, prețuri) dar permite modificarea suprafețelor
export async function copiazaCulturiInAnNou(
  anSursa: string,
  anDestinatie: string,
  modificariSuprafete?: Record<string, number> // id cultură → hectare noi
): Promise<boolean> {
  if (!supabase) return false;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Utilizatorul nu este autentificat');
    return false;
  }

  // Obține culturile din anul sursă
  const culturi = await getCulturi(anSursa);

  if (culturi.length === 0) {
    console.warn('Nu există culturi în anul sursă');
    return false;
  }

  // Copiază fiecare cultură în anul nou
  const promises = culturi.map(async (cultura) => {
    // Generează ID nou pentru cultura copiată
    const idNou = crypto.randomUUID();

    // Aplică modificările de suprafață dacă există
    const hectareNoi = modificariSuprafete?.[cultura.id] ?? cultura.hectare;

    const culturaNou: Cultura = {
      ...cultura,
      id: idNou,
      hectare: hectareNoi,
      anAgricol: anDestinatie,
    };

    return saveCultura(culturaNou, anDestinatie);
  });

  try {
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Eroare la copierea culturilor:', error);
    return false;
  }
}

// Obține lista de ani agricoli cu statistici
export async function getAniAgricoliCuStatistici(): Promise<Array<{
  an: string;
  numarCulturi: number;
  totalHectare: number;
}>> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('culturi')
    .select('an_agricol, hectare')
    .order('an_agricol', { ascending: false });

  if (error) {
    console.error('Eroare la încărcarea statisticilor:', error);
    return [];
  }

  // Grupează după an agricol
  const grouped = (data || []).reduce((acc, row) => {
    if (!acc[row.an_agricol]) {
      acc[row.an_agricol] = { numarCulturi: 0, totalHectare: 0 };
    }
    acc[row.an_agricol].numarCulturi++;
    acc[row.an_agricol].totalHectare += row.hectare;
    return acc;
  }, {} as Record<string, { numarCulturi: number; totalHectare: number }>);

  return Object.entries(grouped).map(([an, stats]) => ({
    an,
    ...stats,
  }));
}
