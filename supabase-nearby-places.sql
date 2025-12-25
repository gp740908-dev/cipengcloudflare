-- =============================================
-- NEARBY PLACES FOR VILLAS
-- =============================================

-- Add nearby_places column to villas table (JSON array)
ALTER TABLE villas 
ADD COLUMN IF NOT EXISTS nearby_places JSONB DEFAULT '[]'::jsonb;

-- Example structure for nearby_places:
-- [
--   { "name": "Tegallalang Rice Terrace", "type": "attraction", "distance": "1.5 km" },
--   { "name": "Ubud Royal Palace", "type": "landmark", "distance": "3 km" },
--   { "name": "Monkey Forest", "type": "attraction", "distance": "2 km" },
--   { "name": "Tirta Empul Temple", "type": "temple", "distance": "15 km" }
-- ]

-- Types can be: beach, temple, attraction, restaurant, shopping, landmark, airport

-- Add comment for documentation
COMMENT ON COLUMN villas.nearby_places IS 'JSON array of nearby places with name, type, and distance';
