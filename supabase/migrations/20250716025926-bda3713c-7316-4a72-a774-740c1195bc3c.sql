-- Add featured field to articles table
ALTER TABLE articles ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Add index for better performance when querying featured articles
CREATE INDEX idx_articles_featured ON articles (is_featured) WHERE is_featured = true;