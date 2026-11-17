import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { getProductBySlug } from '../services/api';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from './architectural/Button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const QuickViewDrawer: React.FC = () => {
  const slug = useAppStore((state) => state.quickViewProductSlug);
  const setSlug = useAppStore((state) => state.setQuickViewProductSlug);
  const addToBasket = useAppStore((state) => state.addToBasket);
  const openQuoteModal = useAppStore((state) => state.openQuoteModal);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => (slug ? getProductBySlug(slug) : null),
    enabled: !!slug
  });

  useEffect(() => {
    if (!slug) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSlug(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slug, setSlug]);

  if (!slug) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSlug(null)}
        className="fixed inset-0 bg-[#15191E]/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer: 480px width, elevation-3 */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[480px] bg-[#F6F4F0] border-l border-[#D5CFC5] h-full flex flex-col justify-between z-10 elevation-3"
      >
        {/* Header */}
        <div className="p-4 border-b border-[#D5CFC5] flex items-center justify-between bg-white">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#7C8794] block">
              Quick View Specification
            </span>
            <h3 className="font-heading text-lg font-semibold text-[#15191E] truncate max-w-[340px]">
              {product?.name || 'Loading...'}
            </h3>
          </div>
          <button
            onClick={() => setSlug(null)}
            className="p-1 text-[#7C8794] hover:text-[#15191E] rounded-[2px] cursor-pointer"
            aria-label="Close Quick View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isLoading || !product ? (
            <div className="space-y-4 animate-pulse">
              <div className="aspect-[4/3] bg-[#E8E4DD] animate-shimmer" />
              <div className="h-6 w-3/4 bg-[#E8E4DD] animate-shimmer" />
              <div className="h-16 w-full bg-[#E8E4DD] animate-shimmer" />
            </div>
          ) : (
            <>
              {/* Product Image Plate */}
              <div className="relative aspect-[4/3] w-full bg-[#E8E4DD] border border-[#D5CFC5] flex items-center justify-center p-4">
                <img
                  src={product.images?.[0] || '/images/product/scissor lift.jpg'}
                  alt={product.name}
                  className="max-w-[85%] max-h-[85%] object-contain mix-blend-multiply"
                />
              </div>

              {/* Code */}
              {product.code && (
                <div className="p-2.5 bg-white border border-[#D5CFC5] font-mono text-xs text-[#1F4E96]">
                  Model Code: <span className="font-semibold">{product.code}</span>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <h4 className="font-heading text-sm font-semibold text-[#15191E]">Overview</h4>
                <p className="font-body text-xs text-[#3A424C] leading-relaxed">
                  {product.description || product.shortDesc}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specTables && product.specTables.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#D5CFC5]">
                  <h4 className="font-heading text-sm font-semibold text-[#15191E]">Standard Ratings</h4>
                  <div className="overflow-x-auto border border-[#D5CFC5] bg-white text-xs">
                    <table className="w-full text-left">
                      <tbody className="divide-y divide-[#D5CFC5]">
                        {product.specTables[0].rows.slice(0, 5).map((r, i) => (
                          <tr key={i} className="hover:bg-[#F6F4F0]">
                            <td className="p-2 font-medium text-[#15191E]">{r.label}</td>
                            <td className="p-2 font-mono text-[#3A424C] text-right">
                              {r.values.join(' / ') || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Applications */}
              {product.applications && product.applications.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#D5CFC5]">
                  <h4 className="font-heading text-sm font-semibold text-[#15191E]">Typical Applications</h4>
                  <p className="font-body text-xs text-[#3A424C] leading-relaxed">
                    {product.applications.join(', ')}.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        {product && (
          <div className="p-4 border-t border-[#D5CFC5] bg-white flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  openQuoteModal({ id: product.id, name: product.name, code: product.code });
                  setSlug(null);
                }}
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
                className="p-2.5 bg-[#F6F4F0] border border-[#D5CFC5] hover:border-[#1F4E96] text-[#15191E] rounded-none cursor-pointer"
                title="Add to enquiry list"
              >
                <ShoppingBag className="w-4 h-4 text-[#1F4E96]" />
              </button>
            </div>

            <Link
              to={`/products/${product.category?.slug || 'all'}/${product.slug}`}
              onClick={() => setSlug(null)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-[#1F4E96] hover:underline py-1"
            >
              <span>View full engineering datasheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};
