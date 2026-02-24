/**
 * Storage Manager - Gestionează versionarea și curățarea localStorage
 *
 * Acest modul rezolvă problemele cu date vechi incompatibile prin:
 * - Versionare automată a datelor stocate (din package.json)
 * - Curățare automată la schimbarea versiunii
 * - Error handling robust
 */

import packageJson from '../../package.json';

// Versiunea este citită automat din package.json
// Pentru a actualiza versiunea, modifică "version" în package.json
const APP_VERSION = packageJson.version;
const VERSION_KEY = 'farmcalc_app_version';

/**
 * Inițializează storage-ul și verifică versiunea
 * @returns true dacă storage-ul este valid, false dacă a fost curățat
 */
export function initializeStorage(): boolean {
  // Verifică dacă suntem în browser (nu pe server)
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    // Verifică dacă localStorage este disponibil
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);

    const currentVersion = localStorage.getItem(VERSION_KEY);

    if (currentVersion !== APP_VERSION) {
      console.log(
        `🔄 Version mismatch detected (stored: ${currentVersion || 'none'}, current: ${APP_VERSION})`
      );
      console.log('📦 Clearing localStorage to prevent compatibility issues...');
      clearStorageAndReload();
      return false;
    }

    console.log(`✅ Storage version ${APP_VERSION} validated successfully`);
    return true;
  } catch (error) {
    console.error('❌ Storage initialization error:', error);
    clearStorageAndReload();
    return false;
  }
}

/**
 * Curăță complet localStorage/sessionStorage și reîncarcă aplicația
 */
export function clearStorageAndReload(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    console.log('🧹 Clearing all storage...');
    
    // Salvează datele critice dacă este necesar (ex: preferințe importante)
    const criticalData = migrateCriticalData();

    // Curăță complet storage-ul
    localStorage.clear();
    sessionStorage.clear();

    // Restaurează datele critice migrated
    if (criticalData) {
      Object.entries(criticalData).forEach(([key, value]) => {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.warn(`Failed to restore ${key}:`, e);
        }
      });
    }

    // Setează noua versiune
    localStorage.setItem(VERSION_KEY, APP_VERSION);

    console.log('✅ Storage cleared successfully');
    console.log('🔄 Reloading application...');

    // Reîncarcă pagina după un mic delay pentru a permite log-urile să fie afișate
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
    // Forțează reload chiar dacă curățarea a eșuat
    window.location.reload();
  }
}

/**
 * Încearcă să migreze date critice între versiuni
 * @returns Un obiect cu datele critice salvate sau null
 */
function migrateCriticalData(): Record<string, string> | null {
  try {
    const criticalKeys: string[] = [
      // Adaugă aici chei pentru date care trebuie păstrate între versiuni
      // Ex: 'user_preferences', 'theme_preference', etc.
    ];

    const criticalData: Record<string, string> = {};
    let hasData = false;

    criticalKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          criticalData[key] = value;
          hasData = true;
        }
      } catch (e) {
        console.warn(`Failed to migrate ${key}:`, e);
      }
    });

    return hasData ? criticalData : null;
  } catch (error) {
    console.error('❌ Failed to migrate critical data:', error);
    return null;
  }
}

/**
 * Verifică dacă localStorage este accesibil și funcțional
 * @returns true dacă localStorage funcționează corect
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__storage_availability_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('❌ localStorage is not available:', error);
    return false;
  }
}

/**
 * Obține valoarea din localStorage cu error handling
 * @param key Cheia pentru valoare
 * @param defaultValue Valoarea default dacă nu există sau apare eroare
 * @returns Valoarea sau defaultValue
 */
export function safeGetItem(key: string, defaultValue: string | null = null): string | null {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    return localStorage.getItem(key) ?? defaultValue;
  } catch (error) {
    console.error(`❌ Failed to get item '${key}':`, error);
    return defaultValue;
  }
}

/**
 * Setează o valoare în localStorage cu error handling
 * @param key Cheia pentru valoare
 * @param value Valoarea de setat
 * @returns true dacă a reușit, false dacă a eșuat
 */
export function safeSetItem(key: string, value: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`❌ Failed to set item '${key}':`, error);
    
    // Dacă storage-ul este plin, încearcă să curățe datele vechi
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('⚠️ Storage quota exceeded, clearing old data...');
      clearStorageAndReload();
    }
    
    return false;
  }
}

/**
 * Șterge o cheie din localStorage cu error handling
 * @param key Cheia de șters
 * @returns true dacă a reușit, false dacă a eșuat
 */
export function safeRemoveItem(key: string): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`❌ Failed to remove item '${key}':`, error);
    return false;
  }
}

/**
 * Obține versiunea curentă a aplicației
 * @returns Versiunea curentă
 */
export function getCurrentVersion(): string {
  return APP_VERSION;
}

/**
 * Verifică dacă este necesară o actualizare de storage
 * @returns true dacă versiunea diferă
 */
export function needsStorageUpdate(): boolean {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    return storedVersion !== APP_VERSION;
  } catch (error) {
    console.error('❌ Failed to check storage version:', error);
    return true;
  }
}
