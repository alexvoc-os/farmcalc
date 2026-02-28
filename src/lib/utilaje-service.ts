/**
 * Serviciu management utilaje, implementele și lucrări agricole
 * Migrare de la localStorage la Supabase pentru persistență între dispozitive
 */

import { Utilaj, Implement, LucrareAgricolaPredefinita } from '@/types';
import { supabase } from './supabase';

// === INTERFEȚE DATABASE ===

interface UtilajDB {
  id: string;
  user_id: string;
  // Câmpul 'nume' a fost eliminat - folosim doar marca + model
  marca: string;
  model: string;
  putere_cp: number;
  an_fabricatie: number;
  consum_mediu_l_ora: number | null;
  valoare: number | null;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

interface ImplementDB {
  id: string;
  user_id: string;
  nume: string;
  tip: string;
  latime_lucru: number | null;
  numar_randuri: number | null;
  greutate: number | null;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

interface LucrareDB {
  id: string;
  user_id: string;
  nume: string;
  utilaj_id: string;
  implement_id: string;
  consum_motorina: number;
  descriere: string | null;
  created_at: string;
  updated_at: string;
}

// === CONVERTOARE ===

function utilajFromDB(db: UtilajDB): Utilaj {
  return {
    id: db.id,
    // Câmpul nume nu mai este folosit - se afișează marca + model
    marca: db.marca,
    model: db.model,
    putereCP: db.putere_cp,
    anFabricatie: db.an_fabricatie,
    consumMediuLOra: db.consum_mediu_l_ora ?? undefined,
    valoare: db.valoare ?? undefined,
    isGlobal: db.is_global,
  };
}

function utilajToDB(utilaj: Utilaj, userId: string): Omit<UtilajDB, 'created_at' | 'updated_at'> {
  return {
    id: utilaj.id,
    user_id: userId,
    marca: utilaj.marca,
    model: utilaj.model,
    putere_cp: utilaj.putereCP,
    an_fabricatie: utilaj.anFabricatie,
    consum_mediu_l_ora: utilaj.consumMediuLOra ?? null,
    valoare: utilaj.valoare ?? null,
    is_global: utilaj.isGlobal,
  };
}

function implementFromDB(db: ImplementDB): Implement {
  return {
    id: db.id,
    nume: db.nume,
    tip: db.tip as any,
    latimeLucru: db.latime_lucru ?? undefined,
    numarRanduri: db.numar_randuri ?? undefined,
    greutate: db.greutate ?? undefined,
    isGlobal: db.is_global,
  };
}

function implementToDB(implement: Implement, userId: string): Omit<ImplementDB, 'created_at' | 'updated_at'> {
  return {
    id: implement.id,
    user_id: userId,
    nume: implement.nume,
    tip: implement.tip,
    latime_lucru: implement.latimeLucru ?? null,
    numar_randuri: implement.numarRanduri ?? null,
    greutate: implement.greutate ?? null,
    is_global: implement.isGlobal,
  };
}

function lucrareFromDB(db: LucrareDB): LucrareAgricolaPredefinita {
  return {
    id: db.id,
    nume: db.nume,
    utilajId: db.utilaj_id,
    implementId: db.implement_id,
    consumMotorina: db.consum_motorina,
    descriere: db.descriere ?? undefined,
  };
}

function lucrareToDB(lucrare: LucrareAgricolaPredefinita, userId: string): Omit<LucrareDB, 'created_at' | 'updated_at'> {
  return {
    id: lucrare.id,
    user_id: userId,
    nume: lucrare.nume,
    utilaj_id: lucrare.utilajId,
    implement_id: lucrare.implementId,
    consum_motorina: lucrare.consumMotorina,
    descriere: lucrare.descriere ?? null,
  };
}

// === UTILAJE (TRACTOARE) ===

/**
 * Obține toate utilajele utilizatorului din baza de date
 * Fără predefinite - fiecare utilizator își introduce propriile utilaje
 */
export async function getUtilaje(): Promise<Utilaj[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('utilaje')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Eroare la încărcarea utilajelor:', error);
      return [];
    }

    return (data || []).map(utilajFromDB);
  } catch (error) {
    console.error('Eroare la citirea utilajelor:', error);
    return [];
  }
}

/**
 * Salvează un utilaj
 */
export async function saveUtilaj(utilaj: Utilaj): Promise<boolean> {
  console.log('🟢 saveUtilaj called with:', utilaj);

  if (!supabase) {
    console.error('❌ Supabase client not initialized');
    return false;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('🟢 User:', user?.id);

    if (!user) {
      console.error('❌ Utilizatorul nu este autentificat');
      return false;
    }

    const dbData = utilajToDB(utilaj, user.id);
    console.log('🟢 DB Data:', dbData);

    const { data, error } = await supabase
      .from('utilaje')
      .upsert(dbData, { onConflict: 'id' })
      .select();

    console.log('🟢 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Eroare la salvarea utilajului:', error);
      return false;
    }

    console.log('✅ Utilaj salvat cu succes!');
    return true;
  } catch (error) {
    console.error('❌ Eroare salvare utilaj:', error);
    return false;
  }
}

/**
 * Șterge un utilaj
 */
export async function deleteUtilaj(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('utilaje')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Eroare la ștergerea utilajului:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Eroare ștergere utilaj:', error);
    return false;
  }
}

// === IMPLEMENTELE ===

/**
 * Obține toate implementele utilizatorului din baza de date
 * Fără predefinite - fiecare utilizator își introduce propriile implementele
 */
export async function getImplementele(): Promise<Implement[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('implementele')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Eroare la încărcarea implementelor:', error);
      return [];
    }

    return (data || []).map(implementFromDB);
  } catch (error) {
    console.error('Eroare la citirea implementelor:', error);
    return [];
  }
}

/**
 * Salvează un implement
 */
export async function saveImplement(implement: Implement): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Utilizatorul nu este autentificat');
      return false;
    }

    const dbData = implementToDB(implement, user.id);

    const { error } = await supabase
      .from('implementele')
      .upsert(dbData, { onConflict: 'id' });

    if (error) {
      console.error('Eroare la salvarea implementului:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Eroare salvare implement:', error);
    return false;
  }
}

/**
 * Șterge un implement
 */
export async function deleteImplement(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('implementele')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Eroare la ștergerea implementului:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Eroare ștergere implement:', error);
    return false;
  }
}

// === LUCRĂRI AGRICOLE ===

/**
 * Obține toate lucrările utilizatorului
 */
export async function getLucrari(): Promise<LucrareAgricolaPredefinita[]> {
  if (!supabase) {
    return [];
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('lucrari_custom')
      .select('*')
      .order('ordine', { ascending: true });

    if (error) {
      console.error('Eroare la încărcarea lucrărilor:', error);
      return [];
    }

    return (data || []).map(lucrareFromDB);
  } catch (error) {
    console.error('Eroare la citirea lucrărilor:', error);
    return [];
  }
}

/**
 * Salvează o lucrare
 */
export async function saveLucrare(lucrare: LucrareAgricolaPredefinita): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Utilizatorul nu este autentificat');
      return false;
    }

    const dbData = lucrareToDB(lucrare, user.id);

    const { error } = await supabase
      .from('lucrari_custom')
      .upsert(dbData, { onConflict: 'id' });

    if (error) {
      console.error('Eroare la salvarea lucrării:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Eroare salvare lucrare:', error);
    return false;
  }
}

/**
 * Șterge o lucrare
 */
export async function deleteLucrare(id: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('lucrari_custom')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Eroare la ștergerea lucrării:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Eroare ștergere lucrare:', error);
    return false;
  }
}

// === HELPERS ===

/**
 * Găsește un utilaj după ID
 */
export async function getUtilajById(id: string): Promise<Utilaj | null> {
  const utilaje = await getUtilaje();
  return utilaje.find(u => u.id === id) || null;
}

/**
 * Găsește un implement după ID
 */
export async function getImplementById(id: string): Promise<Implement | null> {
  const implementele = await getImplementele();
  return implementele.find(i => i.id === id) || null;
}

/**
 * Găsește o lucrare după ID
 */
export async function getLucrareById(id: string): Promise<LucrareAgricolaPredefinita | null> {
  const lucrari = await getLucrari();
  return lucrari.find(l => l.id === id) || null;
}
