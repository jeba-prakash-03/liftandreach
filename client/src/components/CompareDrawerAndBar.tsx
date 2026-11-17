import React from 'react';
import { useCompare } from '../context/CompareContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export const CompareDrawerAndBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isCompareModalOpen, setIsCompareModalOpen } =
    useCompare();
  const { openQuoteModal } = useApp();

  if (compareList.length === 0) return null;

  // Collect all unique spec labels from the selected products
  const specLabelsSet = new Set<string>();
  compareList.forEach((p) => {
    if (p.specTables) {
      p.specTables.forEach((t) => {
        t.rows.forEach((r) => specLabelsSet.add(r.label));
      });
    }
  });
  const allSpecLabels = Array.from(specLabelsSet);

  return (
    <>
      {/* Sticky Bottom Comparison Floating Bar */}
      {!isCompareModalOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#E53935]" />
            <span className="text-xs font-bold font-heading">
              Comparing ({compareList.length}/3 Models)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {compareList.map((p) => (
              <span
                key={p.id}
                className="bg-slate-800 text-xs px-2.5 py-1 rounded-md border border-slate-700 truncate max-w-[140px]"
              >
                {p.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-4 py-1.5 bg-[#2F5FA8] hover:bg-[#1F3F73] text-white font-bold text-xs rounded-lg cursor-pointer"
            >
              View Comparison
            </button>
            <button
              onClick={clearCompare}
              className="p-1.5 text-slate-400 hover:text-white"
              title="Clear comparison list"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#1A2E4C] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-[#E53935]" />
                <h3 className="font-heading font-bold text-base">
                  Equipment Technical Comparison
                </h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-500 uppercase tracking-wider w-1/4 sticky left-0 bg-white z-10">
                      Specification
                    </th>
                    {compareList.map((product) => (
                      <th key={product.id} className="py-3 px-4 font-bold text-slate-900 w-1/4">
                        <div className="space-y-2">
                          <div className="aspect-4/3 w-full bg-slate-100 rounded-lg overflow-hidden p-2">
                            <img
                              src={product.images?.[0] || '/images/product/scissor lift.jpg'}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="font-heading font-bold text-sm text-slate-900">
                            {product.name}
                          </div>
                          {product.code && (
                            <div className="font-mono text-[10px] text-slate-500 font-bold">
                              {product.code}
                            </div>
                          )}
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsCompareModalOpen(false);
                                openQuoteModal({ id: product.id, name: product.name, code: product.code });
                              }}
                              className="w-full py-1.5 bg-[#E53935] hover:bg-[#C62828] text-white font-bold rounded text-[11px]"
                            >
                              Quote
                            </button>
                            <button
                              onClick={() => removeFromCompare(product.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 border rounded"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/70 font-semibold">
                    <td className="py-2.5 px-4 text-slate-600 sticky left-0 bg-slate-50">Category</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-2.5 px-4 text-[#2F5FA8]">
                        {p.category?.name || 'Industrial'}
                      </td>
                    ))}
                  </tr>

                  {allSpecLabels.map((label, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                      <td className="py-2.5 px-4 font-bold text-slate-700 sticky left-0 bg-white border-r border-slate-100">
                        {label}
                      </td>
                      {compareList.map((p) => {
                        let val = '-';
                        if (p.specTables) {
                          for (const t of p.specTables) {
                            const r = t.rows.find((row) => row.label.toLowerCase() === label.toLowerCase());
                            if (r && r.values.length > 0) {
                              val = r.values.join(' / ');
                              break;
                            }
                          }
                        }
                        return (
                          <td key={p.id} className="py-2.5 px-4 text-slate-600 font-medium">
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Detailed parameters sourced directly from factory specification matrices.
              </span>
              <button
                onClick={clearCompare}
                className="text-[#E53935] hover:underline font-bold"
              >
                Clear Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
