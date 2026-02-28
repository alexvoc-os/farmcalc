/**
 * Serviciu management utilaje, implementele și lucrări agricole
 * Migrare de la localStorage la Supabase pentru persistență între dispozitive
 */

import { Utilaj, Implement, LucrareAgricolaPredefinita } from '@/types';
import { TRACTOARE_PREDEFINITE, IMPLEMENTELE_PREDEFINITE } from './seed-data';
import { supabase } from './supabase';

// === INTERFEȚE DATABASE ===

interface UtilajDB {
  id: string;
  user_id: string;
  nume: string;
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
    nume: db.nume,
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
    nume: utilaj.nume,
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
 * TEMPORARY: Returnează doar predefinite până la crearea tabelului în Supabase
 * Obține toate utilajele (predefinite + custom user)
 */
export async function getUtilaje(): Promise<Utilaj[]> {
  // TEMPORARY: Dezactivat query-ul până la crearea tabelului 'utilaje' în Supabase
  return [...TRACTOARE_PREDEFINITE];

  // if (!supabase) {
  //   // Fallback la predefinite dacă Supabase nu e disponibil
  //   return [...TRACTOARE_PREDEFINITE];
  // }

  // try {
  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //     // Utilizator neautentificat - returnează doar predefinite
  //     return [...TRACTOARE_PREDEFINITE];
  //   }

  //   const { data, error } = await supabase
  //     .from('utilaje')
  //     .select('*')
  //     .order('created_at', { ascending: false });

  //   if (error) {
  //     console.error('Eroare la încărcarea utilajelor:', error);
  //     return [...TRACTOARE_PREDEFINITE];
  //   }

  //   const utilajeCustom = (data || []).map(utilajFromDB);

  //   // Returnează predefinite + custom (fără duplicate)
  //   const toateUtilajele = [...TRACTOARE_PREDEFINITE];
  //   utilajeCustom.forEach(u => {
  //     if (!toateUtilajele.find(existing => existing.id === u.id)) {
  //       toateUtilajele.push(u);
  //     }
  //   });

  //   return toateUtilajele;
  // } catch (error) {
  //   console.error('Eroare la citirea utilajelor:', error);
  //   return [...TRACTOARE_PREDEFINITE];
  // }
}

/**
 * Salvează un utilaj
 */
export async function saveUtilaj(utilaj: Utilaj): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Utilizatorul nu este autentificat');
      return false;
    }

    const dbData = utilajToDB(utilaj, user.id);

    const { error } = await supabase
      .from('utilaje')
      .upsert(dbData, { onConflict: 'id' });

    if (error) {
      console.error('Eroare la salvarea utilajului:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Eroare salvare utilaj:', error);
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
 * TEMPORARY: Returnează doar predefinite până la crearea tabelului în Supabase
 * Obține toate implementele (predefinite + custom user)
 */
export async function getImplementele(): Promise<Implement[]> {
  // TEMPORARY: Dezactivat query-ul până la crearea tabelului 'implementele' în Supabase
  return [...IMPLEMENTELE_PREDEFINITE];

  // if (!supabase) {
  //   return [...IMPLEMENTELE_PREDEFINITE];
  // }

  // try {
  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //     return [...IMPLEMENTELE_PREDEFINITE];
  //   }

  //   const { data, error } = await supabase
  //     .from('implementele')
  //     .select('*')
  //     .order('created_at', { ascending: false });

  //   if (error) {
  //     console.error('Eroare la încărcarea implementelor:', error);
  //     return [...IMPLEMENTELE_PREDEFINITE];
  //   }

  //   const implementeleCustom = (data || []).map(implementFromDB);

  //   const toateImplementele = [...IMPLEMENTELE_PREDEFINITE];
  //   implementeleCustom.forEach(i => {
  //     if (!toateImplementele.find(existing => existing.id === i.id)) {
  //       toateImplementele.push(i);
  //     }
  //   });

  //   return toateImplementele;
  // } catch (error) {
  //   console.error('Eroare la citirea implementelor:', error);
  //   return [...IMPLEMENTELE_PREDEFINITE];
  // }
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
 * TEMPORARY: Returnează array gol până la crearea tabelului în Supabase
 * Obține toate lucrările utilizatorului
 */
export async function getLucrari(): Promise<LucrareAgricolaPredefinita[]> {
  // TEMPORARY: Dezactivat până la crearea tabelului 'lucrari' în Supabase
  return [];

  // if (!supabase) {
  //   return [];
  // }

  // try {
  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //     return [];
  //   }

  //   const { data, error } = await supabase
  //     .from('lucrari')
  //     .select('*')
  //     .order('created_at', { ascending: false });

  //   if (error) {
  //     console.error('Eroare la încărcarea lucrărilor:', error);
  //     return [];
  //   }

  //   return (data || []).map(lucrareFromDB);
  // } catch (error) {
  //   console.error('Eroare la citirea lucrărilor:', error);
  //   return [];
  // }
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
      .from('lucrari')
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
      .from('lucrari')
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
