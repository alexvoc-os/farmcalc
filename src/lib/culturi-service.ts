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
  };
}

// Convertește din format aplicație în format DB
function toDB(cultura: Cultura, userId: string): Omit<CulturaDB, 'created_at' | 'updated_at'> {
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
  };
}

// Obține toate culturile utilizatorului curent
export async function getCulturi(): Promise<Cultura[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('culturi')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Eroare la încărcarea culturilor:', error);
    return [];
  }

  return (data || []).map(fromDB);
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
export async function saveCultura(cultura: Cultura): Promise<Cultura | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Utilizatorul nu este autentificat');
    return null;
  }

  const dbData = toDB(cultura, user.id);

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
