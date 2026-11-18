import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../context/AppContext';
import { getSiteContent } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { useHeaderTone } from '../hooks/useHeaderTone';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Navigation } from 'swiper/modules';
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  Truck,
  Building2,
  Package,
  Wrench,
  Layers,
  Sparkles,
  Phone,
  MessageCircle,
  Sliders,
  Scale
} from 'lucide-react';
import { CutoutImage } from '../components/CutoutImage';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

interface HomeV4Props {
  onOpenWizard?: () => void;
}

// 3 Hero Product Slides (Desktop/Tablet)
const HERO_PRODUCT_SLIDES = [
  {
    id: 1,
    products: [
      { name: 'Aerial Platform', image: '/images/product/aerial.jpg', slug: 'aerial-access-platform' },
      { name: 'Aircraft Jack', image: '/images/product/AIR CRAFT JACKS.jpg', slug: 'air-craft-jacks' },
      { name: 'Floor Crane', image: '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg', slug: 'hydraulic-floor-crane-light-duty' },
      { name: 'Pallet Truck', image: '/images/product/PALLET TRUCK 1.jpg', slug: 'pallet-truck' },
      { name: 'Scissor Lift Table', image: '/images/product/scissor lift.jpg', slug: 'scissor-lift' }
    ]
  },
  {
    id: 2,
    products: [
      { name: 'Goods Lift', image: '/images/product/GOODS LIFT.jpg', slug: 'goods-lift' },
      { name: 'Hydraulic Stacker', image: '/images/product/stacker.jpg', slug: 'stacker' },
      { name: 'Zero Lift', image: '/images/product/ZERO LIFT.jpg', slug: 'zero-lift' },
      { name: 'Electric Scissor Lift', image: '/images/product/electric scissor lift.jpg', slug: 'scissor-lift' },
      { name: 'Barrel Lifter & Tilter', image: '/images/product/hydraulic barrel lifter tilter.jpg', slug: 'hydraulic-barrel-lifter-tilter' }
    ]
  },
  {
    id: 3,
    products: [
      { name: 'Dock Leveller', image: '/images/product/DOCK LEVELLER.jpg', slug: 'dock-leveller' },
      { name: 'Truck Mounted Platform', image: '/images/product/aerial truck mounted.jpg', slug: 'aerial-access-platform' },
      { name: 'Traction Scissor Lift', image: '/images/product/scissor lift TRACTION.jpg', slug: 'scissor-lift' },
      { name: 'Wall Mounted Lift', image: '/images/product/GOODS LIFT wall mounted.jpg', slug: 'goods-lift' },
      { name: 'Aircraft Jack Type 2', image: '/images/product/AIR CRAFT JACKS 2.jpg', slug: 'air-craft-jacks' }
    ]
  }
];

// Clean products for mobile hero carousel (< 768px)
const MOBILE_HERO_PRODUCTS = [
  { name: 'Aerial Access Platform', image: '/images/product/aerial.jpg', slug: 'aerial-access-platform' },
  { name: 'Aircraft Jack', image: '/images/product/AIR CRAFT JACKS.jpg', slug: 'air-craft-jacks' },
  { name: 'Hydraulic Floor Crane', image: '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg', slug: 'hydraulic-floor-crane-light-duty' },
  { name: 'Hydraulic Pallet Truck', image: '/images/product/PALLET TRUCK 1.jpg', slug: 'pallet-truck' },
  { name: 'Scissor Lift Table', image: '/images/product/scissor lift.jpg', slug: 'scissor-lift' },
  { name: 'Goods Lift', image: '/images/product/GOODS LIFT.jpg', slug: 'goods-lift' },
  { name: 'Hydraulic Stacker', image: '/images/product/stacker.jpg', slug: 'stacker' },
  { name: 'Zero Lift', image: '/images/product/ZERO LIFT.jpg', slug: 'zero-lift' }
];

// Curated Category Cards for Swiper Coverflow per Part D
const COVERFLOW_CATEGORIES = [
  {
    name: 'Scissor Lift',
    slug: 'scissor-lift',
    desc: 'Loading & Unloading of heavy loads from Truck containers. Material Shifting from Ground floor to first & Second floor.',
    models: '12 Models',
    tags: ['Hydraulic', 'Self Propelled'],
    image: '/images/product/scissor lift.jpg',
    gradient: 'linear-gradient(180deg, #1A3E7A 0%, #0E1A33 100%)'
  },
  {
    name: 'Aerial Access Platform',
    slug: 'aerial-access-platform',
    desc: 'High travel man lifting for height access and maintenance in inaccessible areas.',
    models: '4 Models',
    tags: ['Truck Mounted', 'Towable'],
    image: '/images/product/aerial.jpg',
    gradient: 'linear-gradient(180deg, #153664 0%, #0E1A33 100%)'
  },
  {
    name: 'Goods Lift',
    slug: 'goods-lift',
    desc: 'Widely used to transfer material from one floor to another in logistics and factories.',
    models: '3 Models',
    tags: ['Standalone', 'Wall Mounted'],
    image: '/images/product/GOODS LIFT.jpg',
    gradient: 'linear-gradient(180deg, #1C447E 0%, #0B162C 100%)'
  },
  {
    name: 'Stacker',
    slug: 'stacker',
    desc: 'Hydraulic pallet lifting, truck loading, and high-travel racking automation.',
    models: '2 Models',
    tags: ['Manual', 'Semi-Electric'],
    image: '/images/product/stacker.jpg',
    gradient: 'linear-gradient(180deg, #204C8C 0%, #0E1A33 100%)'
  },
  {
    name: 'Pallet Truck',
    slug: 'pallet-truck',
    desc: 'Assembly line material rotation and moving material across warehouse floors.',
    models: '1 Model',
    tags: ['Manual'],
    image: '/images/product/PALLET TRUCK 1.jpg',
    gradient: 'linear-gradient(180deg, #193E77 0%, #0D1930 100%)'
  },
  {
    name: 'Zero Lift',
    slug: 'zero-lift',
    desc: 'Used for lifting heavy loads from ground level to required heights without floor pit.',
    models: '1 Model',
    tags: ['Customized'],
    image: '/images/product/ZERO LIFT.jpg',
    gradient: 'linear-gradient(180deg, #183868 0%, #0B1629 100%)'
  },
  {
    name: 'Hydraulic Barrel Lifter & Tilter',
    slug: 'hydraulic-barrel-lifter-tilter',
    desc: 'Handling, lifting, weighing, transporting and dispensing of drums and barrels.',
    models: '1 Model',
    tags: ['Standard'],
    image: '/images/product/hydraulic barrel lifter tilter.jpg',
    gradient: 'linear-gradient(180deg, #1E4680 0%, #0D1A33 100%)'
  },
  {
    name: 'Hydraulic Floor Crane',
    slug: 'hydraulic-floor-crane-light-duty',
    desc: 'Dismantle and assemble engines and load or replace heavy machine dies.',
    models: '1 Model',
    tags: ['Light Duty'],
    image: '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg',
    gradient: 'linear-gradient(180deg, #163666 0%, #0A1426 100%)'
  },
  {
    name: 'Dock Leveller',
    slug: 'dock-leveller',
    desc: 'Bridges gap between loading dock and vehicle for smooth material transfer.',
    models: '2 Models',
    tags: ['Heavy Duty'],
    image: '/images/product/DOCK LEVELLER.jpg',
    gradient: 'linear-gradient(180deg, #1A407A 0%, #0B172E 100%)'
  },
  {
    name: 'Aircraft Jacks',
    slug: 'aircraft-jacks',
    desc: 'Aviation tripod ground support maintenance, tire and landing gear service.',
    models: '1 Model',
    tags: ['Tripod', 'Axle'],
    image: '/images/product/AIR CRAFT JACKS.jpg',
    gradient: 'linear-gradient(180deg, #14325C 0%, #091221 100%)'
  }
];

const INDUSTRIES_LIST = [
  'Warehouses', 'Logistics', 'FMCG', 'Chemicals', 'Automobiles', 'Pharmaceuticals',
  'Food & Beverage', 'Air Force', 'Manufacturing', 'Infrastructure', 'Aerospace',
  'Textiles', 'Foundries', 'Metal Working', 'Printing', 'Railways'
];

const PROCESS_STEPS = [
  { num: '01', title: 'Feasibility Study', desc: 'Analyzing customer site constraints, operating clearance, and load parameters.' },
  { num: '02', title: 'Conceptual Design', desc: 'Formulating mechanism kinematics, hydraulic circuits, and structural layout.' },
  { num: '03', title: 'Detailed Design', desc: 'Full 3D modeling, stress distribution analysis, component sizing, and fabrication drawings.' },
  { num: '04', title: 'Analysis & Simulation', desc: 'Structural load validation, hydraulic pressure cycling, and deflection verification.' },
  { num: '05', title: 'Manufacturing', desc: 'Steel cutting, structural welding, cylinder boring, assembly, and industrial painting.' },
  { num: '06', title: 'Testing & Commissioning', desc: 'Proof-load static testing, continuous cycling validation, relief valve calibration, and handover.' }
];

export const HomeV4: React.FC<HomeV4Props> = ({ onOpenWizard }) => {
  useHeaderTone('dark');

  const { categories, settings, openQuoteModal } = useApp();
  const [bentoToggle, setBentoToggle] = useState<'custom' | 'standard'>('custom');
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveredHero, setIsHoveredHero] = useState(false);
  const [mobileHeroIndex, setMobileHeroIndex] = useState(0);

  // Auto-advance desktop hero every 6s
  useEffect(() => {
    if (isHoveredHero) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_PRODUCT_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHoveredHero]);

  // Mobile carousel auto-advance every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setMobileHeroIndex((prev) => (prev + 1) % MOBILE_HERO_PRODUCTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const whatsappNum = (settings.whatsapp || '918939359592').replace(/[^0-9]/g, '');

  return (
    <div className="w-full bg-[#F3F5F8] text-[#0B1220] selection:bg-[#2A62C9]/20 selection:text-[#0B1220]">
      <Helmet>
        <title>Hydrelex Lift Systems | Hydraulic Lifting Solutions Chennai</title>
        <meta
          name="description"
          content="Manufacturers of custom and standard hydraulic lifting tables, scissor lifts, aerial access platforms, goods lifts, and material handling systems in Chennai."
        />
      </Helmet>

      {/* -------------------------------------------------------------
          PART A - HERO WITH THE OFFICIAL BANNERS
      ------------------------------------------------------------- */}
      <section
        data-header-tone="dark"
        onMouseEnter={() => setIsHoveredHero(true)}
        onMouseLeave={() => setIsHoveredHero(false)}
        className="relative w-full overflow-hidden text-white flex flex-col justify-between"
        style={{
          minHeight: 'min(100dvh, 920px)',
          background: 'linear-gradient(180deg, #06162E 0%, #0F3270 55%, #2A62C9 100%)'
        }}
      >
        {/* Stage Glow: radial-gradient(ellipse 60% 50% at 50% 88%, rgba(160,200,255,.55), transparent 70%) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 88%, rgba(160, 200, 255, 0.55), transparent 70%)'
          }}
        />

        {/* 4% Grid Line Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* 1) .hero__copy */}
        <div className="hero__copy relative z-10 max-w-4xl mx-auto text-center px-4 pt-[calc(var(--header-h,72px)+16px)]">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[12px] font-semibold tracking-wider uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6FA0E8] animate-pulse" />
            <span>25+ years of industrial experience</span>
          </div>

          {/* H1 */}
          <h1 className="v4-mixed-heading text-[32px] sm:text-[44px] md:text-[54px] lg:text-[58px] font-medium leading-[1.04] tracking-[-0.03em] text-white">
            A way to <em className="accent">reach the goal.</em>
            <span className="block text-[22px] sm:text-[30px] md:text-[38px] font-normal text-white/90 mt-0.5">
              Hydraulic equipment, Chennai.
            </span>
          </h1>

          {/* Paragraph */}
          <p className="mt-2 text-[14px] sm:text-[15px] text-white/80 max-w-[540px] mx-auto leading-relaxed">
            Hydraulic material handling equipment and aerial access platforms, designed and manufactured in Chennai with more than 25 years of industrial experience.
          </p>

          {/* Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={onOpenWizard}
              className="w-full sm:w-auto h-[44px] px-7 rounded-full bg-white text-[#0B1220] text-sm font-semibold hover:bg-white/95 transition-all shadow-md active:scale-95"
            >
              Find my lift
            </button>
            <button
              onClick={() => openQuoteModal()}
              className="w-full sm:w-auto h-[44px] px-7 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-all active:scale-95"
            >
              Get a quote
            </button>
          </div>
        </div>

        {/* 2) .hero__stage (Desktop / Tablet >= 768px) */}
        <div className="hero__stage hidden md:flex relative z-10 w-full flex-col items-center justify-end mt-4 pb-[56px]">
          {/* Floor Shadow */}
          <div
            className="hero__floor absolute left-1/2 bottom-[48px] w-[75%] h-[36px] -translate-x-1/2 pointer-events-none"
            style={{ background: 'radial-gradient(closest-side, rgba(0,0,0,.35), transparent)' }}
          />

          {/* 3 Slides: Crossfade 500ms */}
          <div className="relative w-full flex items-center justify-center px-4" style={{ minHeight: '230px' }}>
            {HERO_PRODUCT_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                  currentSlide === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-center gap-3 lg:gap-4 xl:gap-5 w-full max-w-6xl mx-auto py-2">
                  {slide.products.map((item, pIdx) => (
                    <Link
                      key={pIdx}
                      to={`/products/${item.slug}`}
                      className="group flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/40 shadow-[0_12px_28px_rgba(0,0,0,0.28)] hover:-translate-y-1.5 transition-all duration-300 w-[130px] md:w-[155px] lg:w-[185px] shrink-0"
                    >
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-b from-white to-[#EBF1F8] p-2 flex items-center justify-center overflow-hidden border border-white/30">
                        <img
                          src={item.image}
                          alt={item.name}
                          width="180"
                          height="180"
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          style={{ imageRendering: 'auto' }}
                          loading="lazy"
                        />
                      </div>
                      <span className="mt-2 text-[11px] lg:text-[12px] font-semibold text-[#0B1220] text-center line-clamp-1 w-full tracking-tight">
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress dots under the strip */}
          <div className="flex items-center gap-2 mt-4 z-20">
            {HERO_PRODUCT_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 2b) Mobile Hero Carousel (< 768px) per Part A4 */}
        <div className="md:hidden relative z-10 w-full mt-6 pb-6 px-4">
          <div className="w-full flex items-center justify-center overflow-hidden" style={{ touchAction: 'pan-y' }}>
            <Link
              to={`/products/${MOBILE_HERO_PRODUCTS[mobileHeroIndex].slug}`}
              className="w-[72vw] max-w-[280px] p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl bg-gradient-to-b from-white to-[#EBF1F8] p-3 flex items-center justify-center overflow-hidden border border-white/30">
                <img
                  src={MOBILE_HERO_PRODUCTS[mobileHeroIndex].image}
                  alt={MOBILE_HERO_PRODUCTS[mobileHeroIndex].name}
                  width="240"
                  height="240"
                  className="w-full h-full object-contain mix-blend-multiply"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
              <span className="mt-2.5 text-[13px] font-semibold text-[#0B1220] text-center">
                {MOBILE_HERO_PRODUCTS[mobileHeroIndex].name}
              </span>
            </Link>
          </div>

          {/* Dots below */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {MOBILE_HERO_PRODUCTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setMobileHeroIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  mobileHeroIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
                aria-label={`Product slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4) Facts Bar: Glass bar straddling bottom edge (half inside 28px) */}
        <div className="hidden md:block relative z-20 w-full">
          <div
            className="mx-auto rounded-[24px] p-4 text-white shadow-xl backdrop-blur-xl border border-white/25 flex items-center justify-between"
            style={{
              width: 'min(920px, 92vw)',
              background: 'rgba(255, 255, 255, 0.14)',
              transform: 'translateY(28px)'
            }}
          >
            <div className="flex-1 text-center border-r border-white/15 px-3">
              <div className="text-xl lg:text-2xl font-bold tracking-tight">25+ years</div>
              <div className="text-xs text-white/80 mt-0.5">industrial experience</div>
            </div>
            <div className="flex-1 text-center border-r border-white/15 px-3">
              <div className="text-xl lg:text-2xl font-bold tracking-tight">Up to 25 m</div>
              <div className="text-xs text-white/80 mt-0.5">aerial access platform height</div>
            </div>
            <div className="flex-1 text-center px-3">
              <div className="text-xl lg:text-2xl font-bold tracking-tight">Up to 12 m / 25 t</div>
              <div className="text-xs text-white/80 mt-0.5">scissor lift table height / capacity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Facts Bar (below carousel, not overlapping) */}
      <div className="md:hidden bg-[#0F3270] text-white py-4 px-4 border-t border-white/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[15px] font-bold">25+ yrs</div>
            <div className="text-[12px] text-white/80">experience</div>
          </div>
          <div className="border-x border-white/15 px-1">
            <div className="text-[15px] font-bold">Up to 25m</div>
            <div className="text-[12px] text-white/80">aerial platform</div>
          </div>
          <div>
            <div className="text-[15px] font-bold">12m / 25t</div>
            <div className="text-[12px] text-white/80">scissor lift</div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          PART D - HOME CAROUSEL (Full Bleed Swiper Coverflow)
      ------------------------------------------------------------- */}
      <section
        id="equipment-categories"
        className="relative z-10 w-full overflow-x-clip pt-16 pb-16 bg-[#F3F5F8] -mt-[28px] rounded-t-[40px]"
      >
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center pt-2">
          <div className="v4-pill-label mb-2 uppercase text-xs font-semibold text-[#2A62C9]">PRODUCTS</div>
          <h2 className="v4-mixed-heading text-[28px] sm:text-[40px] md:text-[48px] font-medium tracking-[-0.03em] leading-[1.1] text-[#0B1220]">
            Explore Our <em className="accent">Equipment Categories</em>
          </h2>
        </div>

        {/* Full-bleed 100vw Swiper with side mask fades */}
        <div
          className="w-full relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 96px, black calc(100% - 96px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 96px, black calc(100% - 96px), transparent)'
          }}
        >
          <Swiper
            modules={[EffectCoverflow, Autoplay, Navigation]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={true}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            coverflowEffect={{
              rotate: 0,
              stretch: -20,
              depth: 130,
              modifier: 1.1,
              slideShadows: false
            }}
            navigation={{
              nextEl: '.v4-swiper-next',
              prevEl: '.v4-swiper-prev'
            }}
            className="w-full !py-4"
            style={{ touchAction: 'pan-y' }}
          >
            {COVERFLOW_CATEGORIES.map((item, idx) => (
              <SwiperSlide
                key={idx}
                className="cat-card !w-[280px] sm:!w-[330px] md:!w-[360px] h-[510px] rounded-[28px] overflow-hidden shadow-xl transition-all duration-300 relative select-none flex flex-col justify-between p-6"
                style={{ background: item.gradient }}
              >
                {/* Badges on top (z-20) */}
                <div className="cat-card__chips flex items-center justify-between w-full relative z-20">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-white/90 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
                    {item.models}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[12px] font-medium text-white/80 px-2.5 py-0.5 rounded-full bg-black/25"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inner rounded container with high-res product image */}
                <div className="w-full h-[200px] my-3 rounded-[20px] bg-gradient-to-b from-white to-[#EBF1F8] p-3 flex items-center justify-center relative overflow-hidden shadow-inner border border-white/20 z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    width="320"
                    height="200"
                    loading="lazy"
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    style={{ imageRendering: 'auto' }}
                  />
                </div>

                <div className="cat-card__info relative z-10 w-full p-4 rounded-[20px] v4-glass-panel text-white">
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-tight text-white leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[12px] text-white/75 mt-0.5 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    to={`/products/${item.slug}`}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-white text-[#0E1A33] text-[13px] font-semibold hover:bg-white/90 transition-colors shadow-sm"
                  >
                    <span>Explore Models</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="max-w-md mx-auto px-4 flex items-center justify-between mt-8">
          <button
            className="v4-swiper-prev w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0B1220]/20 flex items-center justify-center text-[#0B1220] hover:bg-[#0B1220] hover:text-white transition-all active:scale-95 shadow-sm shrink-0"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-semibold text-[#0B1220] hover:text-[#2A62C9] transition-colors"
          >
            <span>View All Products</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <button
            className="v4-swiper-next w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#0B1220]/20 flex items-center justify-center text-[#0B1220] hover:bg-[#0B1220] hover:text-white transition-all active:scale-95 shadow-sm shrink-0"
            aria-label="Next slide"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* -------------------------------------------------------------
          BENTO GRID: High-End Interactive Experience
      ------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="v4-pill-label mb-3">ABOUT LIFT AND REACH</div>
          <h2 className="v4-mixed-heading text-[28px] sm:text-[40px] md:text-[48px] font-medium tracking-[-0.03em] leading-[1.1] text-[#0B1220]">
            Engineered for <em className="accent">Heavy Lifting</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Custom Capabilities */}
          <div className="bg-[#0B1220] rounded-[28px] p-6 text-white flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6FA0E8]">Precision</span>
                <span className="w-2 h-2 rounded-full bg-[#6FA0E8]" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight mb-3">
                Custom Built Solutions
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Specialized lifting tables and access platforms custom designed to match your factory height, pit conditions, and tonnage.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#6FA0E8] transition-colors"
              >
                <span>Consult an engineer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: 25+ Years Experience */}
          <div className="bg-white rounded-[28px] p-6 border border-[#E3E8F0] shadow-sm flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Heritage</span>
                <span className="w-2 h-2 rounded-full bg-[#2A62C9]" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-[#0B1220] mb-3">
                Over 25 Years in Chennai
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Supplying robust hydraulic systems to automotive, warehouse, defense, and manufacturing industries across India.
              </p>
            </div>
            <div className="pt-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2A62C9] hover:underline"
              >
                <span>Learn our story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Stats 2x2 */}
          <div className="bg-white rounded-[28px] p-6 border border-[#E3E8F0] shadow-sm flex flex-col justify-between min-h-[320px]">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col justify-center p-3 rounded-2xl bg-[#F8FAFC]">
                <div className="text-3xl font-bold text-[#0B1220]">25+</div>
                <div className="text-xs text-[#6B7280] mt-1">Years experience</div>
              </div>
              <div className="flex flex-col justify-center p-3 rounded-2xl bg-[#F8FAFC]">
                <div className="text-3xl font-bold text-[#2A62C9]">25 t</div>
                <div className="text-xs text-[#6B7280] mt-1">Max capacity</div>
              </div>
              <div className="flex flex-col justify-center p-3 rounded-2xl bg-[#F8FAFC]">
                <div className="text-3xl font-bold text-[#2A62C9]">25 m</div>
                <div className="text-xs text-[#6B7280] mt-1">Max reach height</div>
              </div>
              <div className="flex flex-col justify-center p-3 rounded-2xl bg-[#F8FAFC]">
                <div className="text-3xl font-bold text-[#0B1220]">100%</div>
                <div className="text-xs text-[#6B7280] mt-1">Tested & certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          INDUSTRIES & PROCESS
      ------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E3E8F0]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="v4-pill-label mb-3">VERSATILITY</div>
          <h2 className="v4-mixed-heading text-[28px] sm:text-[40px] font-medium tracking-[-0.03em] leading-[1.1] text-[#0B1220]">
            Industries We <em className="accent">Serve</em>
          </h2>
        </div>

        {/* Industries chips wrap */}
        <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
          {(showAllIndustries ? INDUSTRIES_LIST : INDUSTRIES_LIST.slice(0, 10)).map((ind, idx) => (
            <span
              key={idx}
              className="px-4 py-2 rounded-full bg-white border border-[#E3E8F0] text-sm font-medium text-[#374151] shadow-xs"
            >
              {ind}
            </span>
          ))}
          {!showAllIndustries && (
            <button
              onClick={() => setShowAllIndustries(true)}
              className="px-4 py-2 rounded-full bg-[#EBF1F9] text-[#2A62C9] text-sm font-semibold hover:bg-[#DFEAF7] transition-colors"
            >
              Show all ({INDUSTRIES_LIST.length})
            </button>
          )}
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E3E8F0]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="v4-pill-label mb-3">METHODOLOGY</div>
          <h2 className="v4-mixed-heading text-[28px] sm:text-[40px] font-medium tracking-[-0.03em] leading-[1.1] text-[#0B1220]">
            Our Engineering <em className="accent">Process</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCESS_STEPS.map((step, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-[#E3E8F0] shadow-sm">
              <div className="text-sm font-mono font-bold text-[#2A62C9] mb-2">{step.num}</div>
              <h3 className="text-lg font-semibold text-[#0B1220] mb-2">{step.title}</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
