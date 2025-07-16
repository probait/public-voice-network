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
  // For now, we'll just use the original image source without generating different sizes
  // This will be enhanced when image processing pipeline is added

  return (
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
  );
};

export default ResponsiveImage;