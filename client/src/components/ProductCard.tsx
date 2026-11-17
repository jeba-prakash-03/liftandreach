import React from 'react';
import { Product } from '../types';
import { useBasket } from '../context/BasketContext';
import { useCompare } from '../context/CompareContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { ResponsiveImage } from './ResponsiveImage';
import {
  Scale,
  ClipboardList,
  Check,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { openQuoteModal } = useApp();
  const { addToBasket, isInBasket } = useBasket();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const hasCustomBuilt =
    product.notes?.some((n) => n.toLowerCase().includes('custom')) ||
    product.name.toLowerCase().includes('custom') ||
    (product.shortDesc && product.shortDesc.toLowerCase().includes('custom'));

  // Extract Capacity, Max Height, Platform/Travel from specTables
  let capacityVal = '';
  let heightVal = '';
  let platformVal = '';

  if (product.specTables && product.specTables.length > 0) {
    const table = product.specTables[0];

    const capRow = table.rows.find((r) => r.label.toUpperCase().includes('CAPACITY'));
    if (capRow && capRow.values.length > 0) {
      const vals = capRow.values.filter(Boolean);
      if (vals.length === 1) {
        capacityVal = vals[0].trim();
      } else if (vals.length > 1) {
        const first = vals[0].trim();
        const last = vals[vals.length - 1].trim();
        capacityVal = first === last ? first : `${first} - ${last}`;
      }
    }

    const htRow = table.rows.find(
      (r) =>
        r.label.toUpperCase().includes('RAISED') ||
        r.label.toUpperCase().includes('LIFTING HEIGHT') ||
        r.label.toUpperCase().includes('MAX. WORKING') ||
        r.label.toUpperCase().includes('HEIGHT')
    );
    if (htRow && htRow.values.length > 0) {
      const vals = htRow.values.filter(Boolean);
      if (vals.length === 1) {
        heightVal = vals[0].trim();
      } else if (vals.length > 1) {
        const first = vals[0].trim();
        const last = vals[vals.length - 1].trim();
        heightVal = first === last ? first : `${first} - ${last}`;
      }
    }

    const platRow = table.rows.find(
      (r) =>
        r.label.toUpperCase().includes('PLATFORM') ||
        r.label.toUpperCase().includes('TABLE SIZE') ||
        r.label.toUpperCase().includes('DIMENSION')
    );
    if (platRow && platRow.values.length > 0) {
      platformVal = platRow.values[0].trim();
    }
  }

  // Fallback defaults if table didn't have capacity but code has it
  if (!capacityVal && product.code) {
    const m = product.code.match(/([0-9.]+\s*T(?:ON)?|[0-9]+\s*KG)/i);
    if (m) capacityVal = m[0];
  }

  // Determine hierarchical link
  const link = product.category?.parent
    ? `/products/${product.category.parent.slug}/${product.category.slug}/${product.slug}`
    : `/products/${product.category?.slug || 'equipment'}/${product.slug}`;

  const img = product.images?.[0] || '/images/product/scissor lift.jpg';

  const inBasket = isInBasket(product.id);
  const inCompare = isInCompare(product.id);

  return (
    <div className="group relative bg-white border border-slate-200 hover:border-slate-400 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-none hover:shadow-xs">
      {/* Industrial Top Accent Strip */}
      <div className="h-1 w-full bg-slate-200 group-hover:bg-[#2F5FA8] transition-colors" />

      {/* Top Quick Action Buttons */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-90 lg:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inCompare) removeFromCompare(product.id);
            else addToCompare(product);
          }}
          className={`p-1.5 border text-xs transition-colors cursor-pointer ${
            inCompare
              ? 'bg-[#2F5FA8] text-white border-[#2F5FA8]'
              : 'bg-white text-slate-700 hover:text-[#2F5FA8] border-slate-300 hover:bg-slate-50'
          }`}
          title={inCompare ? 'Remove from compare' : 'Compare model'}
          aria-label="Compare model"
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToBasket({
              id: product.id,
              name: product.name,
              code: product.code,
              slug: product.slug,
              image: img,
              categoryName: product.category?.name
            });
          }}
          className={`p-1.5 border text-xs transition-colors cursor-pointer ${
            inBasket
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-700 hover:text-[#2F5FA8] border-slate-300 hover:bg-slate-50'
          }`}
          title={inBasket ? 'In enquiry basket' : 'Add to enquiry basket'}
          aria-label="Add to enquiry basket"
        >
          {inBasket ? <Check className="w-3.5 h-3.5" /> : <ClipboardList className="w-3.5 h-3.5" />}
        </button>
      </div>

      <Link to={link} className="flex-1 flex flex-col">
        {/* Technical Product Photo Frame */}
        <div className="relative aspect-4/3 w-full bg-[#F8FAFC] border-b border-slate-200 p-4 overflow-hidden flex items-center justify-center">
          <ResponsiveImage
            src={img}
            alt={product.name}
            eager={index < 4}
            width={250}
            height={250}
          />
        </div>

        {/* Technical Details Block */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
          <div>
            {/* Category / Scope & Tag */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold truncate">
                {product.category?.name || 'Hydraulic Equipment'}
              </span>

              {hasCustomBuilt && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-100 border border-slate-300 px-1.5 py-0.5 shrink-0">
                  <span>Custom Built</span>
                </span>
              )}
            </div>

            {/* Equipment Title */}
            <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#2F5FA8] transition-colors leading-snug mt-1.5">
              {product.name}
            </h3>

            {/* Engineering Code Identification */}
            {product.code && (
              <div className="mt-1 font-mono text-[11px] text-slate-700">
                <span className="text-slate-400 font-sans mr-1">TYPE:</span>
                <span className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 break-all inline-block font-semibold">
                  {product.code}
                </span>
              </div>
            )}
          </div>

          {/* Precision Spec Matrix */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs font-mono">
            {capacityVal && (
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 font-sans text-[11px]">Rated Load</span>
                <span className="font-semibold text-slate-900 text-[11px] text-right">{capacityVal}</span>
              </div>
            )}
            {heightVal && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-slate-700">
                <span className="text-slate-500 font-sans text-[11px]">Travel / Lift</span>
                <span className="font-semibold text-slate-900 text-[11px] text-right">{heightVal}</span>
              </div>
            )}
            {platformVal && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-slate-700">
                <span className="text-slate-500 font-sans text-[11px]">Platform</span>
                <span className="font-semibold text-slate-900 text-[11px] text-right truncate max-w-[150px]">{platformVal}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Industrial Footer Bar */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
        <Link
          to={link}
          className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors text-center inline-flex items-center justify-center gap-1"
        >
          <span>Datasheet</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          type="button"
          onClick={() => openQuoteModal({ id: product.id, name: product.name, code: product.code })}
          className="flex-1 py-1.5 px-3 bg-[#0B1F3A] hover:bg-[#2F5FA8] text-white font-medium text-xs transition-colors cursor-pointer text-center inline-flex items-center justify-center gap-1"
        >
          <span>RFQ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
