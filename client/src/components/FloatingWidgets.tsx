import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAppStore } from '../store/useAppStore';
import { ArrowUp } from 'lucide-react';

export const FloatingWidgets: React.FC = () => {
  const { settings } = useApp();
  const isMobileMenuOpen = useAppStore((state) => state.isMobileMenuOpen);
  const isEnquiryDrawerOpen = useAppStore((state) => state.isEnquiryDrawerOpen);
  const quickViewProductSlug = useAppStore((state) => state.quickViewProductSlug);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hide floating widgets whenever mobile menu or modal drawers are open
  const shouldHide = isMobileMenuOpen || isEnquiryDrawerOpen || !!quickViewProductSlug;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 600);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = (settings.whatsapp || '918939359592').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Lift and Reach Equipments, I am inquiring about your hydraulic lifting equipment.'
  )}`;

  // Dash calculations for 44px circle (radius = 18, circumference = 2 * PI * 18 = 113.1)
  const strokeDashoffset = 113.1 - (113.1 * scrollProgress) / 100;

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3 pointer-events-none transition-all duration-300 ${
        shouldHide ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      id="floating-widgets-container"
    >
      {/* 
        Single Back-to-top button: 44px circle with progress ring,
        appears after 600px scroll, positioned 16px above WhatsApp button (gap-4 = 16px).
      */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="pointer-events-auto relative w-[44px] h-[44px] rounded-full bg-white text-[#0B1220] flex items-center justify-center border border-[#E3E8F0] shadow-md hover:bg-[#F3F5F8] transition-colors cursor-pointer"
        >
          {/* Progress circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#E3E8F0"
              strokeWidth="2.5"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#2A62C9"
              strokeWidth="2.5"
              strokeDasharray="113.1"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp className="w-4 h-4 stroke-[2] text-[#0B1220]" />
        </button>
      )}

      {/* 
        WhatsApp button: 52px circle, brand blue (#2A62C9), white glyph
      */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto group relative flex items-center justify-center w-[52px] h-[52px] rounded-full bg-[#2A62C9] text-white hover:bg-[#1E4E96] transition-all cursor-pointer shadow-lg"
      >
        <span className="absolute right-full mr-3 px-2.5 py-1 bg-[#0E1A33] text-white text-xs rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          WhatsApp Inquiries
        </span>
        <svg
          className="w-[26px] h-[26px] fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
    </div>
  );
};
