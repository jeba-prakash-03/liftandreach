import React, { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  tileClassName?: string;
  eager?: boolean;
  width?: number;
  height?: number;
  contain?: boolean;
  onLoad?: () => void;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  tileClassName = '',
  eager = false,
  width = 250,
  height = 250,
  contain = true,
  onLoad
}) => {
  const [loaded, setLoaded] = useState(false);

  // Helper to construct WebP srcset
  const getSrcSet = (imagePath: string) => {
    if (!imagePath || !imagePath.startsWith('/images/product/')) return undefined;
    const clean = imagePath.replace(/\.(jpg|jpeg|png|JPG|PNG|webp)$/i, '');
    return `${clean}-480w.webp 480w, ${clean}-800w.webp 800w, ${clean}-1200w.webp 1200w`;
  };

  const srcset = getSrcSet(src);
  const fallbackSrc = src.endsWith('.webp')
    ? src
    : src.replace(/\.(jpg|jpeg|png|JPG|PNG)$/i, '.webp');

  const handleLoaded = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#F8FAFC] ${tileClassName}`}
    >
      <img
        src={fallbackSrc || src}
        srcSet={srcset}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        // @ts-ignore
        fetchpriority={eager ? 'high' : 'auto'}
        onLoad={handleLoaded}
        className={`max-w-[85%] max-h-[85%] transition-opacity duration-200 ${
          contain ? 'object-contain' : 'object-contain'
        } ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};
