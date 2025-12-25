-- =============================================
-- ADD LOCATION COORDINATES TO VILLAS TABLE
-- =============================================

-- Add latitude and longitude columns to villas table
ALTER TABLE villas 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Update existing villas with default Ubud coordinates (if needed)
UPDATE villas 
SET 
    latitude = -8.5069 + (random() * 0.02 - 0.01),
    longitude = 115.2624 + (random() * 0.02 - 0.01)
WHERE latitude IS NULL OR longitude IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN villas.latitude IS 'Latitude coordinate for map display';
COMMENT ON COLUMN villas.longitude IS 'Longitude coordinate for map display';
