import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useApp } from '../context/AppContext';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface ProductTableViewProps {
  products: Product[];
}

export const ProductTableView: React.FC<ProductTableViewProps> = ({ products }) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { openQuoteModal } = useApp();

  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-mono font-semibold uppercase text-[10px] tracking-wider">
            <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200">Select</th>
            <th className="py-2.5 px-4 min-w-[220px] border-r border-slate-200">Equipment Line / Model</th>
            <th className="py-2.5 px-3 border-r border-slate-200">Type Code</th>
            <th className="py-2.5 px-3 border-r border-slate-200">Rated Load</th>
            <th className="py-2.5 px-3 border-r border-slate-200">Max Height</th>
            <th className="py-2.5 px-3 border-r border-slate-200">Platform Dimensions</th>
            <th className="py-2.5 px-3 border-r border-slate-200">Power / Operation</th>
            <th className="py-2.5 px-3 text-right">Engineering Specs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
          {products.map((product) => {
            const link = product.category?.parent
              ? `/products/${product.category.parent.slug}/${product.category.slug}/${product.slug}`
              : `/products/${product.category?.slug || 'equipment'}/${product.slug}`;

            const inCompare = isInCompare(product.id);

            let cap = '';
            let ht = '';
            let plat = '';
            let power = '';

            if (product.specTables && product.specTables.length > 0) {
              const table = product.specTables[0];
              const capRow = table.rows.find((r) => r.label.toUpperCase().includes('CAPACITY'));
              if (capRow && capRow.values.length > 0) cap = capRow.values.join(' / ');

              const htRow = table.rows.find(
                (r) =>
                  r.label.toUpperCase().includes('RAISED') ||
                  r.label.toUpperCase().includes('LIFTING HEIGHT') ||
                  r.label.toUpperCase().includes('MAX. WORKING') ||
                  r.label.toUpperCase().includes('HEIGHT')
              );
              if (htRow && htRow.values.length > 0) ht = htRow.values.join(' / ');

              const platRow = table.rows.find(
                (r) =>
                  r.label.toUpperCase().includes('PLATFORM') ||
                  r.label.toUpperCase().includes('TABLE SIZE')
              );
              if (platRow && platRow.values.length > 0) plat = platRow.values[0];

              const pwrRow = table.rows.find(
                (r) =>
                  r.label.toUpperCase().includes('POWER') ||
                  r.label.toUpperCase().includes('MOTOR') ||
                  r.label.toUpperCase().includes('OPERATION')
              );
              if (pwrRow && pwrRow.values.length > 0) power = pwrRow.values[0];
            }

            return (
              <tr
                key={product.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                {/* Checkbox for Compare */}
                <td className="py-2.5 px-3 text-center border-r border-slate-100">
                  <input
                    type="checkbox"
                    checked={inCompare}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (inCompare) removeFromCompare(product.id);
                      else addToCompare(product);
                    }}
                    className="w-3.5 h-3.5 rounded-none text-slate-800 focus:ring-0 cursor-pointer"
                  />
                </td>

                {/* Product Name */}
                <td className="py-2.5 px-4 font-sans text-slate-900 border-r border-slate-100 font-semibold">
                  <Link to={link} className="flex flex-col">
                    <span className="hover:text-[#2F5FA8] transition-colors">{product.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-normal uppercase">{product.category?.name}</span>
                  </Link>
                </td>

                {/* Code */}
                <td className="py-2.5 px-3 text-slate-700 border-r border-slate-100">
                  {product.code || '—'}
                </td>

                {/* Capacity */}
                <td className="py-2.5 px-3 text-slate-800 font-bold border-r border-slate-100">
                  {cap || '—'}
                </td>

                {/* Height */}
                <td className="py-2.5 px-3 text-slate-700 border-r border-slate-100">
                  {ht || '—'}
                </td>

                {/* Platform */}
                <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px] border-r border-slate-100">
                  {plat || '—'}
                </td>

                {/* Power */}
                <td className="py-2.5 px-3 text-slate-700 truncate max-w-[120px] border-r border-slate-100">
                  {power || '—'}
                </td>

                {/* Action */}
                <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                  <Link
                    to={link}
                    className="py-1 px-2 bg-white hover:bg-slate-100 text-slate-800 font-sans text-[11px] border border-slate-300 transition-colors inline-flex items-center gap-0.5"
                  >
                    <span>Datasheet</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuoteModal({ id: product.id, name: product.name, code: product.code });
                    }}
                    className="py-1 px-2.5 bg-[#0B1F3A] hover:bg-[#2F5FA8] text-white font-sans text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <span>RFQ</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
