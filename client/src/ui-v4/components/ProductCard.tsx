import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Product } from '../../types';
import { toast } from 'sonner';
import { ShoppingBag, Scale, Eye } from 'lucide-react';
import { CutoutImage } from './CutoutImage';
import { extractProductKeySpecs, extractProductCodes } from '../utils/specFormatter';

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, horizontal = false }) => {
  const addToBasket = useAppStore((state) => state.addToBasket);
  const addToCompare = useAppStore((state) => state.addToCompare);
  const compareItems = useAppStore((state) => state.compareItems);
  const setQuickViewProductSlug = useAppStore((state) => state.setQuickViewProductSlug);

  const isCustom = (product.notes && product.notes.length > 0) || product.name.toLowerCase().includes('custom');

  // Exact code formatting per Part C4
  const codes = extractProductCodes(product);
  // Show max 2 codes
  const displayCodes = codes.slice(0, 2);

  // Derive specs per Part C3
  const { capacity, maxHeight } = extractProductKeySpecs(product);

  const rawImage = product.images?.[0] || '';
  const detailLink = `/products/${product.category?.slug || 'all'}/${product.slug}`;
  const inCompare = compareItems.some((item) => item.id === product.id);

  if (horizontal) {
    return (
      <article className="pc pc--horizontal bg-white rounded-[24px] p-3 border border-[#E3E8F0] flex gap-3.5 items-center relative overflow-hidden shadow-sm">
        <Link className="w-[112px] h-[112px] flex-shrink-0 bg-[#F4F7FB] rounded-[18px] p-2 flex items-center justify-center relative overflow-hidden" to={detailLink}>
          <CutoutImage rawImage={rawImage} alt={product.name} className="w-full h-full object-contain" />
          {isCustom && <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold bg-[#2A62C9] text-white px-1.5 py-0.5 rounded-full">Custom</span>}
        </Link>

        <div className="flex-1 min-w-0 pr-1">
          <div className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider truncate">
            {product.category?.name || 'Equipment'}
          </div>
          <h3 className="text-[16px] font-semibold text-[#0B1220] leading-snug line-clamp-2 my-0.5">
            <Link to={detailLink}>{product.name}</Link>
          </h3>

          {displayCodes.length > 0 && (
            <div className="font-mono text-[12px] text-[#4B5563] space-y-0.5 my-1">
              {displayCodes.map((code, idx) => (
                <div key={idx} className="truncate">{code}</div>
              ))}
            </div>
          )}

          <div className="text-[13px] text-[#374151] space-y-0.5 mt-1 font-medium">
            {capacity && (
              <div className="truncate"><span className="text-[#6B7280]">Cap:</span> {capacity}</div>
            )}
            {maxHeight && (
              <div className="truncate"><span className="text-[#6B7280]">Height:</span> {maxHeight}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 self-center pr-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProductSlug(product.slug);
            }}
            className="w-10 h-10 rounded-full bg-white border border-[#E3E8F0] flex items-center justify-center text-[#0B1220] shadow-sm hover:bg-[#F8FAFC]"
            title="Quick view"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCompare({
                id: product.id,
                name: product.name,
                code: product.code,
                slug: product.slug,
                image: rawImage,
                categoryName: product.category?.name
              });
              toast.success(inCompare ? `Removed from compare` : `Added ${product.name} to compare`);
            }}
            className={`w-10 h-10 rounded-full border border-[#E3E8F0] flex items-center justify-center shadow-sm ${
              inCompare ? 'bg-[#2A62C9] text-white' : 'bg-white text-[#0B1220] hover:bg-[#F8FAFC]'
            }`}
            title="Compare"
            aria-label={`Compare ${product.name}`}
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToBasket({
                id: product.id,
                code: product.code,
                name: product.name,
                slug: product.slug,
                categoryName: product.category?.name || 'Equipment',
                image: rawImage
              });
              toast.success(`Added ${product.name} to enquiry list`);
            }}
            className="w-10 h-10 rounded-full bg-[#2A62C9] text-white flex items-center justify-center shadow-sm hover:bg-[#1E4FA8]"
            title="Add to enquiry"
            aria-label={`Add ${product.name} to enquiry`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="pc">
      <Link className="pc__media" to={detailLink} aria-label={product.name}>
        <CutoutImage rawImage={rawImage} alt={product.name} className="w-full h-full object-contain" />
        {isCustom && <span className="pc__tag">Custom built</span>}
      </Link>

      <div className="pc__tools">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickViewProductSlug(product.slug);
          }}
          className="p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#E3E8F0] text-[#0B1220] shadow-sm transition-all"
          title="Quick view drawer"
          aria-label={`Quick view ${product.name}`}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCompare({
              id: product.id,
              name: product.name,
              code: product.code,
              slug: product.slug,
              image: rawImage,
              categoryName: product.category?.name
            });
            toast.success(inCompare ? `Removed from compare` : `Added ${product.name} to compare`);
          }}
          className={`p-2 rounded-full backdrop-blur-md border border-[#E3E8F0] shadow-sm transition-all ${
            inCompare ? 'bg-[#2A62C9] text-white' : 'bg-white/90 text-[#0B1220] hover:bg-white'
          }`}
          title="Compare specifications"
          aria-label={`Compare ${product.name}`}
        >
          <Scale className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToBasket({
              id: product.id,
              code: product.code,
              name: product.name,
              slug: product.slug,
              categoryName: product.category?.name || 'Equipment',
              image: rawImage
            });
            toast.success(`Added ${product.name} to enquiry list`);
          }}
          className="p-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#E3E8F0] text-[#2A62C9] shadow-sm transition-all"
          title="Add to enquiry list"
          aria-label={`Add ${product.name} to enquiry`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="pc__body">
        <div className="pc__cat">{product.category?.name || 'Equipment'}</div>
        <h3 className="pc__name">
          <Link to={detailLink}>{product.name}</Link>
        </h3>

        {displayCodes.length > 0 && (
          <div className="pc__code">
            {displayCodes.map((code, idx) => (
              <div key={idx}>{code}</div>
            ))}
          </div>
        )}

        {(capacity || maxHeight) && (
          <dl className="pc__specs">
            {capacity && (
              <>
                <dt>Capacity</dt>
                <dd>{capacity}</dd>
              </>
            )}
            {maxHeight && (
              <>
                <dt>Max height</dt>
                <dd>{maxHeight}</dd>
              </>
            )}
          </dl>
        )}

        <Link className="pc__cta" to={detailLink}>
          View details <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
};
