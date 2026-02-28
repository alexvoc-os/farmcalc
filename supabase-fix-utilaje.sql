-- ================================================
-- FIX RAPID: Permite salvarea tractorelor fără câmp nume
-- ================================================

-- Varianta 1: Dacă tabelul există deja, modifică coloana nume
ALTER TABLE utilaje ALTER COLUMN nume DROP NOT NULL;
ALTER TABLE utilaje ALTER COLUMN nume SET DEFAULT NULL;

-- Sau Varianta 2 (dacă prima nu merge): Recreează tabelul
-- DROP TABLE IF EXISTS utilaje CASCADE;
-- CREATE TABLE utilaje (
--   id TEXT PRIMARY KEY,
--   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--   nume TEXT DEFAULT NULL, -- Nullable, se poate genera în cod
--   marca TEXT NOT NULL,
--   model TEXT NOT NULL,
--   putere_cp INTEGER NOT NULL,
--   an_fabricatie INTEGER,
--   consum_mediu_l_ora NUMERIC(10,2),
--   is_global BOOLEAN DEFAULT false,
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Verificare
SELECT * FROM utilaje LIMIT 5;
