import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { useApp } from '../context/AppContext';
import { useAppStore } from '../store/useAppStore';
import { getProductBySlug, getProducts } from '../services/api';
import { Product } from '../types';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/architectural/Button';
import { ProductFigure } from '../components/architectural/ProductFigure';
import { ArchitecturalImage } from '../components/architectural/ArchitecturalImage';
import { parseModelCodes } from '../utils/formatters';
import { toast } from 'sonner';
import {
  FileDown,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageSquare
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug, sub, category } = useParams<{ slug?: string; sub?: string; category?: string }>();
  const productSlug = slug || sub || category || '';
  const { openQuoteModal } = useApp();

  const addToBasket = useAppStore((state) => state.addToBasket);
  const basketItems = useAppStore((state) => state.basketItems);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Hover zoom lens state
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);

  // Fetch product using React Query
  const { data: product, isLoading: loading, isError: error } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => getProductBySlug(productSlug),
    enabled: !!productSlug,
    staleTime: 1000 * 60 * 5
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related', product?.category?.slug],
    queryFn: async () => {
      if (!product?.category?.slug) return [];
      const list = await getProducts({ category: product.category.slug });
      return list.filter((p) => p.id !== product.id).slice(0, 4);
    },
    enabled: !!product?.category?.slug
  });

  // Sticky condensed bar after scrolling past 380px
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-[#F6F4F0] min-h-[60vh] p-8 space-y-6 max-w-[1360px] mx-auto animate-pulse">
        <div className="h-6 w-48 bg-[#E8E4DD] animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 aspect-[4/3] bg-[#E8E4DD] animate-shimmer" />
          <div className="lg:col-span-7 space-y-4">
            <div className="h-10 w-3/4 bg-[#E8E4DD] animate-shimmer" />
            <div className="h-24 w-full bg-[#E8E4DD] animate-shimmer" />
            <div className="h-48 w-full bg-[#E8E4DD] animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center space-y-4 px-6 text-center">
        <h2 className="font-heading text-2xl font-semibold text-[#15191E]">Product Not Found</h2>
        <p className="font-body text-[#7C8794] text-[14px]">
          The requested equipment specification could not be located.
        </p>
        <Link to="/products">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/images/product/scissor lift.jpg'];
  const activeImage = images[activeImageIndex] || images[0];

  const specTable = product.specTables && product.specTables.length > 0 ? product.specTables[0] : null;
  const modelColumns = specTable ? specTable.columns.slice(1) : [];
  const modelCodes = parseModelCodes(product.code);
  const isInBasket = basketItems.some((i) => i.id === product.id);

  const whatsappMessage = encodeURIComponent(
    `Hello Lift and Reach Equipments, I would like to inquire about specifications for: ${product.name} (${product.code || 'Standard Model'}).`
  );

  return (
    <div className="w-full bg-[#F6F4F0] min-h-screen text-[#15191E] pb-24">
      <Helmet>
        <title>{`${product.name} | Lift and Reach Equipments`}</title>
        <meta name="description" content={product.shortDesc || product.description || ''} />
      </Helmet>

      {/* STICKY CONDENSED BAR: slides down under header after scrolling past title */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[76px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D5CFC5] px-6 sm:px-12 lg:px-20 py-2.5 flex items-center justify-between elevation-1"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activeImage}
                alt={product.name}
                className="w-10 h-8 object-contain bg-[#E8E4DD] p-1 shrink-0 mix-blend-multiply"
              />
              <div className="min-w-0">
                <h4 className="font-heading text-sm font-semibold text-[#15191E] truncate">
                  {product.name}
                </h4>
                {product.code && (
                  <span className="font-mono text-[11px] text-[#7C8794] block truncate">
                    {product.code}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openQuoteModal({ id: product.id, name: product.name, code: product.code })}
              >
                Request quote
              </Button>
              <button
                type="button"
                onClick={() => {
                  addToBasket({
                    id: product.id,
                    name: product.name,
                    code: product.code,
                    slug: product.slug,
                    image: product.images?.[0] || null,
                    categoryName: product.category?.name
                  });
                  toast.success(`Added ${product.name} to enquiry list`);
                }}
                className="p-2 border border-[#D5CFC5] hover:border-[#1F4E96] bg-white rounded-none cursor-pointer"
                title="Add to enquiry list"
              >
                <ShoppingBag className="w-4 h-4 text-[#1F4E96]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <section
        className="w-full border-b border-[#D5CFC5]"
        style={{ padding: '20px var(--pad-x) 16px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto flex items-center gap-2 font-body text-[13px] text-[#7C8794]">
          <Link to="/" className="hover:text-[#15191E] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#15191E] transition-colors">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/products/${product.category.slug}`} className="hover:text-[#15191E] transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-[#15191E] font-medium">{product.name}</span>
        </div>
      </section>

      {/* Main Two-Column Stage */}
      <section
        className="w-full border-b border-[#D5CFC5]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Sticky Stage + Gallery */}
          <div className="lg:col-span-5 lg:sticky lg:top-[90px] space-y-3">
            {/* Main Stage with Zoom Lens on Desktop */}
            <div
              onClick={() => setLightboxOpen(true)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoomPos({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100
                });
              }}
              onMouseLeave={() => setZoomPos(null)}
              className="relative aspect-[4/3] max-h-[420px] w-full bg-[#E8E4DD] border border-[#D5CFC5] rounded-none overflow-hidden flex items-center justify-center p-4 cursor-zoom-in group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <ArchitecturalImage
                    src={activeImage}
                    alt={product.name}
                    natWidth={360}
                    natHeight={300}
                    eager
                  />
                </motion.div>
              </AnimatePresence>

              {/* Hover Zoom preview indicator */}
              <div className="absolute bottom-3 right-3 bg-white/80 p-1.5 text-[#15191E] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-[64px] h-[64px] bg-[#E8E4DD] rounded-none p-1 flex items-center justify-center border cursor-pointer transition-all duration-200 shrink-0 ${
                      activeImageIndex === idx ? 'border-[#1F4E96] scale-105' : 'border-[#D5CFC5] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec Details & Tabs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[12px] font-mono text-[#7C8794] block">
                {product.category?.name}
              </span>

              <h1
                className="font-heading text-[#15191E] m-0 font-semibold leading-[1.15] tracking-[-0.01em]"
                style={{ fontSize: 'var(--fs-h1)' }}
              >
                {product.name}
              </h1>

              {modelCodes.length > 0 && (
                <div className="font-mono text-[12px] text-[#7C8794] space-y-0.5 pt-1">
                  {modelCodes.map((code, idx) => (
                    <div key={idx}>{code}</div>
                  ))}
                </div>
              )}
            </div>

            <p className="font-body text-[15px] text-[#3A424C] leading-[1.6] m-0">
              {product.description}
            </p>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={() =>
                  openQuoteModal({
                    id: product.id,
                    name: product.name,
                    code: product.code
                  })
                }
              >
                Request Quote
              </Button>

              <button
                type="button"
                onClick={() => {
                  addToBasket({
                    id: product.id,
                    name: product.name,
                    code: product.code,
                    slug: product.slug,
                    image: product.images?.[0] || null,
                    categoryName: product.category?.name
                  });
                  toast.success(`Added ${product.name} to enquiry list`);
                }}
                className="inline-flex items-center gap-2 text-[14px] font-medium text-[#15191E] hover:text-[#1F4E96] transition-colors py-2 px-3 border border-[#D5CFC5] bg-white cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5] text-[#1F4E96]" />
                <span>{isInBasket ? 'In enquiry list' : 'Add to enquiry'}</span>
              </button>

              <a
                href={`https://wa.me/918939359592?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-medium text-[#15191E] hover:text-[#1F4E96] transition-colors py-2 px-3 border border-[#D5CFC5] bg-white"
              >
                <MessageSquare className="w-4 h-4 stroke-[1.5] text-[#7C8794]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Radix Tabs for Models with sliding layoutId underline */}
            {specTable && (
              <div className="pt-4 border-t border-[#D5CFC5] space-y-3">
                <h3
                  className="font-heading text-[#15191E] m-0 font-semibold"
                  style={{ fontSize: 'var(--fs-h3)' }}
                >
                  Technical Specifications
                </h3>

                {modelColumns.length > 1 && (
                  <Tabs.Root
                    value={String(activeModelIndex)}
                    onValueChange={(val) => setActiveModelIndex(Number(val))}
                  >
                    <Tabs.List className="flex items-center gap-4 border-b border-[#D5CFC5] pb-1 overflow-x-auto text-[12px] font-mono relative">
                      <span className="text-[#7C8794] uppercase tracking-wider shrink-0">Model:</span>
                      {modelColumns.map((col, idx) => {
                        const isTabActive = activeModelIndex === idx;
                        return (
                          <Tabs.Trigger
                            key={idx}
                            value={String(idx)}
                            className={`pb-1 transition-colors cursor-pointer border-0 bg-transparent whitespace-nowrap relative ${
                              isTabActive ? 'text-[#1F4E96] font-semibold' : 'text-[#7C8794] hover:text-[#15191E]'
                            }`}
                          >
                            <span>{col}</span>
                            {isTabActive && (
                              <motion.div
                                layoutId="active-model-underline"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1F4E96]"
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </Tabs.Trigger>
                        );
                      })}
                    </Tabs.List>
                  </Tabs.Root>
                )}

                {/* Table with column highlighting on active model */}
                <div className="overflow-x-auto border border-[#D5CFC5] bg-white">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-[#E8E4DD] border-b border-[#D5CFC5] font-mono text-[11px] text-[#3A424C] uppercase tracking-[0.04em] h-[40px]">
                        <th className="py-2 px-3 font-semibold sticky left-0 bg-[#E8E4DD] z-10 w-1/3">
                          Parameter
                        </th>
                        {modelColumns.map((col, idx) => (
                          <th
                            key={idx}
                            className={`py-2 px-3 font-semibold transition-colors duration-300 ${
                              activeModelIndex === idx ? 'bg-[#E0DBD2] text-[#1F4E96]' : ''
                            }`}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5CFC5] font-body text-[#15191E]">
                      {specTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#F6F4F0] transition-colors h-[40px]">
                          <td className="py-2 px-3 font-medium text-[#15191E] sticky left-0 bg-white">
                            {row.label}
                          </td>
                          {row.values.map((val, vIdx) => (
                            <td
                              key={vIdx}
                              className={`py-2 px-3 tabular-nums transition-colors duration-300 ${
                                activeModelIndex === vIdx
                                  ? 'bg-[#1F4E96]/8 text-[#1F4E96] font-medium'
                                  : 'text-[#3A424C]'
                              }`}
                            >
                              {val || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Notes & Options */}
            {product.notes && product.notes.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[12px] font-mono text-[#7C8794] block">Options and Notes</span>
                <ul className="space-y-1 font-body text-[13px] text-[#3A424C] m-0 pl-4 list-disc">
                  {product.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plain text applications & industries */}
            <div className="space-y-3 pt-3 border-t border-[#D5CFC5]">
              {product.applications && product.applications.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[12px] font-mono text-[#7C8794] block">Applications</span>
                  <p className="font-body text-[13px] text-[#3A424C] leading-relaxed m-0">
                    {product.applications.join(', ')}.
                  </p>
                </div>
              )}
              {product.industries && product.industries.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[12px] font-mono text-[#7C8794] block">Target Industries</span>
                  <p className="font-body text-[13px] text-[#3A424C] leading-relaxed m-0">
                    {product.industries.join(', ')}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section
          className="w-full bg-[#E8E4DD] border-b border-[#D5CFC5]"
          style={{ padding: 'var(--section-y) var(--pad-x)' }}
        >
          <div className="w-full max-w-[1360px] mx-auto space-y-4">
            <h2
              className="font-heading text-[#15191E] m-0 font-semibold"
              style={{ fontSize: 'var(--fs-h2)' }}
            >
              Related Equipment
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductFigure
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  code={p.code}
                  slug={p.slug}
                  categorySlug={p.category?.slug}
                  parentCategorySlug={p.category?.parent?.slug}
                  image={p.images?.[0] || '/images/product/scissor lift.jpg'}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox with keyboard arrow navigation */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#15191E]/95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#D5CFC5] p-2 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-6 text-white hover:text-[#D5CFC5] p-3 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-6 text-white hover:text-[#D5CFC5] p-3 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <img
            src={activeImage}
            alt={product.name}
            className="max-w-[90vw] max-h-[85vh] object-contain bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
