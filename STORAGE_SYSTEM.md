# 🗄️ Sistem de Gestionare Storage - FarmCalc

## 📋 Prezentare Generală

Acest sistem rezolvă problemele cu date vechi incompatibile din localStorage și cookies care apar după actualizări ale aplicației. Sistemul include:

- ✅ **Versionare automată** a datelor stocate local
- ✅ **Curățare automată** la schimbarea versiunii
- ✅ **Error Boundary** pentru probleme de storage
- ✅ **Buton manual** pentru utilizatori să rezolve singuri problema
- ✅ **Safe API** pentru accesarea localStorage

## 🏗️ Componente Implementate

### 1. Storage Manager (`src/lib/storage-manager.ts`)

Utility central pentru gestionarea localStorage cu versionare.

**Funcții principale:**
- `initializeStorage()` - Verifică și inițializează storage-ul
- `clearStorageAndReload()` - Curăță complet storage-ul și reîncarcă aplicația
- `safeGetItem()` - Obține valori din localStorage cu error handling
- `safeSetItem()` - Setează valori în localStorage cu error handling
- `isStorageAvailable()` - Verifică dacă localStorage este disponibil

**Versiune curentă:** `1.2.0` (citită automat din [`package.json`](package.json:3))

### 2. Storage Initializer (`src/components/StorageInitializer.tsx`)

Component client care inițializează storage-ul la pornirea aplicației.

- Rulează automat la primul render
- Verifică versiunea și curăță datele vechi
- Nu renderează nimic în UI

### 3. Storage Error Boundary (`src/components/StorageErrorBoundary.tsx`)

Error Boundary specializat pentru probleme de storage.

- Prinde erori legate de localStorage/cookies
- Oferă UI clar pentru utilizatori
- Curăță automat storage-ul și reîncarcă aplicația

### 4. Clear Cache Button (în `src/components/Header.tsx`)

Buton vizibil în header pentru utilizatori să rezolve singuri problema.

- Iconiță RotateCcw (🔄)
- Tooltip informativ
- Funcționează instant

## 🔧 Utilizare pentru Dezvoltatori

### Actualizare Versiune (AUTOMAT)

**Versiunea aplicației se actualizează automat din [`package.json`](package.json:3)!**

Când faci modificări majore care pot afecta structura datelor din localStorage:

1. Deschide fișierul [`package.json`](package.json:3)
2. Modifică câmpul `"version"`:

```json
{
  "name": "farmcalc",
  "version": "1.3.0",  // ← Incrementează versiunea aici
  "private": true,
  ...
}
```

3. Salvează fișierul
4. La următorul build/deploy, toate browser-ele vor curăța automat datele vechi

**Nu mai este nevoie să modifici manual `storage-manager.ts`** - versiunea este citită automat din package.json!

### Reguli de Versionare

Folosește **Semantic Versioning**:

- **MAJOR** (1.0.0 → 2.0.0): Schimbări breaking în structura datelor
- **MINOR** (1.0.0 → 1.1.0): Adăugare funcționalități noi care pot afecta storage-ul
- **PATCH** (1.0.0 → 1.0.1): Bug fixes minore (de obicei nu necesită curățare)

### Utilizare Safe API

În loc să folosești direct `localStorage`:

```typescript
// ❌ NU folosi direct
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');

// ✅ Folosește Safe API
import { safeSetItem, safeGetItem } from '@/lib/storage-manager';

safeSetItem('key', 'value');
const value = safeGetItem('key', 'defaultValue');
```

### Păstrarea Datelor Importante între Versiuni

Dacă ai date care trebuie păstrate între versiuni (ex: preferințe utilizator):

1. Deschide [`src/lib/storage-manager.ts`](src/lib/storage-manager.ts:98)
2. Modifică funcția `migrateCriticalData()`:

```typescript
function migrateCriticalData(): Record<string, string> | null {
  try {
    const criticalKeys: string[] = [
      'user_preferences',      // Adaugă chei importante aici
      'theme_preference',
      'language_preference',
      // etc.
    ];
    // ... rest of code
  }
}
```

## 📊 Flow Diagrama

```
Aplicație pornește
    ↓
StorageInitializer rulează
    ↓
Verifică versiunea din localStorage
    ↓
    ├─→ Versiune corectă → Continuă normal ✅
    │
    └─→ Versiune diferită sau lipsă
        ↓
        Încearcă migrarea datelor critice
        ↓
        Curăță localStorage/sessionStorage
        ↓
        Setează noua versiune
        ↓
        Reîncarcă aplicația 🔄
```

## 🐛 Debugging

### Console Logs

Sistemul afișează log-uri clare în console:

```
🚀 Initializing FarmCalc storage system...
✅ Storage version 1.2.0 validated successfully
```

Sau:

```
🔄 Version mismatch detected (stored: 1.1.0, current: 1.2.0)
📦 Clearing localStorage to prevent compatibility issues...
🧹 Clearing all storage...
✅ Storage cleared successfully
🔄 Reloading application...
```

### Testare

Pentru a testa sistemul local:

1. Deschide DevTools → Application → Local Storage
2. Schimbă manual `farmcalc_app_version` la o valoare diferită
3. Reîncarcă pagina → Ar trebui să vezi curățarea automată

### Clear Cache Manual

Utilizatorii pot apăsa butonul "Clear Cache" (🔄) din header oricând întâmpină probleme.

## ⚠️ Limitări și Considerații

### Ce NU face sistemul:

- ❌ Nu șterge datele din Supabase (doar localStorage)
- ❌ Nu afectează autentificarea (Supabase gestionează separat session-ul)
- ❌ Nu face backup automat al datelor

### Situații Speciale:

- **Incognito/Private Mode**: Storage-ul este deja curat, sistemul funcționează normal
- **Storage blocat**: Error Boundary prinde problema și oferă UI de recovery
- **Storage plin**: Sistema detectează `QuotaExceededError` și curăță automat

## 📝 Changelog

### Versiune 1.2.0 (Curent)
- ✅ Sistem complet de versionare implementat
- ✅ Error Boundary pentru storage
- ✅ Buton Clear Cache în header
- ✅ Safe API pentru localStorage
- ✅ Migrare date critice (opțional)

## 🆘 Troubleshooting

### Problema: "Aplicația nu se încarcă deloc"
**Soluție**: Verifică console pentru erori. Încearcă Clear Cache manual.

### Problema: "Date pierdute după actualizare"
**Soluție**: Adaugă cheile în `migrateCriticalData()` pentru a le păstra între versiuni.

### Problema: "Loop infinit de reîncărcare"
**Soluție**: Verifică că `APP_VERSION` este string valid și că nu există erori în `initializeStorage()`.

## 👥 Pentru Utilizatori Finali

Dacă vezi mesajul "Se curăță cache-ul...":

1. ✅ Acest lucru este normal după actualizări
2. ✅ Aplicația se va reîncărca automat în câteva secunde
3. ✅ Datele tale din Supabase (calcule, rotații) sunt în siguranță
4. ✅ Vei fi autentificat automat din nou

Dacă problema persistă:
- Apasă butonul "Clear Cache" (🔄) din header
- Sau închide și redeschide browser-ul
- Contactează suportul tehnic dacă problema continuă

---

**Autor**: FarmCalc Development Team  
**Ultima actualizare**: 2026-02-23  
**Versiune document**: 1.0
