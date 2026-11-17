import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, openQuoteModal } = useApp();

  return (
    <footer className="w-full select-none">
      {/* 1. Red Band (80px) "Tell us what you need to lift" + white button "Request a quote" */}
      <div className="w-full min-h-[80px] bg-[#E3262E] text-white px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display uppercase text-xl sm:text-2xl font-bold tracking-tight m-0 text-white">
            TELL US WHAT YOU NEED TO LIFT
          </h3>
          <p className="font-body text-xs sm:text-sm text-white/90 m-0">
            Engineered hydraulic solutions up to 25 Tons capacity and 25 Meters height.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openQuoteModal()}
          className="h-[48px] px-6 bg-white hover:bg-[#F2F5F9] active:scale-[0.98] text-[#071A33] font-display uppercase tracking-[0.02em] text-sm font-bold rounded-[4px] transition-all cursor-pointer border-0 shrink-0 shadow-sm"
        >
          REQUEST A QUOTE
        </button>
      </div>

      {/* 2. Navy Body (4 columns) */}
      <div className="w-full bg-[#071A33] text-[#D9E1EC] px-6 sm:px-12 pt-14 pb-10">
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Identity + Address / Phones / Email */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block" aria-label="Lift and Reach Equipments">
              <img
                src="/images/logo-white-footer.png"
                alt="Lift and Reach Equipments"
                className="h-[40px] w-auto object-contain"
              />
            </Link>

            <p className="font-body text-xs sm:text-[13px] text-[#5A6B82] leading-relaxed max-w-sm m-0">
              Lift and Reach Equipments has wide product expertise in design, development and manufacturing with more than 25 years of broad industrial experience in hydraulic material handling machinery.
            </p>

            <div className="space-y-2 font-body text-xs text-[#D9E1EC] pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E3262E] shrink-0 mt-0.5" />
                <p className="m-0 leading-snug">
                  No.419/9-1, Pillaiyar Koil Street, Kuthambakkam, Chennai - 600124, Tamil Nadu.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E3262E] shrink-0" />
                <a href="tel:918939359592" className="hover:text-white transition-colors">
                  (+91) 89393 59592 / (+91) 97893 97504
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E3262E] shrink-0" />
                <a href="mailto:liftnreach@gmail.com" className="hover:text-white transition-colors">
                  liftnreach@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Products List (2 sub-columns) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="font-display uppercase text-xs tracking-wider text-white font-bold block">
              PRODUCTS CATALOG
            </span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categories.slice(0, 10).map((c) => (
                <Link
                  key={c.id}
                  to={`/products/${c.slug}`}
                  className="text-xs font-body text-[#D9E1EC] hover:text-[#E3262E] transition-colors truncate"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Col 3: Company Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-display uppercase text-xs tracking-wider text-white font-bold block">
              COMPANY
            </span>
            <div className="space-y-2 text-xs font-body">
              <div>
                <Link to="/" className="text-[#D9E1EC] hover:text-[#E3262E] transition-colors">Home</Link>
              </div>
              <div>
                <Link to="/about" className="text-[#D9E1EC] hover:text-[#E3262E] transition-colors">About Us</Link>
              </div>
              <div>
                <Link to="/products" className="text-[#D9E1EC] hover:text-[#E3262E] transition-colors">Products</Link>
              </div>
              <div>
                <Link to="/contact" className="text-[#D9E1EC] hover:text-[#E3262E] transition-colors">Contact Works</Link>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Support */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-display uppercase text-xs tracking-wider text-white font-bold block">
              SUPPORT
            </span>
            <div className="space-y-2 text-xs font-body text-[#D9E1EC]">
              <p className="m-0 leading-relaxed text-[#5A6B82]">
                Dedicated team of field service technicians visiting customer sites across India.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="font-display uppercase text-xs text-[#E3262E] font-bold hover:underline"
                >
                  Schedule Service &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Strip: Copyright */}
        <div className="w-full max-w-[1360px] mx-auto mt-12 pt-6 border-t border-[#0B1B33] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5A6B82]">
          <div>
            &copy; 2026 Lift and Reach Equipments. All rights reserved.
          </div>
          <div>
            Industrial Hydraulic Material Handling Machinery Manufacturer — Chennai
          </div>
        </div>
      </div>
    </footer>
  );
};
