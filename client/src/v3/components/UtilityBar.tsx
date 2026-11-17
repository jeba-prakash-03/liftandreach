import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UtilityBar: React.FC = () => {
  const { openQuoteModal } = useApp();

  return (
    <div className="w-full h-[36px] bg-[#071A33] text-[#D9E1EC] px-6 sm:px-12 text-xs font-body flex items-center justify-between border-b border-[#0B1B33] select-none">
      {/* Left items: Phones, email, address */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap">
        <a
          href="tel:918939359592"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#E3262E] stroke-[2]" />
          <span>+91 89393 59592</span>
        </a>

        <a
          href="mailto:liftnreach@gmail.com"
          className="hidden md:inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-[#E3262E] stroke-[2]" />
          <span>liftnreach@gmail.com</span>
        </a>

        <div className="hidden lg:inline-flex items-center gap-1.5 text-[#5A6B82]">
          <MapPin className="w-3.5 h-3.5 text-[#5A6B82]" />
          <span>Works: Kuthambakkam, Chennai, Tamil Nadu</span>
        </div>
      </div>

      {/* Right item: Request a quote */}
      <div className="shrink-0 pl-4">
        <button
          type="button"
          onClick={() => openQuoteModal()}
          className="text-[#FFFFFF] hover:text-[#E3262E] font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 text-xs"
        >
          Request a quote &rarr;
        </button>
      </div>
    </div>
  );
};
