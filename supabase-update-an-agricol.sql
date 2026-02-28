-- ================================================
-- UPDATE RAPID: Setează an_agricol pentru culturi existente
-- Data: 2026-02-28
-- Scop: Atribuie toate culturile existente la anul 2024-2025
-- ================================================

-- 1. Adaugă coloana an_agricol dacă nu există
ALTER TABLE culturi
ADD COLUMN IF NOT EXISTS an_agricol TEXT;

-- 2. Setează 2024-2025 pentru toate culturile care nu au an_agricol setat
UPDATE culturi
SET an_agricol = '2024-2025'
WHERE an_agricol IS NULL;

-- 3. Verifică rezultatul
SELECT
  user_id,
  COUNT(*) as total_culturi,
  an_agricol
FROM culturi
GROUP BY user_id, an_agricol
ORDER BY user_id, an_agricol;

-- 4. Afișează câte culturi au fost actualizate
SELECT COUNT(*) as "Culturi actualizate la 2024-2025"
FROM culturi
WHERE an_agricol = '2024-2025';

-- ================================================
-- INSTRUCȚIUNI:
-- 1. Deschide Supabase Dashboard
-- 2. Navighează la SQL Editor
-- 3. Creează New Query
-- 4. Copiază și Rulează acest script (Cmd+Enter)
-- 5. Verifică rezultatele în output
-- 6. Reîncarcă aplicația FarmCalc
-- ================================================
