import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}) => {
  // Generate different sized URLs based on the original image
  const generateSrcSet = (originalSrc: string) => {
    // For now, we'll use the same image at different sizes
    // This will be enhanced when image processing pipeline is added
    const sizes = [400, 800, 1200];
    return sizes
      .map(size => `${originalSrc}?w=${size} ${size}w`)
      .join(', ');
  };

  const srcSet = generateSrcSet(src);

  return (
    <picture>
      <source 
        srcSet={srcSet}
        sizes={sizes}
        type="image/webp"
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={(e) => {
          // Fallback to a placeholder image
          e.currentTarget.src = "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=225&fit=crop";
        }}
      />
    </picture>
  );
};

export default ResponsiveImage;