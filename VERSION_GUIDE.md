# 🔢 Ghid Rapid: Actualizare Versiune FarmCalc

## 📌 Cum să actualizezi versiunea aplicației

### Workflow Simplu (3 pași)

Când faci modificări care afectează structura datelor din localStorage:

#### 1️⃣ Actualizează package.json

Deschide [`package.json`](package.json:3) și modifică versiunea:

```json
{
  "name": "farmcalc",
  "version": "1.3.0",  // ← Schimbă aici (ex: 1.2.0 → 1.3.0)
  "private": true
}
```

#### 2️⃣ Build & Deploy

```bash
npm run build
# sau
npm run dev  # pentru development
```

#### 3️⃣ Gata! 🎉

Sistemul de storage va:
- ✅ Detecta automat noua versiune
- ✅ Curăța datele vechi incompatibile
- ✅ Reîncărca aplicația pentru utilizatori
- ✅ Afișa log-uri clare în console

## 🎯 Reguli de Versioning (Semantic Versioning)

```
MAJOR.MINOR.PATCH
  |     |     |
  |     |     └─── Bug fixes minore (1.2.3 → 1.2.4)
  |     └───────── Features noi (1.2.0 → 1.3.0)
  └─────────────── Breaking changes (1.2.0 → 2.0.0)
```

### Când să incrementezi versiunea?

| Tip Schimbare | Versiune | Curăță Storage? | Exemplu |
|---------------|----------|-----------------|---------|
| **Bug fix minor** | PATCH (1.2.3 → 1.2.4) | Nu | Fix typo, styling |
| **Feature nou** | MINOR (1.2.0 → 1.3.0) | Da* | Adăugare câmp nou |
| **Breaking change** | MAJOR (1.2.0 → 2.0.0) | Da | Restructurare completă |

\* *Doar dacă afectează structura localStorage*

## 🔍 Verificare Versiune

### În Browser (DevTools Console)

După ce aplici o nouă versiune, verifică console-ul pentru:

```
🚀 Initializing FarmCalc storage system...
✅ Storage version 1.3.0 validated successfully
```

Sau dacă versiunea s-a schimbat:

```
🔄 Version mismatch detected (stored: 1.2.0, current: 1.3.0)
📦 Clearing localStorage to prevent compatibility issues...
🧹 Clearing all storage...
✅ Storage cleared successfully
🔄 Reloading application...
```

### În Cod

```typescript
import { getCurrentVersion } from '@/lib/storage-manager';

console.log('App version:', getCurrentVersion());
// Output: App version: 1.3.0
```

## 📊 Istoric Versiuni

| Versiune | Data | Modificări |
|----------|------|------------|
| **1.2.0** | 2026-02-23 | Sistem de versioning automat implementat |
| **1.1.0** | - | - |
| **1.0.0** | - | Release inițial |

## ⚠️ Important

### ❌ NU modifica manual `storage-manager.ts`

```typescript
// ❌ NU FACE ASTA
const APP_VERSION = '1.3.0'; // GREȘIT!
```

### ✅ Modifică doar `package.json`

```json
// ✅ CORECT
{
  "version": "1.3.0"  // Modifică aici!
}
```

## 🧪 Testare Locală

Pentru a testa că versioning-ul funcționează:

1. **Simulează date vechi:**
   ```javascript
   // În DevTools Console
   localStorage.setItem('farmcalc_app_version', '1.0.0');
   ```

2. **Reîncarcă pagina:**
   - Ar trebui să vezi log-urile de curățare
   - Storage-ul va fi curat
   - Versiunea va fi actualizată automat

3. **Verifică:**
   ```javascript
   localStorage.getItem('farmcalc_app_version');
   // Ar trebui să returneze versiunea curentă din package.json
   ```

## 🚀 Deployment

### Development
```bash
npm run dev
```
Versiunea este citită la fiecare hot-reload.

### Production
```bash
npm run build
npm start
```
Versiunea este baked-in în bundle la build time.

### Netlify/Vercel
Nu este nevoie de configurație specială - versiunea este detectată automat la build.

## 💡 Tips & Tricks

### Versiune Rapidă (Git-based)

Dacă folosești Git, poți automatiza versioning-ul cu:

```bash
# Incrementează versiunea și creează un commit + tag
npm version patch  # 1.2.0 → 1.2.1
npm version minor  # 1.2.0 → 1.3.0
npm version major  # 1.2.0 → 2.0.0
```

Aceasta va actualiza automat `package.json` și va crea un Git tag.

### Pre-deploy Checklist

Înainte de deploy:
- [ ] Ai actualizat versiunea în `package.json`?
- [ ] Ai testat local curățarea storage-ului?
- [ ] Ai verificat că aplicația funcționează după curățare?
- [ ] Ai actualizat `CHANGELOG.md` (dacă există)?

## ❓ FAQ

**Î: Ce se întâmplă cu utilizatorii care au versiunea veche?**  
R: La prima încărcare după deploy, storage-ul lor va fi curățat automat și aplicația reîncărcată.

**Î: Pierd utilizatorii datele din Supabase?**  
R: NU! Doar localStorage este curățat. Datele din Supabase (calcule, rotații, etc.) rămân intacte.

**Î: Pot să păstrez anumite date între versiuni?**  
R: Da! Modifică funcția `migrateCriticalData()` din [`storage-manager.ts`](src/lib/storage-manager.ts:98).

**Î: Ce se întâmplă dacă uit să actualizez versiunea?**  
R: Utilizatorii cu date vechi ar putea avea erori. Butonul "Clear Cache" le permite să rezolve singuri.

---

**Documentație completă:** Vezi [`STORAGE_SYSTEM.md`](STORAGE_SYSTEM.md:1)  
**Întrebări?** Contactează echipa de dezvoltare.
