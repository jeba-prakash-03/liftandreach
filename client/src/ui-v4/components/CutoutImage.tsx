import React, { useState } from 'react';

interface CutoutImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  rawImage?: string;
  alt: string;
  className?: string;
}

export const CutoutImage: React.FC<CutoutImageProps> = ({
  rawImage = '',
  alt,
  className = '',
  ...props
}) => {
  const [errorStage, setErrorStage] = useState<number>(0);

  // Normalize stem
  const rawStem = rawImage
    ? rawImage
        .replace(/^.*[\\/]/, '')
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
    : '';
  const baseStem = rawStem.replace(/-+/g, '-');

  // Fallbacks:
  // 0: High-res WebP cutout (/images/cutout/${baseStem}-800.webp with srcset 800/480)
  // 1: PNG cutout (/images/cutout/${baseStem}.png)
  // 2: Original image in rounded frame (/images/product/...)
  // 3: Neutral fallback (/images/cutout/scissor-lift.webp)

  if (!baseStem) {
    return (
      <div className={`flex items-center justify-center bg-[#F1F5F9] text-gray-400 text-xs ${className}`}>
        No image
      </div>
    );
  }

  if (errorStage === 0) {
    return (
      <picture>
        <source
          srcSet={`/images/cutout/${baseStem}-800.webp 800w, /images/cutout/${baseStem}-480.webp 480w`}
          sizes="(max-width: 640px) 90vw, 400px"
          type="image/webp"
        />
        <img
          src={`/images/cutout/${baseStem}-800.webp`}
          alt={alt}
          className={className}
          loading="lazy"
          onError={() => setErrorStage(1)}
          {...props}
        />
      </picture>
    );
  }

  if (errorStage === 1) {
    return (
      <img
        src={`/images/cutout/${baseStem}.png`}
        alt={alt}
        className={className}
        loading="lazy"
        onError={() => setErrorStage(2)}
        {...props}
      />
    );
  }

  if (errorStage === 2) {
    return (
      <div className="w-full h-full p-2 flex items-center justify-center rounded-[24px] bg-white border border-[#E2E8F0]">
        <img
          src={rawImage || '/images/cutout/scissor-lift.webp'}
          alt={alt}
          className={`object-contain max-h-full ${className}`}
          loading="lazy"
          onError={() => {
            console.warn(`[ImageFallback] Failed to load original for ${baseStem}: ${rawImage}`);
            setErrorStage(3);
          }}
          {...props}
        />
      </div>
    );
  }

  return (
    <img
      src="/images/cutout/scissor-lift.webp"
      alt={alt}
      className={`object-contain opacity-60 ${className}`}
      {...props}
    />
  );
};
