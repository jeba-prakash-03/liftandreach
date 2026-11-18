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

  // Normalize stems: support both raw double-hyphen and single-hyphen variants
  const rawStem = rawImage
    ? rawImage
        .replace(/^.*[\\/]/, '')
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
    : '';
  const singleHyphenStem = rawStem.replace(/-+/g, '-');
  const baseStem = rawStem;

  if (!rawStem && !rawImage) {
    return (
      <div className={`flex items-center justify-center bg-[#F1F5F9] text-gray-400 text-xs ${className}`}>
        No image
      </div>
    );
  }

  // Stage 0: WebP cutout with exact stem (e.g. scissor-lift--pit-mounted-800.webp)
  if (errorStage === 0) {
    return (
      <picture>
        <source
          srcSet={`/images/cutout/${baseStem}-800.webp 800w, /images/cutout/${baseStem}-480.webp 480w, /images/cutout/${baseStem}.webp 800w`}
          sizes="(max-width: 640px) 90vw, 400px"
          type="image/webp"
        />
        <img
          src={`/images/cutout/${baseStem}-800.webp`}
          alt={alt}
          className={`w-full h-full object-contain ${className}`}
          loading="lazy"
          onError={() => setErrorStage(1)}
          {...props}
        />
      </picture>
    );
  }

  // Stage 1: Try single-hyphen stem
  if (errorStage === 1) {
    return (
      <picture>
        <source
          srcSet={`/images/cutout/${singleHyphenStem}-800.webp 800w, /images/cutout/${singleHyphenStem}-480.webp 480w, /images/cutout/${singleHyphenStem}.webp 800w`}
          sizes="(max-width: 640px) 90vw, 400px"
          type="image/webp"
        />
        <img
          src={`/images/cutout/${singleHyphenStem}-800.webp`}
          alt={alt}
          className={`w-full h-full object-contain ${className}`}
          loading="lazy"
          onError={() => setErrorStage(2)}
          {...props}
        />
      </picture>
    );
  }

  // Stage 2: Direct raw product image (clean, unboxed, seamless)
  if (errorStage === 2) {
    return (
      <img
        src={rawImage || `/images/cutout/${baseStem}.png`}
        alt={alt}
        className={`w-full h-full object-contain ${className}`}
        loading="lazy"
        onError={() => setErrorStage(3)}
        {...props}
      />
    );
  }

  // Stage 3: Neutral fallback
  return (
    <img
      src="/images/cutout/scissor-lift.webp"
      alt={alt}
      className={`w-full h-full object-contain opacity-75 ${className}`}
      {...props}
    />
  );
};
