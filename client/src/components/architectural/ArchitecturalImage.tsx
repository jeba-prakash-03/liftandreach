import React from 'react';

interface ArchitecturalImageProps {
  src: string;
  alt: string;
  natWidth?: number;
  natHeight?: number;
  className?: string;
  eager?: boolean;
}

export const ArchitecturalImage: React.FC<ArchitecturalImageProps> = ({
  src,
  alt,
  natWidth = 250,
  natHeight = 250,
  className = '',
  eager = false
}) => {
  // Use cutout WebP if available
  const getCutoutSrc = (originalPath: string) => {
    if (!originalPath || !originalPath.startsWith('/images/product/')) return originalPath;
    const clean = originalPath.replace(/\.(jpg|jpeg|png|JPG|PNG|webp)$/i, '');
    return `${clean}-cutout.webp`;
  };

  const cutoutSrc = getCutoutSrc(src);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Floor shadow */}
      <div className="floor-shadow" />

      {/* 
        Part 1 & 8 Rules:
        Image object-contain max 78%-85% of plate, never above native size (1.0x at DPR 1).
        Any image whose natural width < 1.0 x renderedWidth is a failure:
        Hard-cap max-width and max-height to natural size or smaller.
      */}
      <img
        src={cutoutSrc}
        alt={alt}
        width={natWidth}
        height={natHeight}
        loading={eager ? 'eager' : 'lazy'}
        // @ts-ignore
        fetchpriority={eager ? 'high' : 'auto'}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== src) {
            target.src = src;
          }
        }}
        className={`relative z-10 object-contain select-none transition-transform duration-300 ${className}`}
        style={{
          maxWidth: `min(80%, ${natWidth}px)`,
          maxHeight: `min(78%, ${natHeight}px)`
        }}
      />
    </div>
  );
};
