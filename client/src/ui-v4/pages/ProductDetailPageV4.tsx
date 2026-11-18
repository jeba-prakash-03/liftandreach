import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../context/AppContext';
import { useAppStore } from '../../store/useAppStore';
import { getProductBySlug, getProducts } from '../../services/api';
import { Product } from '../../types';
import { parseModelCodes } from '../../utils/formatters';
import { PageBand } from '../components/PageBand';
import { ProductCard } from '../components/ProductCard';
import { CutoutImage } from '../components/CutoutImage';
import { toast } from 'sonner';
import {
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Phone,
  MessageCircle
} from 'lucide-react';

export const ProductDetailPageV4: React.FC = () => {
  const params = useParams<{ slug?: string; sub?: string; category?: string }>();
  const productSlug = params.slug || params.sub || params.category || '';
  const { openQuoteModal, settings } = useApp();

  const phone1 = settings.phone_1 || '(+91) 89393 59592';
  const phone1Tel = phone1.replace(/[^0-9+]/g, '');
  const whatsappNum = (settings.whatsapp || '918939359592').replace(/[^0-9]/g, '');

  const addToBasket = useAppStore((state) => state.addToBasket);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  // Fetch product using React Query
  const { data: product, isLoading: loading, isError: error } = useQuery<Product>({
    queryKey: ['product', productSlug],
    queryFn: () => getProductBySlug(productSlug),
    enabled: !!productSlug,
    staleTime: 1000 * 60 * 5
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ['related', product?.category?.slug],
    queryFn: async () => {
      if (!product?.category?.slug) return [];
      const list = await getProducts({ category: product.category.slug });
      return list.filter((p) => p.id !== product.id).slice(0, 3);
    },
    enabled: !!product?.category?.slug
  });

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    setActiveImageIndex(0);
    setActiveModelIndex(0);
  }, [productSlug]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-3 border-[#2A62C9] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[14px] text-[#6B7685]">Loading specifications...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md bg-white rounded-[28px] p-8 text-center border border-[#E3E8F0] space-y-4 shadow-sm">
          <h2 className="text-[20px] font-semibold text-[#0B1220]">Equipment Model Not Found</h2>
          <p className="text-[14px] text-[#6B7685]">
            The requested equipment could not be found or may have been moved.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0E1A33] text-white text-[13px] font-semibold hover:bg-black transition-colors"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const modelCodes = parseModelCodes(product.code);

  const images = product.images && product.images.length > 0 ? product.images : ['/images/cutout/scissor-lift.webp'];
  const rawActive = images[activeImageIndex] || images[0];
  const baseStem = rawActive.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '').toLowerCase().replace(/\s+/g, '-');
  const activeCutoutSrc = `/images/cutout/${baseStem}.webp`;
  const fallbackSrc = rawActive;

  return (
    <div className="w-full bg-[#F3F5F8] min-h-screen text-[#0B1220] selection:bg-[#2A62C9]/20 selection:text-[#0B1220] pb-24 md:pb-12">
      <Helmet>
        <title>{product.name} | Hydrelex Lift Systems Chennai</title>
        <meta
          name="description"
          content={`${product.name} - ${product.shortDesc || product.description || 'Hydraulic material handling lifting solution'}`}
        />
      </Helmet>

      {/* -------------------------------------------------------------
          PAGEBAND
      ------------------------------------------------------------- */}
      <PageBand
        pill={product.category?.name || 'Hydraulic Equipment'}
        title={product.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Catalog', href: '/products' },
          { label: product.category?.name || 'Category', href: `/products/${product.category?.slug}` },
          { label: product.name }
        ]}
        heightClass="min-h-[220px]"
      />

      {/* -------------------------------------------------------------
          GALLERY & SPEC OVERVIEW
      ------------------------------------------------------------- */}
      <div className="w-full mx-auto px-[var(--pad-x)] py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Image Gallery Card (5 cols on desktop, sticky) */}
          <div
            className="lg:col-span-5 bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#E3E8F0] space-y-4 lg:sticky self-start"
            style={{
              top: 'calc(var(--sticky-top) + 4px)',
              maxHeight: 'calc(100dvh - var(--sticky-top) - 24px)'
            }}
          >
            <div className="relative w-full h-[320px] sm:h-[400px] bg-[#F3F5F8] rounded-[22px] flex items-center justify-center p-6 overflow-hidden">
              <CutoutImage
                rawImage={rawActive}
                alt={product.name}
                className="max-h-[92%] max-w-[92%] object-contain drop-shadow-lg transition-all duration-300"
              />
              <div className="v4-floor-shadow" />
            </div>

            {/* Thumbnail list */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-16 rounded-[14px] bg-[#F3F5F8] border-2 p-1.5 shrink-0 flex items-center justify-center transition-all ${
                      activeImageIndex === idx ? 'border-[#2A62C9] bg-white shadow-sm' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Quick Spec & Actions Card (7 cols on desktop, scrolling) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#E3E8F0] space-y-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7685]">
                  Standard & Custom Configurations
                </span>
                <h2 className="text-[22px] font-semibold text-[#0B1220] tracking-tight mt-1">
                  Technical Overview
                </h2>
              </div>

              {product.shortDesc && (
                <p className="text-[14px] text-[#6B7685] leading-relaxed">
                  {product.shortDesc}
                </p>
              )}

              {/* Model Code Selector Tabs */}
              {modelCodes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E3E8F0]">
                  <span className="text-[12px] font-semibold text-[#0B1220]">
                    Select Model Variant:
                  </span>
                  <div className="flex flex-wrap gap-2" role="tablist">
                    {modelCodes.map((code, idx) => (
                      <button
                        key={idx}
                        role="tab"
                        aria-selected={activeModelIndex === idx}
                        data-state={activeModelIndex === idx ? 'active' : 'inactive'}
                        onClick={() => setActiveModelIndex(idx)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-mono transition-all ${
                          activeModelIndex === idx
                            ? 'bg-[#0E1A33] text-white shadow-sm'
                            : 'bg-[#F3F5F8] text-[#0B1220] hover:bg-[#E3E8F0]'
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-[#E3E8F0]">
                <button
                  onClick={() => {
                    addToBasket({
                      id: product.id,
                      code: modelCodes[activeModelIndex] || product.code,
                      name: product.name,
                      slug: product.slug,
                      categoryName: product.category?.name || 'Equipment',
                      image: activeCutoutSrc
                    });
                    toast.success(`Added ${product.name} to enquiry list`);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#0E1A33] text-white font-semibold text-[13px] hover:bg-black transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Model to Enquiry Basket</span>
                </button>
              </div>

              {/* Quick Contact Line */}
              <div className="flex items-center justify-between pt-3 text-[12px] text-[#6B7685]">
                <span>Contact sales engineering</span>
                <a
                  href={`tel:${phone1Tel}`}
                  className="font-semibold text-[#2A62C9] hover:underline"
                >
                  {phone1}
                </a>
              </div>
            </div>

            {/* Custom Built Note Callout */}
            {product.notes && product.notes.length > 0 && (
              <div className="rounded-[24px] bg-[#0E1A33] text-white p-6 shadow-sm space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6FA0E8]">
                  Custom Engineering Available
                </span>
                <p className="text-[13px] text-white/85 leading-relaxed">
                  {product.notes.join(' ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------
            SPECIFICATION TABLES
        ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-[#E3E8F0] space-y-6">
            <div>
              <div className="v4-pill-label mb-2">TECHNICAL PARAMETERS</div>
              <h2 className="v4-mixed-heading text-[24px] sm:text-[30px] font-medium text-[#0B1220]">
                Engineering <em className="accent">Specifications</em>
              </h2>
            </div>

            {product.specTables && product.specTables.length > 0 ? (
              <div className="space-y-8">
                {product.specTables.map((table, tIdx) => (
                  <div key={tIdx} className="space-y-3">
                    {table.title && (
                      <h3 className="text-[15px] font-semibold text-[#0B1220] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2A62C9]" />
                        <span>{table.title}</span>
                      </h3>
                    )}

                    <div className="overflow-x-auto rounded-[20px] border border-[#E3E8F0]">
                      <table className="w-full text-left border-collapse text-[13px]">
                        <thead>
                          <tr className="bg-[#F3F5F8] border-b border-[#E3E8F0]">
                            {table.columns.map((col, cIdx) => (
                              <th
                                key={cIdx}
                                className="py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-[#6B7685]"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E3E8F0]">
                          {table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={`hover:bg-[#F8FAFC] transition-colors ${
                                rIdx % 2 === 1 ? 'bg-[#FCFDFF]' : 'bg-white'
                              }`}
                            >
                              <td className="py-3 px-4 font-medium text-[#0B1220] max-w-[220px]">
                                {row.label}
                              </td>
                              {row.values.map((val, vIdx) => (
                                <td key={vIdx} className="py-3 px-4 text-[#4A5568] font-mono text-[12px]">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#6B7685] bg-[#F3F5F8] rounded-[20px]">
                Engineering drawings and bespoke capacities available upon technical consultation.
              </div>
            )}
          </div>

          {/* Applications & Industries Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {product.applications && product.applications.length > 0 && (
              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E3E8F0] space-y-4">
                <h3 className="text-[16px] font-semibold text-[#0B1220]">
                  Key Applications
                </h3>
                <ul className="space-y-2.5 text-[13px] text-[#4A5568]">
                  {product.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#2A62C9] shrink-0 mt-0.5" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.industries && product.industries.length > 0 && (
              <div className="bg-white rounded-[28px] p-6 shadow-sm border border-[#E3E8F0] space-y-4">
                <h3 className="text-[16px] font-semibold text-[#0B1220]">
                  Sectors Served
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.industries.map((ind, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#F3F5F8] border border-[#E3E8F0] text-[12px] font-medium text-[#0B1220]"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------
            RELATED EQUIPMENT
        ------------------------------------------------------------- */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <div>
              <div className="v4-pill-label mb-2">RELATED</div>
              <h2 className="v4-mixed-heading text-[26px] sm:text-[34px] font-medium text-[#0B1220]">
                Complementary <em className="accent">Equipment</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          MOBILE STICKY BOTTOM ACTION BAR (< 768px)
      ------------------------------------------------------------- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3E8F0] p-3 px-4 shadow-lg flex items-center gap-2">
        <button
          onClick={() => openQuoteModal({ id: product.id, name: product.name, code: product.code })}
          className="flex-1 h-12 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0E1A33] text-white text-[13px] font-semibold active:scale-[0.98] transition-transform"
        >
          <span>Request Quote</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#2A62C9]" />
        </button>

        <a
          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi, I am inquiring about ${product.name}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2A62C9] text-white shrink-0 active:scale-[0.98] transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <button
          onClick={() => {
            addToBasket({
              id: product.id,
              code: modelCodes[activeModelIndex] || product.code,
              name: product.name,
              slug: product.slug,
              categoryName: product.category?.name || 'Equipment',
              image: activeCutoutSrc
            });
            toast.success(`Added ${product.name} to enquiry list`);
          }}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-[#E3E8F0] bg-white text-[#0B1220] shrink-0 active:scale-[0.98] transition-transform"
          aria-label="Add to enquiry list"
        >
          <ShoppingBag className="w-5 h-5 text-[#2A62C9]" />
        </button>
      </div>
    </div>
  );
};
