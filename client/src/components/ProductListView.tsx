import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { ResponsiveImage } from './ResponsiveImage';
import { useApp } from '../context/AppContext';
import { useBasket } from '../context/BasketContext';
import { useCompare } from '../context/CompareContext';
import { Scale, ClipboardList, Check, ArrowRight, ChevronRight } from 'lucide-react';

interface ProductListViewProps {
  products: Product[];
}

export const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  const { openQuoteModal } = useApp();
  const { addToBasket, isInBasket } = useBasket();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  return (
    <div className="space-y-2 w-full">
      {products.map((product, idx) => {
        const link = product.category?.parent
          ? `/products/${product.category.parent.slug}/${product.category.slug}/${product.slug}`
          : `/products/${product.category?.slug || 'equipment'}/${product.slug}`;

        const img = product.images?.[0] || '/images/product/scissor lift.jpg';
        const inBasket = isInBasket(product.id);
        const inCompare = isInCompare(product.id);

        let capacityVal = '';
        let heightVal = '';
        let platformVal = '';

        if (product.specTables && product.specTables.length > 0) {
          const table = product.specTables[0];
          const capRow = table.rows.find((r) => r.label.toUpperCase().includes('CAPACITY'));
          if (capRow && capRow.values.length > 0) {
            capacityVal = capRow.values[0];
          }
          const htRow = table.rows.find(
            (r) =>
              r.label.toUpperCase().includes('RAISED') ||
              r.label.toUpperCase().includes('LIFTING HEIGHT') ||
              r.label.toUpperCase().includes('MAX. WORKING') ||
              r.label.toUpperCase().includes('HEIGHT')
          );
          if (htRow && htRow.values.length > 0) {
            heightVal = htRow.values[0];
          }
          const platRow = table.rows.find(
            (r) =>
              r.label.toUpperCase().includes('PLATFORM') ||
              r.label.toUpperCase().includes('TABLE SIZE') ||
              r.label.toUpperCase().includes('DIMENSION')
          );
          if (platRow && platRow.values.length > 0) {
            platformVal = platRow.values[0];
          }
        }

        return (
          <div
            key={product.id}
            className="group bg-white border border-slate-200 hover:border-slate-400 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 transition-all"
          >
            {/* Image + Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F8FAFC] border border-slate-200 shrink-0 p-2 flex items-center justify-center">
                <ResponsiveImage
                  src={img}
                  alt={product.name}
                  eager={idx < 5}
                  width={150}
                  height={150}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                    {product.category?.name}
                  </span>
                  {product.code && (
                    <span className="font-mono text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
                      TYPE: {product.code}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#2F5FA8] transition-colors truncate">
                  <Link to={link}>{product.name}</Link>
                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">
                  {product.shortDesc || product.description}
                </p>
              </div>
            </div>

            {/* Spec Columns */}
            <div className="grid grid-cols-3 gap-3 px-3 py-2 bg-slate-50 border border-slate-200 text-xs shrink-0 min-w-[260px] font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Capacity</span>
                <span className="font-semibold text-slate-800 text-[11px]">{capacityVal || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Max Height</span>
                <span className="font-semibold text-slate-800 text-[11px]">{heightVal || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Platform</span>
                <span className="font-semibold text-slate-800 text-[11px] truncate block">{platformVal || '—'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (inCompare) removeFromCompare(product.id);
                  else addToCompare(product);
                }}
                className={`p-2 border text-xs transition-colors cursor-pointer ${
                  inCompare
                    ? 'bg-[#2F5FA8] text-white border-[#2F5FA8]'
                    : 'bg-white text-slate-600 border-slate-300 hover:text-[#2F5FA8]'
                }`}
                title={inCompare ? 'In Compare' : 'Add to Compare'}
              >
                <Scale className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  addToBasket({
                    id: product.id,
                    name: product.name,
                    code: product.code,
                    slug: product.slug,
                    image: img,
                    categoryName: product.category?.name
                  })
                }
                className={`p-2 border text-xs transition-colors cursor-pointer ${
                  inBasket
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-300 hover:text-[#2F5FA8]'
                }`}
                title={inBasket ? 'In Enquiry Basket' : 'Add to Enquiry Basket'}
              >
                {inBasket ? <Check className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
              </button>

              <Link
                to={link}
                className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors inline-flex items-center gap-1"
              >
                <span>Datasheet</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={() => openQuoteModal({ id: product.id, name: product.name, code: product.code })}
                className="py-1.5 px-3 bg-[#0B1F3A] hover:bg-[#2F5FA8] text-white font-medium text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>RFQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
