import React from 'react';
import { Link } from 'react-router-dom';
import { useHeaderTone } from '../hooks/useHeaderTone';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBandProps {
  pill?: string;
  title: string;
  accentWord?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  heightClass?: string;
}

export const PageBand: React.FC<PageBandProps> = ({
  pill,
  title,
  accentWord,
  subtitle,
  breadcrumbs,
  children,
  heightClass = 'min-h-[220px] sm:min-h-[260px]'
}) => {
  useHeaderTone('dark');

  return (
    <section
      data-header-tone="dark"
      className={`page-band w-full bg-gradient-to-b from-[#06162E] via-[#0E254E] to-[#16386C] text-white pt-[116px] sm:pt-[124px] md:pt-[132px] pb-10 px-4 sm:px-6 lg:px-8 rounded-b-[36px] sm:rounded-b-[44px] relative overflow-hidden ${heightClass}`}
    >
      {/* Ambient Radial Top Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[260px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(111,160,232,0.5) 0%, rgba(6,22,46,0) 70%)'
        }}
      />

      <div className="max-w-[1440px] w-full mx-auto relative z-10">
        {/* Breadcrumb row: clearly below fixed header */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-[13px] text-white/60 mb-3" aria-label="Breadcrumb">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-white/40">/</span>}
                {b.href ? (
                  <Link to={b.href} className="hover:text-white transition-colors">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Pill Tag */}
        {pill && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-semibold tracking-wider uppercase mb-3">
            <span>{pill}</span>
          </div>
        )}

        {/* Heading: responsive typography with break-words to avoid clipping on small devices */}
        <h1 className="v4-mixed-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.12] tracking-[-0.03em] text-white break-words">
          {title} {accentWord && <em className="accent">{accentWord}</em>}
        </h1>

        {/* Subtitle if provided */}
        {subtitle && (
          <p className="mt-2.5 text-[14px] sm:text-[15px] md:text-[16px] text-white/80 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Optional inner content like search bar or action buttons */}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
};
