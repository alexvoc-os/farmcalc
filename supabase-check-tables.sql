-- Verifică dacă tabelele există
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('utilaje', 'implementele', 'lucrari_custom');

-- Verifică structura tabelului utilaje
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'utilaje'
ORDER BY ordinal_position;
