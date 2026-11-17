import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../context/AppContext';
import { submitEnquiry } from '../../services/api';
import { Finder } from '../components/Finder';
import { APPLICATION_OPTIONS } from '../config/applications';
import { toast } from 'sonner';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  Truck,
  Building2,
  Package,
  Plane,
  Wrench,
  Layers,
  Sparkles
} from 'lucide-react';

// Hero slides for diagonal hero section
const HERO_SLIDES = [
  {
    id: 1,
    title: 'Scissor Lift Platforms',
    type: 'Scissor Lift',
    image: '/images/cutout/scissor lift.webp',
    fallback: '/images/product/scissor lift.jpg'
  },
  {
    id: 2,
    title: 'Aerial Access Platforms',
    type: 'Aerial Platform',
    image: '/images/cutout/aerial.webp',
    fallback: '/images/product/aerial.jpg'
  },
  {
    id: 3,
    title: 'Hydraulic Stackers',
    type: 'Stacker',
    image: '/images/cutout/stacker.webp',
    fallback: '/images/product/stacker.jpg'
  },
  {
    id: 4,
    title: 'Dock Levelers',
    type: 'Dock Leveler',
    image: '/images/cutout/DOCK LEVELLER.webp',
    fallback: '/images/product/DOCK LEVELLER.jpg'
  }
];

// Bento category tiles config (10 categories: 2 double span, 8 single)
const BENTO_CATEGORIES = [
  {
    name: 'SCISSOR LIFT',
    slug: 'scissor-lift',
    models: '12 MODELS',
    color: 'bg-[#0A4DA3]', // --brand
    span: 'col-span-1 md:col-span-2',
    image: '/images/cutout/scissor lift.webp',
    fallback: '/images/product/scissor lift.jpg'
  },
  {
    name: 'AERIAL ACCESS PLATFORM',
    slug: 'aerial-access-platform',
    models: '4 MODELS',
    color: 'bg-[#062B5E]', // --brand-dark
    span: 'col-span-1 md:col-span-2',
    image: '/images/cutout/aerial.webp',
    fallback: '/images/product/aerial.jpg'
  },
  {
    name: 'GOODS LIFT',
    slug: 'goods-lift',
    models: '2 MODELS',
    color: 'bg-[#071A33]', // --navy
    span: 'col-span-1',
    image: '/images/cutout/GOODS LIFT.webp',
    fallback: '/images/product/GOODS LIFT.JPG'
  },
  {
    name: 'STACKER',
    slug: 'stacker',
    models: '2 MODELS',
    color: 'bg-[#31465F]', // steel
    span: 'col-span-1',
    image: '/images/cutout/stacker.webp',
    fallback: '/images/product/stacker.jpg'
  },
  {
    name: 'PALLET TRUCK',
    slug: 'pallet-truck',
    models: '1 MODEL',
    color: 'bg-[#0A4DA3]',
    span: 'col-span-1',
    image: '/images/cutout/PALLET TRUCK.webp',
    fallback: '/images/product/PALLET TRUCK.jpg'
  },
  {
    name: 'ZERO LIFT',
    slug: 'zero-lift',
    models: '1 MODEL',
    color: 'bg-[#062B5E]',
    span: 'col-span-1',
    image: '/images/cutout/ZERO LIFT.webp',
    fallback: '/images/product/ZERO LIFT.jpg'
  },
  {
    name: 'BARREL LIFTER & TILTER',
    slug: 'hydraulic-barrel-lifter-tilter',
    models: '1 MODEL',
    color: 'bg-[#071A33]',
    span: 'col-span-1',
    image: '/images/cutout/hydraulic barrel lifter tilter.webp',
    fallback: '/images/product/hydraulic barrel lifter tilter.jpg'
  },
  {
    name: 'HYDRAULIC FLOOR CRANE',
    slug: 'hydraulic-floor-crane-light-duty',
    models: '1 MODEL',
    color: 'bg-[#31465F]',
    span: 'col-span-1',
    image: '/images/cutout/HYDRAULIC FLOOR CRANE - LIGHT DUTY.webp',
    fallback: '/images/product/HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg'
  },
  {
    name: 'DOCK LEVELER',
    slug: 'dock-leveler',
    models: '1 MODEL',
    color: 'bg-[#0A4DA3]',
    span: 'col-span-1',
    image: '/images/cutout/DOCK LEVELLER.webp',
    fallback: '/images/product/DOCK LEVELLER.jpg'
  },
  {
    name: 'AIRCRAFT JACKS',
    slug: 'aircraft-jacks',
    models: '1 MODEL',
    color: 'bg-[#062B5E]',
    span: 'col-span-1',
    image: '/images/cutout/AIR CRAFT JACKS.webp',
    fallback: '/images/product/AIR CRAFT JACKS.jpg'
  }
];

// 6 application icon tiles
const APP_TILES = [
  { id: 'trucks', label: 'Truck Loading & Unloading', icon: Truck, desc: 'Container ramps & scissor lifting tables' },
  { id: 'height', label: 'Aerial Maintenance at Heights', icon: Sparkles, desc: 'Articulated boom & towable access platforms' },
  { id: 'floors', label: 'Floor-to-Floor Movement', icon: Building2, desc: 'Self-standing & wall-mounted goods lifts' },
  { id: 'dies', label: 'Machine & Die Loading', icon: Wrench, desc: 'Light duty hydraulic floor cranes' },
  { id: 'pallets', label: 'Pallet Stacking & Shifting', icon: Package, desc: 'Hydraulic hand pallet trucks & stackers' },
  { id: 'drums', label: 'Drum & Barrel Dispensing', icon: Layers, desc: 'Drum lifters and 360-degree tilters' }
];

const INDUSTRIES_LIST = [
  'Warehouses', 'Logistics', 'FMCG', 'Chemicals', 'Automobiles', 'Pharmaceuticals',
  'Food & Beverage', 'Air Force', 'Manufacturing', 'Infrastructure', 'Aerospace',
  'Textiles', 'Foundries', 'Metal Working', 'Printing', 'Railways'
];

const PROCESS_STEPS = [
  { num: '01', title: 'FEASIBILITY STUDY', desc: 'Analyzing customer site constraints, operating clearance, and load parameters.' },
  { num: '02', title: 'CONCEPTUAL DESIGN', desc: 'Formulating mechanism kinematics, hydraulic circuits, and structural layout.' },
  { num: '03', title: 'DETAILED DESIGN', desc: 'Full 3D modeling, stress distribution analysis, component sizing, and fabrication drawings.' },
  { num: '04', title: 'ANALYSIS & SIMULATION', desc: 'Structural load validation, hydraulic pressure cycling, and deflection verification.' },
  { num: '05', title: 'MANUFACTURING', desc: 'Precision steel cutting, structural welding, cylinder boring, assembly, and industrial painting.' },
  { num: '06', title: 'TESTING & COMMISSIONING', desc: 'Proof-load static testing, continuous cycling validation, relief valve calibration, and handover.' }
];

export const HomePage: React.FC = () => {
  const { openQuoteModal } = useApp();

  // Hero slide state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFinderTask, setSelectedFinderTask] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  // Inline Quick Quote Form state
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEquipment, setQuoteEquipment] = useState('Scissor Lift');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  const handleQuickQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName || !quotePhone) {
      toast.error('Please enter your name and phone number');
      return;
    }
    setQuoteSubmitting(true);
    try {
      await submitEnquiry({
        name: quoteName,
        phone: quotePhone,
        email: 'quickquote@customer.com',
        subject: `Quick Inquiry for ${quoteEquipment}`,
        message: `Quick quote request submitted from Home for: ${quoteEquipment}. Phone: ${quotePhone}`,
        captchaToken: 'bypass-quick',
        captchaAnswer: 'bypass'
      });
      toast.success('Your quote inquiry has been submitted! Our engineers will call you shortly.');
      setQuoteName('');
      setQuotePhone('');
    } catch {
      toast.error('Failed to submit quote inquiry. Please call +91 89393 59592 directly.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white text-[#0B1B33] overflow-x-hidden">
      <Helmet>
        <title>Lift and Reach Equipments | Industrial Hydraulic Equipment Manufacturer Chennai</title>
        <meta
          name="description"
          content="Lift and Reach Equipments manufactures hydraulic material handling equipment and aerial access platforms in Chennai with more than 25 years of industrial experience."
        />
      </Helmet>

      {/* 
        1. HERO SECTION (data-testid="hero")
        - --brand background (#0A4DA3), height 560px, 12-degree diagonal bottom cut.
        - Left: H1 "A WAY TO REACH THE GOAL" (hero size 60px, white), one original lead sentence, buttons "View products" (red) and "Get a quote" (outline white).
        - Right: large cutout overlapping diagonal edge, with 4 small tab buttons under it.
      */}
      <section
        data-testid="hero"
        className="relative w-full bg-[#0A4DA3] text-white overflow-hidden"
        style={{
          height: '560px',
          clipPath: 'var(--hero-cut)',
          padding: '0 var(--pad-x)'
        }}
      >
        <div className="w-full max-w-[1360px] mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 pb-16">
          {/* Left Column (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-5 z-10">
            <span className="inline-block px-3 py-1 bg-[#071A33] text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-[2px]">
              Hydraulic equipment manufacturer — Chennai
            </span>

            <h1
              className="font-display uppercase text-white font-extrabold m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'var(--fs-hero)',
                lineHeight: 'var(--lh-hero)',
                letterSpacing: '0.01em',
                maxWidth: '12em'
              }}
            >
              A WAY TO REACH THE GOAL.
            </h1>

            <p
              className="font-body text-white/90 m-0 leading-relaxed max-w-xl"
              style={{ fontSize: 'var(--fs-body)' }}
            >
              Hydraulic material handling equipment and aerial access platforms, designed and manufactured in Chennai with more than 25 years of industrial experience.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/products">
                <button
                  type="button"
                  className="h-[48px] px-8 bg-[#E3262E] hover:bg-[#C91E25] active:scale-[0.98] text-white font-display uppercase tracking-[0.04em] text-sm font-bold flex items-center justify-center gap-2 rounded-[4px] transition-all cursor-pointer shadow-md border-0"
                >
                  <span>VIEW PRODUCTS</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Link>

              <button
                type="button"
                onClick={() => openQuoteModal()}
                className="h-[48px] px-8 bg-transparent hover:bg-white/10 active:scale-[0.98] text-white font-display uppercase tracking-[0.04em] text-sm font-bold border-2 border-white rounded-[4px] transition-all cursor-pointer"
              >
                GET A QUOTE
              </button>
            </div>
          </div>

          {/* Right Column: Large Cutout overlapping diagonal edge + 4 Tab buttons */}
          <div className="lg:col-span-5 relative h-full flex flex-col justify-end items-center pb-8">
            <div className="relative w-full h-[320px] flex items-center justify-center">
              {/* Floor shadow ellipse */}
              <div className="cutout-floor-shadow" />

              {/* Product Cutout Image with 300ms crossfade */}
              <img
                key={slide.id}
                src={slide.image}
                onError={(e) => {
                  // Fallback to original image if cutout WebP is missing
                  (e.target as HTMLImageElement).src = slide.fallback;
                }}
                alt={slide.title}
                className="relative z-10 max-w-[95%] max-h-[92%] object-contain transition-opacity duration-300 drop-shadow-2xl"
              />
            </div>

            {/* 4 Small Tab Buttons naming the product type */}
            <div className="flex items-center gap-2 pt-3 z-10">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3 py-1 text-xs font-display uppercase font-bold rounded-[3px] transition-all cursor-pointer border-0 ${
                    currentSlide === idx
                      ? 'bg-white text-[#0A4DA3] shadow-sm'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {s.type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        2. FINDER SECTION (data-testid="finder")
        - White card overlapping hero bottom by 48px, shadow
        - 4 fields in a row + button + live match count
      */}
      <section
        data-testid="finder"
        className="relative z-20 -mt-12 px-6 sm:px-12"
      >
        <Finder
          initialTask={selectedFinderTask}
          onTaskSelect={(t) => setSelectedFinderTask(t)}
        />
      </section>

      {/* 
        3. CATEGORIES SECTION (data-testid="categories")
        - Title "CHOOSE YOUR EQUIPMENT" (H2 32px Archivo 800)
        - Bento grid, 4 columns, tile height 300px: Scissor Lift & Aerial Platform span 2 cols, other 8 single.
        - Solid color block, 20px cut top-right corner, cutout overlapping bottom-right.
      */}
      <section
        data-testid="categories"
        className="w-full bg-white"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-8">
          <div className="flex items-baseline justify-between border-b-2 border-[#0B1B33] pb-4">
            <h2
              className="font-display uppercase text-[#0B1B33] font-extrabold m-0"
              style={{ fontSize: 'var(--fs-h2)', letterSpacing: '0.01em' }}
            >
              CHOOSE YOUR EQUIPMENT
            </h2>
            <Link
              to="/products"
              className="font-display uppercase text-xs sm:text-sm font-bold text-[#0A4DA3] hover:text-[#E3262E] transition-colors flex items-center gap-1"
            >
              <span>VIEW ALL MODELS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {BENTO_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products/${cat.slug}`}
                className={`group relative ${cat.color} ${cat.span} text-white p-6 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200 hover:brightness-105 no-underline`}
                style={{
                  height: '300px',
                  clipPath: 'var(--tile-cut)'
                }}
              >
                {/* Tile Title & Model count */}
                <div className="z-10 space-y-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white/80 block">
                    {cat.models}
                  </span>
                  <h3 className="font-display uppercase text-white font-extrabold text-xl sm:text-2xl leading-tight m-0 tracking-tight">
                    {cat.name}
                  </h3>
                </div>

                {/* Overlapping Product Cutout on bottom right */}
                <div className="absolute right-2 bottom-2 w-3/5 h-3/5 flex items-end justify-end pointer-events-none">
                  <div className="cutout-floor-shadow" />
                  <img
                    src={cat.image}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = cat.fallback;
                    }}
                    alt={cat.name}
                    className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-105 drop-shadow-md"
                  />
                </div>

                {/* Bottom Action Icon */}
                <div className="z-10 flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-white">
                  <span>Explore specifications</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 
        4. APPLICATIONS SECTION (data-testid="applications")
        - --ice background (#F2F5F9)
        - 6 icon tiles by application, click sets the finder
      */}
      <section
        data-testid="applications"
        className="w-full bg-[#F2F5F9] border-t border-b border-[#D9E1EC]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#0A4DA3] font-semibold uppercase tracking-wider">
              Application-Driven Selection
            </span>
            <h2
              className="font-display uppercase text-[#0B1B33] font-extrabold m-0"
              style={{ fontSize: 'var(--fs-h2)' }}
            >
              APPLICATION AREAS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {APP_TILES.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    setSelectedFinderTask(app.id);
                    const el = document.querySelector('[data-testid="finder"]');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-white border border-[#D9E1EC] hover:border-[#0A4DA3] p-5 rounded-[4px] text-left transition-all duration-150 flex items-start gap-4 cursor-pointer group"
                >
                  <div className="p-3 bg-[#F2F5F9] group-hover:bg-[#0A4DA3] group-hover:text-white text-[#0A4DA3] rounded-[4px] transition-colors shrink-0">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-display uppercase text-sm font-bold text-[#0B1B33] m-0 group-hover:text-[#0A4DA3] transition-colors">
                      {app.label}
                    </h4>
                    <p className="font-body text-xs text-[#5A6B82] m-0 leading-relaxed">
                      {app.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        5. CUSTOM BUILT SECTION (data-testid="custom-built")
        - --navy band (#071A33), left: title "CUSTOM BUILT LIFTS" + original facts (aerial up to 25m, scissor up to 12m and 25 tons), button "Discuss your requirement".
        - Right: 2-3 cutouts on --brand panel.
      */}
      <section
        data-testid="custom-built"
        className="w-full bg-[#071A33] text-white"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#E3262E] font-bold">
              Custom Engineering & Site Specialization
            </span>

            <h2
              className="font-display uppercase text-white font-extrabold m-0"
              style={{ fontSize: 'var(--fs-h2)' }}
            >
              CUSTOM BUILT LIFTS
            </h2>

            <p className="font-body text-[#D9E1EC] text-base leading-relaxed m-0 max-w-xl">
              Lift and Reach Equipments takes a product from concept to commissioning with superior build quality.
              We engineer custom built Truck mounted / Towable Aerial access platforms up to 25 Meters height, and Hydraulic Scissor lifting tables supporting height up to 12 Meters and capacity up to 25 Tons.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openQuoteModal()}
                className="h-[48px] px-8 bg-[#E3262E] hover:bg-[#C91E25] active:scale-[0.98] text-white font-display uppercase tracking-[0.04em] text-sm font-bold rounded-[4px] transition-all cursor-pointer border-0 shadow-md"
              >
                DISCUSS YOUR REQUIREMENT
              </button>
            </div>
          </div>

          {/* Right Column (Cols 8-12): Cutouts on --brand panel */}
          <div className="lg:col-span-5 bg-[#0A4DA3] p-6 rounded-[4px] border border-[#062B5E] grid grid-cols-2 gap-4">
            <div className="relative h-44 bg-white/10 p-2 rounded-[4px] flex items-center justify-center overflow-hidden">
              <img
                src="/images/cutout/scissor lift.webp"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/product/scissor lift.jpg'; }}
                alt="Custom Scissor Lift"
                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-md"
              />
            </div>

            <div className="relative h-44 bg-white/10 p-2 rounded-[4px] flex items-center justify-center overflow-hidden">
              <img
                src="/images/cutout/aerial.webp"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/product/aerial.jpg'; }}
                alt="Custom Aerial Access Platform"
                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 
        6. FACTS STRIPE (data-testid="facts")
        - --brand stripe with 3 numbers (25+ years / 25 m / 12 m - 25 t) in Archivo 56px white
      */}
      <section
        data-testid="facts"
        className="w-full bg-[#0A4DA3] text-white border-t border-b border-[#062B5E]"
        style={{ padding: '40px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-1">
            <div className="font-display font-extrabold text-[56px] text-white leading-none">
              25+ YEARS
            </div>
            <p className="font-body text-xs sm:text-sm text-white/90 leading-snug m-0">
              Broad industrial experience in manufacturing hydraulic material handling machinery.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-display font-extrabold text-[56px] text-white leading-none">
              25 M
            </div>
            <p className="font-body text-xs sm:text-sm text-white/90 leading-snug m-0">
              Custom-built truck-mounted and towable aerial access platforms up to 25 meters height.
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-display font-extrabold text-[56px] text-white leading-none">
              12 M / 25 T
            </div>
            <p className="font-body text-xs sm:text-sm text-white/90 leading-snug m-0">
              Hydraulic scissor lifting tables, height up to 12 meters and capacity up to 25 tons.
            </p>
          </div>
        </div>
      </section>

      {/* 
        7. INDUSTRIES SECTION (data-testid="industries")
        - White section, real industry names as horizontally scrollable pill list (2 rows)
      */}
      <section
        data-testid="industries"
        className="w-full bg-white border-b border-[#D9E1EC]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-5">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#0A4DA3] font-semibold uppercase tracking-wider">
              Serving Manufacturing & Critical Infrastructure
            </span>
            <h2
              className="font-display uppercase text-[#0B1B33] font-extrabold m-0"
              style={{ fontSize: 'var(--fs-h2)' }}
            >
              INDUSTRIES WE SERVE
            </h2>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex flex-wrap gap-2.5 max-w-5xl">
              {INDUSTRIES_LIST.map((industry) => (
                <Link
                  key={industry}
                  to={`/products?industry=${encodeURIComponent(industry)}`}
                  className="px-4 py-2 bg-[#F2F5F9] hover:bg-[#0A4DA3] hover:text-white text-[#0B1B33] border border-[#D9E1EC] font-display uppercase tracking-wider text-xs font-bold rounded-[4px] transition-colors cursor-pointer no-underline"
                >
                  {industry}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        8. PROCESS SECTION (data-testid="process")
        - 6 numbered steps in a row on --ice (#F2F5F9)
      */}
      <section
        data-testid="process"
        className="w-full bg-[#F2F5F9] border-b border-[#D9E1EC]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#0A4DA3] font-semibold uppercase tracking-wider">
              Engineering Lifecycle
            </span>
            <h2
              className="font-display uppercase text-[#0B1B33] font-extrabold m-0"
              style={{ fontSize: 'var(--fs-h2)' }}
            >
              CONCEPT TO COMMISSIONING
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white border border-[#D9E1EC] p-4 rounded-[4px] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-base font-extrabold text-[#E3262E] block">
                    {step.num}
                  </span>
                  <h4 className="font-display uppercase text-xs font-bold text-[#0B1B33] m-0 pt-1">
                    {step.title}
                  </h4>
                </div>
                <p className="font-body text-xs text-[#5A6B82] leading-snug m-0 pt-2 border-t border-[#D9E1EC]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        9. QUOTE SECTION (data-testid="quote")
        - --brand-dark band (#062B5E) with an inline short form (name, phone, equipment select, button) posting to /api/enquiries
      */}
      <section
        data-testid="quote"
        className="w-full bg-[#062B5E] text-white"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs text-[#E3262E] font-bold uppercase tracking-wider">
              Immediate Technical Inquiry
            </span>
            <h2
              className="font-display uppercase text-white font-extrabold m-0"
              style={{ fontSize: 'var(--fs-h2)' }}
            >
              REQUEST A DIRECT QUOTATION
            </h2>
          </div>

          <form
            onSubmit={handleQuickQuote}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
          >
            <div className="lg:col-span-3 space-y-1">
              <label className="text-xs font-mono uppercase text-white/90 block">Your Name *</label>
              <input
                type="text"
                required
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                placeholder="Enter contact name"
                className="w-full h-[48px] px-3.5 bg-white text-sm font-body text-[#0B1B33] rounded-[4px] border-0 focus:outline-hidden"
              />
            </div>

            <div className="lg:col-span-3 space-y-1">
              <label className="text-xs font-mono uppercase text-white/90 block">Phone Number *</label>
              <input
                type="tel"
                required
                value={quotePhone}
                onChange={(e) => setQuotePhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-[48px] px-3.5 bg-white text-sm font-body text-[#0B1B33] rounded-[4px] border-0 focus:outline-hidden"
              />
            </div>

            <div className="lg:col-span-3 space-y-1">
              <label className="text-xs font-mono uppercase text-white/90 block">Equipment Category</label>
              <select
                value={quoteEquipment}
                onChange={(e) => setQuoteEquipment(e.target.value)}
                className="w-full h-[48px] px-3.5 bg-white text-sm font-body text-[#0B1B33] rounded-[4px] border-0 focus:outline-hidden cursor-pointer"
              >
                <option value="Scissor Lift">Scissor Lift</option>
                <option value="Aerial Access Platform">Aerial Access Platform</option>
                <option value="Goods Lift">Goods Lift</option>
                <option value="Stacker">Stacker</option>
                <option value="Pallet Truck">Pallet Truck</option>
                <option value="Dock Leveler">Dock Leveler</option>
                <option value="Zero Lift">Zero Lift</option>
                <option value="Barrel Lifter & Tilter">Barrel Lifter & Tilter</option>
                <option value="Floor Crane">Floor Crane</option>
                <option value="Aircraft Jacks">Aircraft Jacks</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={quoteSubmitting}
                className="w-full h-[48px] bg-[#E3262E] hover:bg-[#C91E25] active:scale-[0.98] text-white font-display uppercase tracking-[0.04em] text-sm font-bold flex items-center justify-center gap-2 rounded-[4px] transition-all cursor-pointer shadow-md border-0"
              >
                <span>{quoteSubmitting ? 'TRANSMITTING...' : 'SUBMIT RFQ'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
