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
 * Obține toate utilajele (predefinite + custom)
 */
export function getUtilaje(): Utilaj[] {
  try {
    // Verifică dacă suntem pe client (browser)
    if (typeof window === 'undefined') {
      return [...TRACTOARE_PREDEFINITE];
    }

    const customStr = localStorage.getItem(STORAGE_KEY_UTILAJE);
    const custom: Utilaj[] = customStr ? JSON.parse(customStr) : [];

    // Combină: predefinite + custom
    return [...TRACTOARE_PREDEFINITE, ...custom];
  } catch (error) {
    console.error('Eroare la citirea utilajelor:', error);
    return [...TRACTOARE_PREDEFINITE];
  }
}

/**
 * Salvează un utilaj (doar custom, predefinitele sunt protected)
 */
export function saveUtilaj(utilaj: Utilaj): boolean {
  try {
    if (typeof window === 'undefined') return false;

    if (utilaj.isGlobal) {
      console.warn('Nu poți modifica utilaje predefinite');
      return false;
    }

    const custom = getUtilaje().filter(u => !u.isGlobal);
    const exists = custom.find(u => u.id === utilaj.id);

    const updated = exists
      ? custom.map(u => u.id === utilaj.id ? utilaj : u)
      : [...custom, { ...utilaj, isGlobal: false }];

    localStorage.setItem(STORAGE_KEY_UTILAJE, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Eroare salvare utilaj:', error);
    return false;
  }
}

/**
 * Șterge un utilaj custom (predefinitele sunt protected)
 */
export function deleteUtilaj(id: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const utilaj = getUtilajById(id);
    if (utilaj?.isGlobal) {
      console.warn('Nu poți șterge utilaje predefinite');
      return false;
    }

    const custom = getUtilaje().filter(u => !u.isGlobal && u.id !== id);
    localStorage.setItem(STORAGE_KEY_UTILAJE, JSON.stringify(custom));
    return true;
  } catch (error) {
    console.error('Eroare ștergere utilaj:', error);
    return false;
  }
}

// === IMPLEMENTELE ===

/**
 * Obține toate implementele (predefinite + custom)
 */
export function getImplementele(): Implement[] {
  try {
    // Verifică dacă suntem pe client (browser)
    if (typeof window === 'undefined') {
      return [...IMPLEMENTELE_PREDEFINITE];
    }

    const customStr = localStorage.getItem(STORAGE_KEY_IMPLEMENTELE);
    const custom: Implement[] = customStr ? JSON.parse(customStr) : [];

    return [...IMPLEMENTELE_PREDEFINITE, ...custom];
  } catch (error) {
    console.error('Eroare la citirea implementelor:', error);
    return [...IMPLEMENTELE_PREDEFINITE];
  }
}

/**
 * Salvează un implement (doar custom)
 */
export function saveImplement(implement: Implement): boolean {
  try {
    if (typeof window === 'undefined') return false;

    if (implement.isGlobal) {
      console.warn('Nu poți modifica implementele predefinite');
      return false;
    }

    const custom = getImplementele().filter(i => !i.isGlobal);
    const exists = custom.find(i => i.id === implement.id);

    const updated = exists
      ? custom.map(i => i.id === implement.id ? implement : i)
      : [...custom, { ...implement, isGlobal: false }];

    localStorage.setItem(STORAGE_KEY_IMPLEMENTELE, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Eroare salvare implement:', error);
    return false;
  }
}

/**
 * Șterge un implement custom
 */
export function deleteImplement(id: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const implement = getImplementById(id);
    if (implement?.isGlobal) {
      console.warn('Nu poți șterge implementele predefinite');
      return false;
    }

    const custom = getImplementele().filter(i => !i.isGlobal && i.id !== id);
    localStorage.setItem(STORAGE_KEY_IMPLEMENTELE, JSON.stringify(custom));
    return true;
  } catch (error) {
    console.error('Eroare ștergere implement:', error);
    return false;
  }
}

// === LUCRĂRI AGRICOLE ===

/**
 * Obține toate lucrările (predefinite + custom), sortate după ordine
 */
export function getLucrari(): LucrareAgricolaPredefinita[] {
  try {
    // Verifică dacă suntem pe client (browser)
    if (typeof window === 'undefined') {
      return [...LUCRARI_PREDEFINITE].sort((a, b) => a.ordine - b.ordine);
    }

    const customStr = localStorage.getItem(STORAGE_KEY_LUCRARI);
    const custom: LucrareAgricolaPredefinita[] = customStr ? JSON.parse(customStr) : [];

    // Combină și sortează după ordine
    const all = [...LUCRARI_PREDEFINITE, ...custom];
    return all.sort((a, b) => a.ordine - b.ordine);
  } catch (error) {
    console.error('Eroare la citirea lucrărilor:', error);
    return [...LUCRARI_PREDEFINITE];
  }
}

/**
 * Salvează o lucrare (doar custom)
 */
export function saveLucrare(lucrare: LucrareAgricolaPredefinita): boolean {
  try {
    if (typeof window === 'undefined') return false;

    if (lucrare.isGlobal) {
      console.warn('Nu poți modifica lucrări predefinite');
      return false;
    }

    const custom = getLucrari().filter(l => !l.isGlobal);
    const exists = custom.find(l => l.id === lucrare.id);

    const updated = exists
      ? custom.map(l => l.id === lucrare.id ? lucrare : l)
      : [...custom, { ...lucrare, isGlobal: false }];

    localStorage.setItem(STORAGE_KEY_LUCRARI, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Eroare salvare lucrare:', error);
    return false;
  }
}

/**
 * Șterge o lucrare custom
 */
export function deleteLucrare(id: string): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const lucrare = getLucrareById(id);
    if (lucrare?.isGlobal) {
      console.warn('Nu poți șterge lucrări predefinite');
      return false;
    }

    const custom = getLucrari().filter(l => !l.isGlobal && l.id !== id);
    localStorage.setItem(STORAGE_KEY_LUCRARI, JSON.stringify(custom));
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
