import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUp } from 'lucide-react';

export const FloatingWidgets: React.FC = () => {
  const { settings } = useApp();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Rule 6: Back-to-top appears only after 600px scroll
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = settings.whatsapp || '918939359592';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Lift and Reach Equipments, I am inquiring about your hydraulic lifting equipment.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      {/* 
        Rule 6: Back-to-top appears only after 600px scroll, 44px,
        placed 16px ABOVE the WhatsApp button so they never overlap.
        Uses outline style for back-to-top.
      */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="pointer-events-auto mb-4 w-[44px] h-[44px] rounded-[2px] bg-[#F6F4F0] text-[#15191E] flex items-center justify-center border border-[#15191E] hover:bg-[#15191E] hover:text-[#F6F4F0] transition-colors cursor-pointer shadow-sm"
        >
          <ArrowUp className="w-4 h-4 stroke-[1.25]" />
        </button>
      )}

      {/* 
        Rule 6: Proper WhatsApp SVG glyph, 26px, white on --charcoal square 52px, 2px radius
      */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto group relative flex items-center justify-center w-[52px] h-[52px] rounded-[2px] bg-[#15191E] text-white hover:bg-[#1F4E96] transition-all cursor-pointer shadow-md"
      >
        <span className="absolute right-full mr-3 px-2.5 py-1 bg-[#15191E] text-[#F6F4F0] text-xs font-body rounded-[2px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
