import React from 'react';
import { Link } from 'react-router-dom';
import { ArchitecturalImage } from './ArchitecturalImage';

interface ProductFigureProps {
  id: number;
  name: string;
  code?: string | null;
  slug: string;
  categorySlug?: string;
  parentCategorySlug?: string;
  image: string;
  specs?: {
    capacity?: string;
    maxHeight?: string;
    platform?: string;
  };
  isChecked?: boolean;
  onToggleCheck?: (e: React.MouseEvent) => void;
  className?: string;
}

export const ProductFigure: React.FC<ProductFigureProps> = ({
  id,
  name,
  code,
  slug,
  categorySlug = 'equipment',
  parentCategorySlug,
  image,
  specs,
  isChecked = false,
  onToggleCheck,
  className = ''
}) => {
  const targetUrl = parentCategorySlug
    ? `/products/${parentCategorySlug}/${categorySlug}/${slug}`
    : `/products/${categorySlug}/${slug}`;

  // Parse model codes (each code on its own line, max 2 then +N more)
  const codeList = code ? code.split('/').map((c) => c.trim()).filter(Boolean) : [];
  const displayCodes = codeList.slice(0, 2);
  const remainingCount = codeList.length - 2;

  return (
    <div
      className={`group relative flex flex-col justify-between bg-transparent select-none transition-all duration-300 ${className}`}
    >
      {/* Whole item is link, except checkbox */}
      <Link to={targetUrl} className="block space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Row 1: Plate 4:3 (--stone, max 260px tall, rule 1.1) */}
          <div className="relative aspect-[4/3] max-h-[260px] w-full bg-[#E8E4DD] rounded-none overflow-hidden transition-colors duration-300 group-hover:bg-[#E0DBD2] flex items-center justify-center p-4">
            <ArchitecturalImage
              src={image}
              alt={name}
              natWidth={250}
              natHeight={250}
            />

            {/* Selection Checkbox for Compare/Enquiry - appears top-left on hover/focus, visible on touch */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onToggleCheck) onToggleCheck(e);
              }}
              className="absolute top-3 left-3 z-20 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 cursor-pointer p-1"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="w-4 h-4 rounded-[2px] text-[#1F4E96] focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Row 2: NAME - Inter 16px/600, line-height 1.3, clamp to 2 lines, reserved min-height of 2 lines */}
          <h3 className="font-body font-semibold text-[15px] sm:text-base leading-[1.3] text-[#15191E] group-hover:text-[#1F4E96] group-hover:underline transition-colors line-clamp-2 min-h-[2.6em]">
            {name}
          </h3>

          {/* Row 3: MODEL CODES - JetBrains Mono 12px, --steel. Each code on its OWN line, never broken mid-code */}
          <div className="font-mono text-xs text-[#7C8794] space-y-0.5 min-h-[32px]">
            {displayCodes.length > 0 ? (
              <>
                {displayCodes.map((c, i) => (
                  <div key={i} className="truncate whitespace-nowrap">
                    {c}
                  </div>
                ))}
                {remainingCount > 0 && (
                  <div className="text-[11px] text-[#3A424C]">
                    +{remainingCount} more
                  </div>
                )}
              </>
            ) : (
              <div className="text-[#D5CFC5]">&mdash;</div>
            )}
          </div>
        </div>

        {/* Row 4: Hairline, then a 3-row spec list (label left 13px --steel, value right 13px mono --charcoal) */}
        <div className="pt-2.5 mt-2 border-t border-[#D5CFC5] space-y-1 text-xs">
          {specs?.capacity && (
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#7C8794] font-body text-[13px]">Capacity</span>
              <span className="font-mono text-[13px] text-[#15191E] font-medium text-right truncate">
                {specs.capacity}
              </span>
            </div>
          )}
          {specs?.maxHeight && (
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#7C8794] font-body text-[13px]">Max height</span>
              <span className="font-mono text-[13px] text-[#15191E] font-medium text-right truncate">
                {specs.maxHeight}
              </span>
            </div>
          )}
          {specs?.platform && (
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[#7C8794] font-body text-[13px]">Platform</span>
              <span className="font-mono text-[13px] text-[#15191E] font-medium text-right truncate">
                {specs.platform}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
