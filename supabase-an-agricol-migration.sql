-- ================================================
-- MIGRARE: Adăugare An Agricol
-- Data: 2026-02-28
-- Scop: Adăugare suport pentru ani agricoli multipli
-- ================================================

-- 1. Adaugă coloana an_agricol la toate tabelele relevante
-- =======================================================

-- Tabel CULTURI
ALTER TABLE culturi
ADD COLUMN IF NOT EXISTS an_agricol TEXT NOT NULL DEFAULT '2024-2025';

-- Index pentru performanță
CREATE INDEX IF NOT EXISTS idx_culturi_an_agricol
ON culturi(user_id, an_agricol);

-- Tabel UTILAJE (pentru custom per an - opțional)
ALTER TABLE utilaje
ADD COLUMN IF NOT EXISTS an_agricol TEXT;

-- Index pentru utilaje
CREATE INDEX IF NOT EXISTS idx_utilaje_an_agricol
ON utilaje(user_id, an_agricol);

-- Tabel IMPLEMENTELE (pentru custom per an - opțional)
ALTER TABLE implementele
ADD COLUMN IF NOT EXISTS an_agricol TEXT;

-- Index pentru implementele
CREATE INDEX IF NOT EXISTS idx_implementele_an_agricol
ON implementele(user_id, an_agricol);

-- Tabel LUCRARI (pentru custom per an)
ALTER TABLE lucrari
ADD COLUMN IF NOT EXISTS an_agricol TEXT NOT NULL DEFAULT '2024-2025';

-- Index pentru lucrari
CREATE INDEX IF NOT EXISTS idx_lucrari_an_agricol
ON lucrari(user_id, an_agricol);


-- 2. Actualizează toate înregistrările existente cu anul implicit
-- ===============================================================

UPDATE culturi
SET an_agricol = '2024-2025'
WHERE an_agricol IS NULL;

UPDATE lucrari
SET an_agricol = '2024-2025'
WHERE an_agricol IS NULL;


-- 3. Funcție helper pentru calcularea anului agricol curent
-- =========================================================

CREATE OR REPLACE FUNCTION get_current_agricultural_year()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  current_month INTEGER;
  current_year INTEGER;
  ag_year TEXT;
BEGIN
  current_month := EXTRACT(MONTH FROM CURRENT_DATE);
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Dacă suntem în august-decembrie, anul agricol este current_year - (current_year + 1)
  -- Dacă suntem în ianuarie-iulie, anul agricol este (current_year - 1) - current_year
  IF current_month >= 8 THEN
    ag_year := current_year || '-' || (current_year + 1);
  ELSE
    ag_year := (current_year - 1) || '-' || current_year;
  END IF;

  RETURN ag_year;
END;
$$;


-- 4. Funcție pentru ștergerea datelor mai vechi de 5 ani
-- ======================================================

CREATE OR REPLACE FUNCTION cleanup_old_agricultural_years()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  current_year INTEGER;
  cutoff_year TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Păstrăm doar ultimii 5 ani
  -- Dacă suntem în 2026, ștergem tot ce e < 2021-2022
  cutoff_year := (current_year - 6) || '-' || (current_year - 5);

  -- Șterge culturi vechi
  DELETE FROM culturi WHERE an_agricol < cutoff_year;

  -- Șterge lucrări vechi
  DELETE FROM lucrari WHERE an_agricol < cutoff_year;

  RAISE NOTICE 'Cleaned up data older than %', cutoff_year;
END;
$$;


-- 5. Trigger pentru cleanup automat (opțional - se poate rula manual)
-- ==================================================================

-- Comentat pentru siguranță - descomenteaza dacă vrei cleanup automat
-- CREATE OR REPLACE FUNCTION trigger_cleanup_old_years()
-- RETURNS trigger
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--   PERFORM cleanup_old_agricultural_years();
--   RETURN NEW;
-- END;
-- $$;

-- CREATE TRIGGER auto_cleanup_old_years
-- AFTER INSERT ON culturi
-- FOR EACH STATEMENT
-- EXECUTE FUNCTION trigger_cleanup_old_years();


-- 6. View pentru anii agricoli disponibili per utilizator
-- =======================================================

CREATE OR REPLACE VIEW available_agricultural_years AS
SELECT DISTINCT
  user_id,
  an_agricol,
  COUNT(*) as numar_culturi
FROM culturi
GROUP BY user_id, an_agricol
ORDER BY user_id, an_agricol DESC;


-- 7. Comentarii pentru documentare
-- =================================

COMMENT ON COLUMN culturi.an_agricol IS 'An agricol în format YYYY-YYYY (ex: 2024-2025). Anul agricol începe în august.';
COMMENT ON COLUMN lucrari.an_agricol IS 'An agricol în format YYYY-YYYY (ex: 2024-2025). Anul agricol începe în august.';
COMMENT ON FUNCTION get_current_agricultural_year() IS 'Returnează anul agricol curent bazat pe luna curentă (august = început an nou)';
COMMENT ON FUNCTION cleanup_old_agricultural_years() IS 'Șterge datele mai vechi de 5 ani agricoli';


-- ================================================
-- FIN MIGRARE
-- ================================================

-- Pentru a rula această migrare:
-- 1. Conectează-te la Supabase Dashboard
-- 2. Navighează la SQL Editor
-- 3. Copiază și rulează acest script
-- 4. Verifică că totul s-a executat cu succes

-- Pentru a verifica:
-- SELECT get_current_agricultural_year(); -- ar trebui să returneze anul curent
-- SELECT * FROM available_agricultural_years; -- vezi anii disponibili
