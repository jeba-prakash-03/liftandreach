import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { Helmet } from 'react-helmet-async';
import { useApp } from '../../context/AppContext';
import { getProducts } from '../../services/api';
import { Product } from '../../types';
import { PageBand } from '../components/PageBand';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  Check
} from 'lucide-react';

export const ProductsPageV4: React.FC = () => {
  const { category: routeCategory } = useParams<{ category?: string; sub?: string }>();
  const { categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const activeCategorySlug = routeCategory || searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const selectedCap = searchParams.get('cap') || 'all';
  const selectedSort = searchParams.get('sort') || 'recommended';
  const customBuiltOnly = searchParams.get('custom') === 'true';

  // Local search input
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination
  const PAGE_SIZE = 12;
  const storageLoadedKey = `v4_products_loaded_count_${window.location.pathname}_${searchParams.toString()}`;
  const getInitialLoadedCount = () => {
    try {
      const saved = sessionStorage.getItem(storageLoadedKey);
      if (saved) return Math.max(PAGE_SIZE, parseInt(saved, 10));
    } catch {}
    return PAGE_SIZE;
  };

  const [visibleCount, setVisibleCount] = useState<number>(getInitialLoadedCount);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch products
  const { data: allProducts = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setVisibleCount(getInitialLoadedCount());
  }, [activeCategorySlug, searchQuery, selectedCap, customBuiltOnly, selectedSort]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageLoadedKey, String(visibleCount));
    } catch {}
  }, [visibleCount, storageLoadedKey]);

  // Update query params helper
  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  // Filter products by category, search, capacity, custom
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (activeCategorySlug !== 'all') {
      result = result.filter(
        (p) =>
          p.category?.slug === activeCategorySlug ||
          (p.category as any)?.parent?.slug === activeCategorySlug
      );
    }

    // Capacity filter
    if (selectedCap !== 'all') {
      result = result.filter((p) => {
        const textToSearch = `${p.name} ${p.code || ''} ${JSON.stringify(p.specTables || '')}`.toLowerCase();
        if (selectedCap === 'under-1t') {
          return (
            textToSearch.includes('300') ||
            textToSearch.includes('500') ||
            textToSearch.includes('0.3t') ||
            textToSearch.includes('0.5t') ||
            textToSearch.includes('light weight') ||
            textToSearch.includes('light duty')
          );
        }
        if (selectedCap === '1t-3t') {
          return (
            textToSearch.includes('1000') ||
            textToSearch.includes('1500') ||
            textToSearch.includes('2000') ||
            textToSearch.includes('3000') ||
            textToSearch.includes('1 ton') ||
            textToSearch.includes('2 ton') ||
            textToSearch.includes('3 ton') ||
            textToSearch.includes('1t') ||
            textToSearch.includes('2t') ||
            textToSearch.includes('3t')
          );
        }
        if (selectedCap === 'over-3t') {
          return (
            textToSearch.includes('heavy duty') ||
            textToSearch.includes('5000') ||
            textToSearch.includes('10000') ||
            textToSearch.includes('5 ton') ||
            textToSearch.includes('10 ton') ||
            textToSearch.includes('5t') ||
            textToSearch.includes('10t')
          );
        }
        return true;
      });
    }

    // Custom built filter
    if (customBuiltOnly) {
      result = result.filter(
        (p) =>
          (p.notes && p.notes.length > 0) ||
          p.name.toLowerCase().includes('custom') ||
          (p.code && p.code.toLowerCase().includes('custom'))
      );
    }

    // Search query using Fuse.js
    if (searchQuery.trim()) {
      const fuse = new Fuse(result, {
        keys: ['name', 'code', 'category.name', 'description'],
        threshold: 0.35
      });
      result = fuse.search(searchQuery).map((r) => r.item);
    }

    // Sort order
    if (selectedSort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      result.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    }

    return result;
  }, [allProducts, activeCategorySlug, selectedCap, customBuiltOnly, searchQuery, selectedSort]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length));
  };

  // Active filters count for mobile badge
  const activeFiltersCount = (selectedCap !== 'all' ? 1 : 0) + (customBuiltOnly ? 1 : 0) + (activeCategorySlug !== 'all' ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-[#F3F5F8] text-[#0B1220]">
      <Helmet>
        <title>Industrial Lifting & Material Handling Equipment Catalog | Hydrelex Lift Systems</title>
        <meta
          name="description"
          content="Explore Chennai's complete range of hydraulic scissor lifts, aerial access platforms, goods lifts, dock levelers, pallet trucks, and custom lifting systems."
        />
      </Helmet>

      {/* -------------------------------------------------------------
          PAGE BAND: 160px on mobile, 200px on desktop
      ------------------------------------------------------------- */}
      <PageBand
        title="Industrial Equipment Catalog"
        subtitle="27 heavy-duty hydraulic lifting and material handling systems engineered in Chennai."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam('q', localSearch.trim() || null);
          }}
          className="relative max-w-xl mx-auto w-full mt-4"
        >
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              updateParam('q', e.target.value.trim() || null);
            }}
            placeholder="Search models..."
            className="w-full h-11 pl-10 pr-20 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white placeholder-white/50 text-[15px] focus:outline-none focus:border-white focus:bg-white/15 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {localSearch && (
            <button
              type="button"
              onClick={() => {
                setLocalSearch('');
                updateParam('q', null);
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full bg-white text-[#0E1A33] text-[11px] font-semibold hover:bg-white/90 transition-colors"
          >
            Search
          </button>
        </form>
      </PageBand>

      {/* -------------------------------------------------------------
          MOBILE HORIZONTAL CATEGORY SCROLL-SNAP ROW (< 1024px)
      ------------------------------------------------------------- */}
      <div className="lg:hidden bg-white border-b border-[#E3E8F0] px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2 snap-x">
        <button
          onClick={() => updateParam('category', null)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold snap-start transition-all ${
            activeCategorySlug === 'all'
              ? 'bg-[#2A62C9] text-white shadow-xs'
              : 'bg-[#F3F5F8] text-[#374151] hover:bg-[#E5E9F0]'
          }`}
        >
          All Equipment ({allProducts.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParam('category', cat.slug)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium snap-start transition-all ${
              activeCategorySlug === cat.slug
                ? 'bg-[#2A62C9] text-white font-semibold shadow-xs'
                : 'bg-[#F3F5F8] text-[#374151] hover:bg-[#E5E9F0]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------------
          MAIN CONTAINER: SIDEBAR + RESULTS
      ------------------------------------------------------------- */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR (Desktop >= 1024px): 280px width, sticky-pane */}
          <aside
            className="hidden lg:block w-[280px] shrink-0 sticky-pane space-y-6"
            style={{
              maxHeight: 'calc(100dvh - var(--sticky-top) - 24px)',
              overflowY: 'auto'
            }}
          >
            {/* Categories */}
            <div className="space-y-1">
              <div className="text-[12px] font-mono uppercase tracking-wider text-[#6B7685] px-3 py-1 font-semibold">
                Categories
              </div>
              <button
                onClick={() => updateParam('category', null)}
                className={`w-full h-10 px-3 rounded-xl transition-colors flex items-center justify-between text-[14px] ${
                  activeCategorySlug === 'all'
                    ? 'font-semibold text-[#2A62C9] bg-[#EBF1F9]'
                    : 'text-[#0B1220] hover:bg-[#E9F0FA]/50'
                }`}
              >
                <span>All Equipment</span>
                <span className="text-[11px] font-mono opacity-70">{allProducts.length}</span>
              </button>
              {categories.map((cat) => {
                const totalCount =
                  (cat.products?.length || 0) +
                  (cat.children?.reduce((acc: number, ch: any) => acc + (ch.products?.length || 0), 0) || 0);
                return (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`w-full h-10 px-3 rounded-xl transition-colors flex items-center justify-between text-[14px] ${
                      activeCategorySlug === cat.slug
                        ? 'font-semibold text-[#2A62C9] bg-[#EBF1F9]'
                        : 'text-[#0B1220] hover:bg-[#E9F0FA]/50'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[11px] font-mono opacity-70">
                      {totalCount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Capacity Filter */}
            <div className="pt-4 border-t border-[#E3E8F0] space-y-2">
              <div className="text-[12px] font-mono uppercase tracking-wider text-[#6B7685] px-3 py-1 font-semibold flex items-center justify-between">
                <span>Capacity</span>
                <select
                  value={selectedCap}
                  onChange={(e) => updateParam('cap', e.target.value)}
                  className="opacity-0 w-1 h-1 pointer-events-auto absolute"
                  tabIndex={-1}
                  aria-label="Filter by capacity"
                >
                  <option value="all">All Capacities</option>
                  <option value="under-1t">Under 1 Ton</option>
                  <option value="1t-3t">1 Ton – 3 Tons</option>
                  <option value="over-3t">Over 3 Tons</option>
                </select>
              </div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'All Capacities' },
                  { id: 'under-1t', label: 'Under 1 Ton (< 1000 Kgs)' },
                  { id: '1t-3t', label: '1 Ton – 3 Tons' },
                  { id: 'over-3t', label: 'Over 3 Tons (> 3000 Kgs)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateParam('cap', opt.id)}
                    className={`w-full h-9 px-3 rounded-xl transition-colors flex items-center gap-2.5 text-[13px] ${
                      selectedCap === opt.id
                        ? 'font-semibold text-[#2A62C9] bg-[#EBF1F9]'
                        : 'text-[#0B1220] hover:bg-[#E9F0FA]/50'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedCap === opt.id ? 'border-[#2A62C9] bg-[#2A62C9]' : 'border-[#6B7685]'
                      }`}
                    >
                      {selectedCap === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Built Toggle */}
            <div className="pt-4 border-t border-[#E3E8F0]">
              <label className="flex items-center gap-2.5 cursor-pointer text-[13px] font-medium text-[#0B1220] px-3 py-1">
                <input
                  type="checkbox"
                  checked={customBuiltOnly}
                  onChange={(e) => updateParam('custom', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 rounded text-[#2A62C9] border-[#E3E8F0] focus:ring-0"
                />
                <span>Custom Built Available</span>
              </label>
            </div>
          </aside>

          {/* MAIN RESULTS COLUMN */}
          <main className="flex-1 w-full space-y-5 min-w-0">
            {/* Sticky Results Bar (56px) */}
            <div className="results-bar">
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button (< 1024px) */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white border border-[#E3E8F0] text-[13px] font-semibold text-[#0B1220] shadow-xs"
                >
                  <Filter className="w-3.5 h-3.5 text-[#2A62C9]" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#2A62C9] text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                <div className="text-[13px] sm:text-[14px] text-[#6B7685]">
                  Showing <strong className="text-[#0B1220]">{displayedProducts.length}</strong> of{' '}
                  <strong className="text-[#0B1220]">{filteredProducts.length}</strong> equipment
                </div>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedSort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-white border border-[#E3E8F0] text-[12px] sm:text-[13px] rounded-full px-3 py-1.5 text-[#0B1220] focus:outline-none shadow-xs"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* PRODUCT GRID: Responsive auto-fill */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="h-[360px] rounded-[24px] bg-white animate-pulse border border-[#E3E8F0]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[28px] p-12 text-center border border-[#E3E8F0] space-y-4">
                <h3 className="text-[18px] font-semibold text-[#0B1220]">No equipment matches your filters</h3>
                <p className="text-[14px] text-[#6B7685] max-w-sm mx-auto">
                  Try adjusting your search terms or clearing capacity filters.
                </p>
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="px-6 py-2.5 rounded-full bg-[#0E1A33] text-white text-[13px] font-semibold hover:bg-black transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Mobile < 480px: 1 column of horizontal cards */}
                <div className="block min-[480px]:hidden space-y-3">
                  {displayedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} horizontal={true} />
                  ))}
                </div>

                {/* Tablet 480-767: 2 columns vertical cards */}
                {/* Desktop 768-1023: 3 columns */}
                {/* Desktop >= 1024: 3-4 columns auto-fill */}
                <div
                  className="hidden min-[480px]:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
                >
                  {displayedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} horizontal={false} />
                  ))}
                </div>
              </>
            )}

            {/* Show 12 More Button Full Width */}
            {hasMore && (
              <div className="pt-6 pb-4">
                <button
                  onClick={loadMore}
                  className="w-full h-[48px] rounded-full bg-white border border-[#E3E8F0] shadow-sm hover:bg-[#F8FAFC] text-[#0B1220] font-semibold text-[14px] transition-all flex items-center justify-center gap-2"
                >
                  <span>Show 12 More Models</span>
                  <span className="text-[#6B7685] font-normal text-xs">
                    ({filteredProducts.length - visibleCount} remaining)
                  </span>
                </button>
                <div ref={sentinelRef} className="h-2 w-full" />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS BOTTOM SHEET (< 1024px) per Part E3 */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden">
          <div className="bg-white rounded-t-[32px] p-6 max-h-[90dvh] overflow-y-auto space-y-6 shadow-2xl">
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-[#E3E8F0]">
              <h3 className="text-[18px] font-semibold text-[#0B1220]">Filter Equipment</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-[#6B7685] hover:text-[#0B1220]"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-2.5">
                Categories
              </h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateParam('category', null)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${
                    activeCategorySlug === 'all'
                      ? 'bg-[#2A62C9] text-white'
                      : 'bg-[#F3F5F8] text-[#0B1220]'
                  }`}
                >
                  All ({allProducts.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.slug)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${
                      activeCategorySlug === cat.slug
                        ? 'bg-[#2A62C9] text-white'
                        : 'bg-[#F3F5F8] text-[#0B1220]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Filter */}
            <div className="pt-4 border-t border-[#E3E8F0]">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-2.5">
                Capacity
              </h4>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All Capacities' },
                  { id: 'under-1t', label: 'Under 1 Ton (< 1000 Kgs)' },
                  { id: '1t-3t', label: '1 Ton – 3 Tons' },
                  { id: 'over-3t', label: 'Over 3 Tons (> 3000 Kgs)' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateParam('cap', opt.id)}
                    className={`w-full h-10 px-3.5 rounded-xl transition-colors flex items-center justify-between text-[13px] ${
                      selectedCap === opt.id
                        ? 'font-semibold text-[#2A62C9] bg-[#EBF1F9]'
                        : 'text-[#0B1220] bg-[#F8FAFC]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedCap === opt.id && <Check className="w-4 h-4 text-[#2A62C9]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Built */}
            <div className="pt-4 border-t border-[#E3E8F0]">
              <label className="flex items-center gap-3 cursor-pointer text-[14px] font-medium text-[#0B1220] py-1">
                <input
                  type="checkbox"
                  checked={customBuiltOnly}
                  onChange={(e) => updateParam('custom', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 rounded text-[#2A62C9] border-[#E3E8F0] focus:ring-0"
                />
                <span>Custom Built Available</span>
              </label>
            </div>

            {/* Apply and Clear All Buttons */}
            <div className="pt-4 border-t border-[#E3E8F0] flex gap-3">
              <button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-full border border-[#E3E8F0] text-[13px] font-semibold text-[#0B1220] hover:bg-[#F8FAFC]"
              >
                Clear all
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-full bg-[#2A62C9] hover:bg-[#1E4FA8] text-white text-[13px] font-semibold shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
