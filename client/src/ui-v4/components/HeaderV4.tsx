import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAppStore } from '../../store/useAppStore';
import { HeaderToneCtx } from '../hooks/useHeaderTone';
import { Search, ShoppingBag, ArrowUpRight, Menu, X, ChevronRight, Phone, MessageSquare, ChevronDown } from 'lucide-react';
import { CutoutImage } from './CutoutImage';

interface HeaderV4Props {
  onOpenCommandPalette?: () => void;
  onOpenWizard?: () => void;
}

export const HeaderV4: React.FC<HeaderV4Props> = ({ onOpenCommandPalette, onOpenWizard }) => {
  const { categories, settings } = useApp();
  const location = useLocation();
  const { tone } = useContext(HeaderToneCtx);

  const phone1 = settings.phone_1 || '(+91) 89393 59592';
  const phone1Tel = phone1.replace(/[^0-9+]/g, '');
  const email = settings.email || 'liftnreach@gmail.com';
  const whatsappNum = (settings.whatsapp || '918939359592').replace(/[^0-9]/g, '');

  const basketItems = useAppStore((state) => state.basketItems);
  const setEnquiryDrawerOpen = useAppStore((state) => state.setEnquiryDrawerOpen);
  const setMobileMenuOpenStore = useAppStore((state) => state.setMobileMenuOpen);

  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSetMobileOpen = (open: boolean) => {
    setMobileOpen(open);
    setMobileMenuOpenStore(open);
  };
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [expandedCatId, setExpandedCatId] = useState<number | null>(null);
  const [hoveredCatIndex, setHoveredCatIndex] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<any>(null);

  // Total active products count: top-level products + child category products
  const totalModels = categories.reduce((sum, c) => {
    const own = c.products ? c.products.length : 0;
    const children = c.children ? c.children.reduce((acc, ch) => acc + (ch.products?.length || 0), 0) : 0;
    return sum + own + children;
  }, 0);

  // Set --sticky-top dynamically via ResizeObserver: flush with header height
  useEffect(() => {
    if (!headerRef.current) return;
    const updateHeaderH = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const height = Math.round(rect.height);
        document.documentElement.style.setProperty('--header-h', `${height}px`);
        document.documentElement.style.setProperty('--sticky-top', `${height}px`);
      }
    };

    updateHeaderH();
    const observer = new ResizeObserver(updateHeaderH);
    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [scrolled]);

  // C1: REMOVE hide-on-scroll. The header is always visible (floating glass pill after 40px).
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    handleSetMobileOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMegaOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 200);
  };

  const activeCategory = categories[hoveredCatIndex] || categories[0];

  // Visual header styling:
  // When over dark band and NOT scrolled: transparent background, crisp white links (contrast >= 4.5)
  // When scrolled or over light band: solid white/85 backdrop glass pill with #0B1220 text
  const isDarkOverBand = tone === 'dark' && !scrolled;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 w-full py-2 sm:py-2.5 ${
        isDarkOverBand
          ? 'bg-transparent text-white border-b border-transparent'
          : 'bg-white text-[#0B1220] border-b border-[#E3E8F0] shadow-sm'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <nav className="flex items-center justify-between w-full h-[52px] sm:h-[58px] md:h-[64px]">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group focus:outline-none shrink min-w-0 header__logo" aria-label="Hydrelex Lift Systems Home">
            <div className="flex items-center gap-2.5">
              <img
                src={isDarkOverBand ? '/images/logo-white-footer.png' : '/images/logo-wide.png'}
                alt="Hydrelex Lift Systems"
                className="h-6 sm:h-8 md:h-9 max-w-[170px] sm:max-w-none w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Links (1440px) */}
          <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-[#2A62C9] ${
                location.pathname === '/' ? (isDarkOverBand ? 'text-white font-semibold' : 'text-[#2A62C9] font-semibold') : isDarkOverBand ? 'text-white/90' : 'text-[#0B1220]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`transition-colors hover:text-[#2A62C9] ${
                location.pathname === '/about' ? (isDarkOverBand ? 'text-white font-semibold' : 'text-[#2A62C9] font-semibold') : isDarkOverBand ? 'text-white/90' : 'text-[#0B1220]'
              }`}
            >
              About
            </Link>

            {/* Products with Mega Menu trigger */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/products"
                className={`flex items-center gap-1.5 transition-colors hover:text-[#2A62C9] ${
                  location.pathname.startsWith('/products') ? (isDarkOverBand ? 'text-white font-semibold' : 'text-[#2A62C9] font-semibold') : isDarkOverBand ? 'text-white/90' : 'text-[#0B1220]'
                }`}
              >
                <span>Products</span>
                <span className="text-[12px] font-mono opacity-70">({totalModels})</span>
              </Link>
            </div>

            <Link
              to="/contact"
              className={`transition-colors hover:text-[#2A62C9] ${
                location.pathname === '/contact' ? (isDarkOverBand ? 'text-white font-semibold' : 'text-[#2A62C9] font-semibold') : isDarkOverBand ? 'text-white/90' : 'text-[#0B1220]'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger (Command Palette) */}
            <button
              onClick={onOpenCommandPalette}
              className={`p-2 rounded-full transition-colors ${
                isDarkOverBand ? 'text-white hover:bg-white/10' : 'text-[#0B1220] hover:bg-[#F3F5F8]'
              }`}
              title="Search products (Cmd+K)"
              aria-label="Search products"
            >
              <Search className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>

            {/* Enquiry List Drawer Trigger with Count Badge */}
            <button
              onClick={() => setEnquiryDrawerOpen(true)}
              className={`relative flex items-center gap-1.5 p-2 rounded-full transition-colors ${
                isDarkOverBand ? 'text-white hover:bg-white/10' : 'text-[#0B1220] hover:bg-[#F3F5F8]'
              }`}
              title="View Enquiry List"
              aria-label={`View enquiry list (${basketItems.length} items)`}
            >
              <ShoppingBag className="w-4 h-4 md:w-4.5 md:h-4.5" />
              <span className="hidden md:inline text-xs font-semibold">Enquiry list</span>
              {basketItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#E3262E] text-white text-[10px] font-bold flex items-center justify-center">
                  {basketItems.length}
                </span>
              )}
            </button>

            {/* Quote Action Pill */}
            <Link
              to="/contact"
              className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isDarkOverBand
                  ? 'bg-white text-[#06162E] hover:bg-white/90 shadow-sm'
                  : 'bg-[#2A62C9] text-white hover:bg-[#1E4FA8] shadow-sm'
              }`}
            >
              <span>Get a quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => handleSetMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isDarkOverBand ? 'text-white hover:bg-white/10' : 'text-[#0B1220] hover:bg-[#F3F5F8]'
              }`}
              aria-label={mobileOpen ? "Close mobile menu" : "Open mobile navigation menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Desktop Mega Menu Dropdown */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
            }}
            onMouseLeave={handleMouseLeave}
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[1200px] bg-white rounded-[28px] border border-[#E3E8F0] shadow-2xl p-6 z-50 pointer-events-auto"
          >
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column: Categories List */}
              <div className="col-span-4 border-r border-[#E3E8F0] pr-4 space-y-1">
                <div className="text-[12px] uppercase font-mono tracking-wider text-[#6B7685] px-3 py-1 font-semibold">
                  Product Categories
                </div>
                {categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredCatIndex(idx)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                      hoveredCatIndex === idx
                        ? 'bg-[#EBF1F9] text-[#2A62C9] font-medium'
                        : 'text-[#0B1220] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <Link
                      to={`/products/${cat.slug}`}
                      className="flex-1 text-[14px]"
                      onClick={() => setMegaOpen(false)}
                    >
                      {cat.name}
                    </Link>
                    <ChevronRight className="w-4 h-4 text-[#6B7685]" />
                  </div>
                ))}
              </div>

              {/* Right Column: Active Category Details & Products Preview */}
              <div className="col-span-8 pl-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-[#E3E8F0] pb-3 mb-4">
                    <div>
                      <h4 className="text-[18px] font-semibold text-[#0B1220]">
                        {activeCategory?.name}
                      </h4>
                      <p className="text-[13px] text-[#6B7685] line-clamp-1 mt-0.5">
                        {activeCategory?.description || 'Engineered industrial material handling equipment.'}
                      </p>
                    </div>
                    <Link
                      to={`/products/${activeCategory?.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="text-[13px] font-semibold text-[#2A62C9] hover:underline flex items-center gap-1"
                    >
                      View all category <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Sub-products Preview Bento Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {(activeCategory?.products || []).slice(0, 3).map((p) => (
                      <Link
                        key={p.id}
                        to={`/products/${activeCategory.slug}/${p.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="group bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E3E8F0] rounded-[20px] p-3 transition-all flex flex-col justify-between h-[190px]"
                      >
                        <div className="relative w-full h-[100px] flex items-center justify-center">
                          <CutoutImage
                            rawImage={p.images?.[0]}
                            alt={p.name}
                            className="max-w-[90%] max-h-[90%] object-contain"
                          />
                        </div>
                        <div className="mt-1">
                          <div className="text-[13px] font-semibold text-[#0B1220] leading-tight line-clamp-2">
                            {p.name}
                          </div>
                          {p.code && (
                            <div className="font-mono text-[11px] text-[#6B7685] truncate mt-0.5">
                              {p.code}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[var(--header-h,64px)] bg-black/50 z-[90] backdrop-blur-xs transition-opacity"
            onClick={() => handleSetMobileOpen(false)}
          />

          {/* Compact Dropdown Card */}
          <div
            className="lg:hidden fixed top-[var(--header-h,64px)] left-0 right-0 z-[100] bg-white text-[#0B1220] border-b border-[#E3E8F0] shadow-2xl rounded-b-2xl max-h-[calc(100dvh-76px)] overflow-y-auto px-5 py-4 pointer-events-auto"
          >
            {/* Navigation Links */}
            <div className="space-y-1 pb-3 border-b border-[#E3E8F0]">
              <Link
                to="/"
                onClick={() => handleSetMobileOpen(false)}
                className={`flex items-center justify-between py-2 px-3 rounded-xl text-[15px] font-medium transition-colors ${
                  location.pathname === '/' ? 'bg-[#EBF1F9] text-[#2A62C9] font-semibold' : 'text-[#0B1220] hover:bg-[#F8FAFC]'
                }`}
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>

              <Link
                to="/about"
                onClick={() => handleSetMobileOpen(false)}
                className={`flex items-center justify-between py-2 px-3 rounded-xl text-[15px] font-medium transition-colors ${
                  location.pathname === '/about' ? 'bg-[#EBF1F9] text-[#2A62C9] font-semibold' : 'text-[#0B1220] hover:bg-[#F8FAFC]'
                }`}
              >
                <span>About</span>
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              </Link>

              {/* Products with accordion */}
              <div>
                <button
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-[15px] font-medium transition-colors ${
                    location.pathname.startsWith('/products') ? 'bg-[#EBF1F9] text-[#2A62C9] font-semibold' : 'text-[#0B1220] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Products</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E2E8F0] text-[#334155]">
                      {totalModels}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileProductsOpen && (
                  <div className="pl-4 pr-1 mt-1 space-y-1 border-l-2 border-[#2A62C9]/30 ml-3">
                    <Link
                      to="/products"
                      onClick={() => handleSetMobileOpen(false)}
                      className="block py-1.5 px-2 text-[13px] font-semibold text-[#2A62C9] hover:underline"
                    >
                      All Equipment Catalog ({totalModels}) &rarr;
                    </Link>

                    {categories.map((cat) => (
                      <div key={cat.id} className="pt-0.5">
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/products/${cat.slug}`}
                            onClick={() => handleSetMobileOpen(false)}
                            className="text-[13px] font-medium text-[#334155] hover:text-[#2A62C9] py-1 px-2 block truncate"
                          >
                            {cat.name}
                          </Link>
                          {cat.products && cat.products.length > 0 && (
                            <button
                              onClick={() => setExpandedCatId(expandedCatId === cat.id ? null : cat.id)}
                              className="p-1 text-[#94A3B8] hover:text-[#0B1220]"
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedCatId === cat.id ? "rotate-180" : ""}`} />
                            </button>
                          )}
                        </div>

                        {expandedCatId === cat.id && cat.products && (
                          <div className="pl-3 mt-1 space-y-1 border-l border-[#E2E8F0]">
                            {cat.products.map((p) => (
                              <Link
                                key={p.id}
                                to={`/products/${cat.slug}/${p.slug}`}
                                onClick={() => handleSetMobileOpen(false)}
                                className="block text-[12px] text-[#64748B] hover:text-[#2A62C9] py-0.5 truncate"
                              >
                                {p.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <Link
              to="/contact"
              onClick={() => handleSetMobileOpen(false)}
              className={`flex items-center justify-between py-2 px-3 rounded-xl text-[15px] font-medium transition-colors ${
                location.pathname === '/contact' ? 'bg-[#EBF1F9] text-[#2A62C9] font-semibold' : 'text-[#0B1220] hover:bg-[#F8FAFC]'
              }`}
            >
              <span>Contact</span>
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
            </Link>
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="pt-3 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${phone1Tel}`}
                className="h-10 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0B1220] flex items-center justify-center gap-2 text-xs font-semibold border border-[#E2E8F0]"
              >
                <Phone className="w-3.5 h-3.5 text-[#2A62C9]" />
                <span>Call Us</span>
              </a>
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] flex items-center justify-center gap-2 text-xs font-semibold border border-[#25D366]/30"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>

            <Link
              to="/contact"
              onClick={() => handleSetMobileOpen(false)}
              className="w-full h-11 bg-[#2A62C9] hover:bg-[#1E4FA8] text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Get a quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </>
    )}
    </header>
  );
};
