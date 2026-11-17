import React from 'react';

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  count?: string | number;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  subtitle,
  count,
  align = 'left',
  dark = false,
  className = ''
}) => {
  return (
    <div
      className={`space-y-1.5 ${
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'
      } ${className}`}
    >
      <div className="flex items-baseline gap-3">
        {/* --fs-h2: 28px/1.25 Archivo 600 */}
        <h2
          className={`font-heading text-[24px] sm:text-[28px] leading-[1.25] font-semibold ${
            dark ? 'text-[#F6F4F0]' : 'text-[#15191E]'
          }`}
        >
          {title}
        </h2>

        {count !== undefined && (
          <span className="font-body text-[14px] text-[#7C8794]">
            ({count})
          </span>
        )}
      </div>

      {subtitle && (
        <p
          className={`font-body text-[14px] leading-relaxed max-w-[62ch] ${
            dark ? 'text-[#D5CFC5]' : 'text-[#3A424C]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
