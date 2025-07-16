-- Add image metadata fields to meetups table
ALTER TABLE public.meetups 
ADD COLUMN image_width integer,
ADD COLUMN image_height integer,
ADD COLUMN image_file_size integer;

-- Add image support and metadata to articles table
ALTER TABLE public.articles 
ADD COLUMN image_url text,
ADD COLUMN image_width integer,
ADD COLUMN image_height integer,
ADD COLUMN image_file_size integer;

-- Add comments for clarity
COMMENT ON COLUMN public.meetups.image_width IS 'Image width in pixels';
COMMENT ON COLUMN public.meetups.image_height IS 'Image height in pixels';
COMMENT ON COLUMN public.meetups.image_file_size IS 'Image file size in bytes';
COMMENT ON COLUMN public.articles.image_url IS 'URL to article hero image';
COMMENT ON COLUMN public.articles.image_width IS 'Image width in pixels';
COMMENT ON COLUMN public.articles.image_height IS 'Image height in pixels';
COMMENT ON COLUMN public.articles.image_file_size IS 'Image file size in bytes';