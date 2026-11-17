import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAppStore } from '../../store/useAppStore';
import { Search, ShoppingBag, ChevronDown, ArrowRight, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
  onOpenWizard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
  const { categories, openQuoteModal } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const basketItems = useAppStore((state) => state.basketItems);
  const setEnquiryDrawerOpen = useAppStore((state) => state.setEnquiryDrawerOpen);

  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredCatIndex, setHoveredCatIndex] = useState(0);

  const timerRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMegaOpen(true);
    }, 120); // 120ms hover intent
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 180);
  };

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const activeCategory = categories[hoveredCatIndex] || categories[0];

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT', path: '/about' },
    { label: 'PRODUCTS', path: '/products', hasMenu: true },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#D9E1EC] select-none">
      <div className="w-full h-[76px] px-6 sm:px-12 flex items-center justify-between">
        {/* Left: Logo once */}
        <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Home">
          <img
            src="/images/logo-wide.png"
            alt="Lift and Reach Equipments"
            className="h-[44px] w-auto object-contain"
          />
        </Link>

        {/* Center: Nav Home / About / Products (mega) / Contact */}
        <nav className="hidden lg:flex items-center h-[76px] space-x-1">
          {navLinks.map((link) => {
            const isActive =
              link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);

            if (link.hasMenu) {
              return (
                <div
                  key={link.path}
                  className="relative h-[76px] flex items-center"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={link.path}
                    className={`h-[76px] px-5 flex items-center gap-1.5 font-display uppercase tracking-[0.01em] text-[14px] font-bold transition-colors ${
                      isActive ? 'text-[#0A4DA3]' : 'text-[#0B1B33] hover:text-[#0A4DA3]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className={`w-4 h-4 text-[#5A6B82] transition-transform duration-200 ${megaOpen ? 'rotate-180 text-[#E3262E]' : ''}`} />
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-5 right-5 h-[3px] bg-[#E3262E]" />
                  )}
                </div>
              );
            }

            return (
              <div key={link.path} className="relative h-[76px] flex items-center">
                <Link
                  to={link.path}
                  className={`h-[76px] px-5 flex items-center font-display uppercase tracking-[0.01em] text-[14px] font-bold transition-colors ${
                    isActive ? 'text-[#0A4DA3]' : 'text-[#0B1B33] hover:text-[#0A4DA3]'
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
                {isActive && (
                  <span className="absolute bottom-0 left-5 right-5 h-[3px] bg-[#E3262E]" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Actions: search icon, enquiry list, red button */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Ctrl+K Search Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="p-2 text-[#0B1B33] hover:text-[#0A4DA3] transition-colors cursor-pointer bg-transparent border-0"
              title="Search equipment (Ctrl+K)"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </button>
          )}

          {/* Enquiry List */}
          <button
            type="button"
            onClick={() => setEnquiryDrawerOpen(true)}
            className="flex items-center gap-1.5 font-body text-sm font-semibold text-[#0B1B33] hover:text-[#0A4DA3] transition-colors cursor-pointer bg-transparent border-0"
          >
            <ShoppingBag className="w-5 h-5 text-[#0A4DA3] stroke-[2]" />
            <span className="hidden sm:inline">Enquiry list</span>
            <span className="font-mono text-xs px-1.5 py-0.2 bg-[#0A4DA3] text-white rounded-full">
              {basketItems.length}
            </span>
          </button>

          {/* Red button: Find equipment */}
          <button
            type="button"
            onClick={() => {
              navigate('/products');
            }}
            className="hidden sm:flex h-[44px] px-5 bg-[#E3262E] hover:bg-[#C91E25] active:scale-[0.98] text-white font-display uppercase tracking-[0.02em] text-[13px] font-bold items-center justify-center rounded-[4px] transition-all cursor-pointer border-0"
          >
            FIND EQUIPMENT
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#0B1B33] cursor-pointer bg-transparent border-0"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6 stroke-[2]" /> : <Menu className="w-6 h-6 stroke-[2]" />}
          </button>
        </div>
      </div>

      {/* FULL-WIDTH MEGA MENU (Bold Industrial) */}
      {megaOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-testid="mega-menu-panel"
          className="fixed left-0 right-0 top-[112px] bg-white border-b border-[#D9E1EC] z-50 animate-in fade-in duration-150"
          style={{
            boxShadow: 'var(--overlay-shadow)',
            maxHeight: 'calc(100vh - 120px)'
          }}
        >
          <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 py-8 grid grid-cols-12 gap-8">
            {/* Left Column (Cols 1-7): Category List in 2 columns */}
            <div className="col-span-7 border-r border-[#D9E1EC] pr-8">
              <div className="flex items-center justify-between pb-3 border-b border-[#D9E1EC] mb-4">
                <span className="font-display uppercase text-xs tracking-wider text-[#071A33] font-bold">
                  All Categories ({categories.length})
                </span>
                <Link to="/products" className="text-xs font-mono text-[#0A4DA3] font-semibold hover:underline">
                  Browse complete catalog &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onMouseEnter={() => setHoveredCatIndex(idx)}
                    onClick={() => {
                      navigate(`/products/${cat.slug}`);
                      setMegaOpen(false);
                    }}
                    className={`w-full text-left py-2 px-3 rounded-[4px] transition-colors flex items-center justify-between cursor-pointer border-0 ${
                      hoveredCatIndex === idx
                        ? 'bg-[#0A4DA3] text-white'
                        : 'bg-transparent text-[#0B1B33] hover:bg-[#F2F5F9]'
                    }`}
                  >
                    <span className="font-display uppercase text-sm font-bold truncate">
                      {cat.name}
                    </span>
                    <span className={`font-mono text-xs ${hoveredCatIndex === idx ? 'text-white/80' : 'text-[#5A6B82]'}`}>
                      {cat.products?.length || 1} models
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column (Cols 8-12): 3 Featured Model Tiles on --brand panel */}
            <div className="col-span-5 flex flex-col justify-between">
              <div>
                <div className="pb-3 border-b border-[#D9E1EC] mb-4 flex items-center justify-between">
                  <span className="font-display uppercase text-xs tracking-wider text-[#071A33] font-bold">
                    Featured in {activeCategory?.name}
                  </span>
                  <Link
                    to={`/products/${activeCategory?.slug}`}
                    className="text-xs font-mono text-[#0A4DA3] font-semibold hover:underline"
                  >
                    View all &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {(activeCategory?.products?.slice(0, 3) || []).map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${activeCategory.slug}/${p.slug}`}
                      className="group bg-[#0A4DA3] text-white p-3 rounded-[4px] flex flex-col justify-between overflow-hidden relative no-underline hover:bg-[#062B5E] transition-colors"
                      style={{ height: '180px' }}
                    >
                      <div className="relative w-full h-[90px] flex items-center justify-center p-1">
                        <img
                          src={p.images?.[0] || '/images/product/scissor lift.jpg'}
                          alt={p.name}
                          className="max-w-[95%] max-h-[95%] object-contain"
                        />
                      </div>
                      <div className="mt-2">
                        <div className="font-display uppercase text-xs font-bold leading-tight truncate">
                          {p.name}
                        </div>
                        {p.code && (
                          <div className="font-mono text-[10px] text-white/70 truncate">
                            {p.code}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D9E1EC] flex items-center justify-between">
                <span className="text-xs font-body text-[#5A6B82]">
                  Custom engineering and site modification available
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMegaOpen(false);
                    openQuoteModal();
                  }}
                  className="text-xs font-display uppercase tracking-wider text-[#E3262E] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Custom quote &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[112px] bg-white z-50 p-6 overflow-y-auto space-y-4">
          <Link to="/" className="block font-display uppercase text-xl font-bold text-[#0B1B33] pb-2 border-b border-[#D9E1EC]">
            Home
          </Link>
          <Link to="/about" className="block font-display uppercase text-xl font-bold text-[#0B1B33] pb-2 border-b border-[#D9E1EC]">
            About
          </Link>
          <Link to="/products" className="block font-display uppercase text-xl font-bold text-[#0A4DA3] pb-2 border-b border-[#D9E1EC]">
            Products Catalog
          </Link>
          <Link to="/contact" className="block font-display uppercase text-xl font-bold text-[#0B1B33] pb-2 border-b border-[#D9E1EC]">
            Contact
          </Link>
          <div className="pt-4">
            <button
              onClick={() => {
                setMobileOpen(false);
                openQuoteModal();
              }}
              className="w-full h-[48px] bg-[#E3262E] text-white font-display uppercase tracking-wider font-bold rounded-[4px] border-0"
            >
              Request a quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
