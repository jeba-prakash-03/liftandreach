import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { getProductBySlug } from '../services/api';
import { X } from 'lucide-react';
import { Button } from './architectural/Button';

export const CompareDialog: React.FC = () => {
  const isOpen = useAppStore((state) => state.isCompareDialogOpen);
  const setIsOpen = useAppStore((state) => state.setCompareDialogOpen);
  const compareItems = useAppStore((state) => state.compareItems);
  const removeFromCompare = useAppStore((state) => state.removeFromCompare);
  const clearCompare = useAppStore((state) => state.clearCompare);
  const openQuoteModal = useAppStore((state) => state.openQuoteModal);

  // Fetch full specifications for each compared item
  const { data: fullProducts = [] } = useQuery({
    queryKey: ['compare-products', compareItems.map((i) => i.id)],
    queryFn: async () => {
      const proms = compareItems.map((item) => getProductBySlug(item.slug));
      return Promise.all(proms);
    },
    enabled: isOpen && compareItems.length > 0
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-[#15191E]/60 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-[#F6F4F0] border border-[#D5CFC5] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] elevation-3"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#D5CFC5] bg-white flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-semibold text-[#15191E]">Equipment Model Comparison</h3>
            <p className="font-body text-xs text-[#7C8794]">
              Side-by-side comparison of up to 4 models with highlighted differing parameters.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {compareItems.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs font-medium text-[#C8202F] hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#7C8794] hover:text-[#15191E] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto p-4 sm:p-6">
          {compareItems.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="font-heading text-lg font-medium text-[#7C8794]">No models in compare list.</p>
              <p className="font-body text-xs text-[#3A424C]">
                Select checkboxes on the catalog list to compare parameters side-by-side.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse bg-white border border-[#D5CFC5] text-xs">
              <thead>
                <tr className="bg-[#E8E4DD] border-b border-[#D5CFC5]">
                  <th className="p-3 w-40 font-mono text-[#7C8794] uppercase tracking-wider">Parameter</th>
                  {fullProducts.map((p) => (
                    <th key={p.id} className="p-3 min-w-[200px] align-top">
                      <div className="space-y-2">
                        <div className="relative aspect-[4/3] max-h-24 w-full bg-[#F6F4F0] border border-[#D5CFC5] flex items-center justify-center p-2">
                          <img
                            src={p.images?.[0] || '/images/product/scissor lift.jpg'}
                            alt={p.name}
                            className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <div className="font-heading text-sm font-semibold text-[#15191E]">{p.name}</div>
                            {p.code && <div className="font-mono text-[11px] text-[#1F4E96]">{p.code}</div>}
                          </div>
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="text-[#7C8794] hover:text-[#C8202F] p-0.5 cursor-pointer"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => {
                            setIsOpen(false);
                            openQuoteModal({ id: p.id, name: p.name, code: p.code });
                          }}
                        >
                          Quote
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5CFC5] font-body text-[#15191E]">
                <tr className="hover:bg-[#F6F4F0]">
                  <td className="p-3 font-semibold text-[#7C8794] bg-[#F6F4F0]">Category</td>
                  {fullProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      {p.category?.name || '—'}
                    </td>
                  ))}
                </tr>
                {/* Dynamically extract rows from spec tables */}
                {fullProducts[0]?.specTables?.[0]?.rows.map((row, rIdx) => {
                  const valuesAcross = fullProducts.map((p) => {
                    const match = p.specTables?.[0]?.rows.find((r) => r.label === row.label);
                    return match ? match.values.join(' / ') : '—';
                  });
                  const isDiffering = new Set(valuesAcross).size > 1;

                  return (
                    <tr
                      key={rIdx}
                      className={`hover:bg-[#F6F4F0] transition-colors ${
                        isDiffering ? 'bg-[#1F4E96]/5 font-medium' : ''
                      }`}
                    >
                      <td className="p-3 font-medium text-[#3A424C] bg-[#F6F4F0] flex items-center justify-between">
                        <span>{row.label}</span>
                        {isDiffering && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1F4E96]" title="Differing value" />
                        )}
                      </td>
                      {valuesAcross.map((val, vIdx) => (
                        <td key={vIdx} className="p-3 tabular-nums font-mono text-xs">
                          {val}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};
