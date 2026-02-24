/**
 * Serviciu management utilaje, implementele și lucrări agricole
 * Pattern similar cu culturi-service.ts
 * Stocare: localStorage (momentan), migrare Supabase mai târziu
 */

import { Utilaj, Implement, LucrareAgricolaPredefinita } from '@/types';
import { TRACTOARE_PREDEFINITE, IMPLEMENTELE_PREDEFINITE, LUCRARI_PREDEFINITE } from './seed-data';

// localStorage keys
const STORAGE_KEY_UTILAJE = 'farmcalc_utilaje_custom';
const STORAGE_KEY_IMPLEMENTELE = 'farmcalc_implementele_custom';
const STORAGE_KEY_LUCRARI = 'farmcalc_lucrari_custom';

// === UTILAJE (TRACTOARE) ===

/**
 * Obține toate utilajele (la prima rulare inițializează cu predefinite)
 */
export function getUtilaje(): Utilaj[] {
  try {
    // Verifică dacă suntem pe client (browser)
    if (typeof window === 'undefined') {
      return [...TRACTOARE_PREDEFINITE];
    }

    const storedStr = localStorage.getItem(STORAGE_KEY_UTILAJE);

    // Dacă nu există date, inițializează cu predefinite
    if (!storedStr) {
      localStorage.setItem(STORAGE_KEY_UTILAJE, JSON.stringify(TRACTOARE_PREDEFINITE));
      return [...TRACTOARE_PREDEFINITE];
    }

    const utilaje: Utilaj[] = JSON.parse(storedStr);
    return utilaje;
  } catch (error) {
    console.error('Eroare la citirea utilajelor:', error);
    return [...TRACTOARE_PREDEFINITE];
  }
}

/**
 * Salvează un utilaj (toate sunt editabile)
 */
export function saveUtilaj(utilaj: Utilaj): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const toate = getUtilaje();
    const exists = toate.find(u => u.id === utilaj.id);

    const updated = exists
      ? toate.map(u => u.id === utilaj.id ? utilaj : u)
      : [...toate, utilaj];

    localStorage.setItem(STORAGE_KEY_UTILAJE, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Eroare salvare utilaj:', error);
    return false;
  }
}

/**
 * Șterge un utilaj (toate sunt ștergabile)
 */
export function deleteUtilaj(id: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const toate = getUtilaje().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEY_UTILAJE, JSON.stringify(toate));
    return true;
  } catch (error) {
    console.error('Eroare ștergere utilaj:', error);
    return false;
  }
}

// === IMPLEMENTELE ===

/**
 * Obține toate implementele (la prima rulare inițializează cu predefinite)
 */
export function getImplementele(): Implement[] {
  try {
    // Verifică dacă suntem pe client (browser)
    if (typeof window === 'undefined') {
      return [...IMPLEMENTELE_PREDEFINITE];
    }

    const storedStr = localStorage.getItem(STORAGE_KEY_IMPLEMENTELE);

    // Dacă nu există date, inițializează cu predefinite
    if (!storedStr) {
      localStorage.setItem(STORAGE_KEY_IMPLEMENTELE, JSON.stringify(IMPLEMENTELE_PREDEFINITE));
      return [...IMPLEMENTELE_PREDEFINITE];
    }

    const implementele: Implement[] = JSON.parse(storedStr);
    return implementele;
  } catch (error) {
    console.error('Eroare la citirea implementelor:', error);
    return [...IMPLEMENTELE_PREDEFINITE];
  }
}

/**
 * Salvează un implement (toate sunt editabile)
 */
export function saveImplement(implement: Implement): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const toate = getImplementele();
    const exists = toate.find(i => i.id === implement.id);

    const updated = exists
      ? toate.map(i => i.id === implement.id ? implement : i)
      : [...toate, implement];

    localStorage.setItem(STORAGE_KEY_IMPLEMENTELE, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Eroare salvare implement:', error);
    return false;
  }
}

/**
 * Șterge un implement (toate sunt ștergabile)
 */
export function deleteImplement(id: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const toate = getImplementele().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEY_IMPLEMENTELE, JSON.stringify(toate));
    return true;
  } catch (error) {
    console.error('Eroare ștergere implement:', error);
    return false;
  }
}

// === LUCRĂRI AGRICOLE ===

/**
 * Obține toate lucrările (toate sunt custom, compuse din utilaj + implement)
 */
export function getLucrari(): LucrareAgricolaPredefinita[] {
  try {
    // Verifică dacă suntem pe client (browser)
    if (typeof window === 'undefined') {
      return [];
    }

    const storedStr = localStorage.getItem(STORAGE_KEY_LUCRARI);

    // Dacă nu există date, returnează array gol (nu mai avem predefinite)
    if (!storedStr) {
      return [];
    }

    const lucrari: LucrareAgricolaPredefinita[] = JSON.parse(storedStr);
    return lucrari;
  } catch (error) {
    console.error('Eroare la citirea lucrărilor:', error);
    return [];
  }
}

/**
 * Salvează o lucrare (toate sunt editabile)
 */
export function saveLucrare(lucrare: LucrareAgricolaPredefinita): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const toate = getLucrari();
    const exists = toate.find(l => l.id === lucrare.id);

    const updated = exists
      ? toate.map(l => l.id === lucrare.id ? lucrare : l)
      : [...toate, lucrare];

    localStorage.setItem(STORAGE_KEY_LUCRARI, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Eroare salvare lucrare:', error);
    return false;
  }
}

/**
 * Șterge o lucrare (toate sunt ștergabile)
 */
export function deleteLucrare(id: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const toate = getLucrari().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEY_LUCRARI, JSON.stringify(toate));
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
export function getUtilajById(id: string): Utilaj | null {
  return getUtilaje().find(u => u.id === id) || null;
}

/**
 * Găsește un implement după ID
 */
export function getImplementById(id: string): Implement | null {
  return getImplementele().find(i => i.id === id) || null;
}

/**
 * Găsește o lucrare după ID
 */
export function getLucrareById(id: string): LucrareAgricolaPredefinita | null {
  return getLucrari().find(l => l.id === id) || null;
}

/**
 * Curăță toate datele custom (pentru reset/debug)
 */
export function clearAllCustomData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEY_UTILAJE);
  localStorage.removeItem(STORAGE_KEY_IMPLEMENTELE);
  localStorage.removeItem(STORAGE_KEY_LUCRARI);
  console.log('Toate datele custom au fost șterse');
}
