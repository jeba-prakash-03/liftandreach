import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import * as Slider from '@radix-ui/react-slider';
import { useApp } from '../context/AppContext';
import { useAppStore, BasketItem } from '../store/useAppStore';
import { getProducts, getProductBySlug } from '../services/api';
import { Product } from '../types';
import { Helmet } from 'react-helmet-async';
import { ProductFigure } from '../components/architectural/ProductFigure';
import { SelectionBottomTray } from '../components/SelectionBottomTray';
import { parseModelCodes, formatSpecValue } from '../utils/formatters';
import { toast } from 'sonner';
import {
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  Table as TableIcon,
  ArrowRight,
  Eye,
  Columns,
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { category: routeCategory, sub: routeSub } = useParams<{ category?: string; sub?: string }>();
  const { categories } = useApp();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Zustand Store
  const addToBasket = useAppStore((state) => state.addToBasket);
  const addToCompare = useAppStore((state) => state.addToCompare);
  const setQuickViewProductSlug = useAppStore((state) => state.setQuickViewProductSlug);
  const setCompareDialogOpen = useAppStore((state) => state.setCompareDialogOpen);

  // URL State
  const activeCategorySlug = routeCategory || searchParams.get('category') || 'all';
  const activeSubSlug = routeSub || searchParams.get('sub') || '';
  const searchQuery = searchParams.get('q') || '';
  const selectedIndustry = searchParams.get('industry') || 'all';
  const selectedCap = searchParams.get('cap') || 'all';
  const selectedSort = searchParams.get('sort') || 'recommended';
  const customBuiltOnly = searchParams.get('custom') === 'true';

  // Capacity Slider State (0 to 25 Tons)
  const [capacityRange, setCapacityRange] = useState<[number, number]>([0, 25]);

  // View state: 'list' (default) | 'grid' | 'table'
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'table'>(() => {
    try {
      const saved = localStorage.getItem('architectural_catalog_view');
      if (saved === 'grid' || saved === 'list' || saved === 'table') return saved;
    } catch {}
    return 'list';
  });

  const handleSetViewMode = (mode: 'list' | 'grid' | 'table') => {
    setViewMode(mode);
    try {
      localStorage.setItem('architectural_catalog_view', mode);
    } catch {}
  };

  const [selectedForBatch, setSelectedForBatch] = useState<number[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input (120ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 120);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products with TanStack Query
  const { data: allProducts = [], isLoading: loading } = useQuery({
    queryKey: ['products', activeCategorySlug, selectedIndustry],
    queryFn: () =>
      getProducts({
        category: activeCategorySlug !== 'all' ? activeCategorySlug : undefined,
        industry: selectedIndustry !== 'all' ? selectedIndustry : undefined
      }),
    staleTime: 1000 * 60 * 5
  });

  // Prefetch product details on row hover (200ms intent delay)
  const hoverTimeoutRef = useRef<Record<string, any>>({});
  const handlePrefetchOnHover = (slug: string, image?: string) => {
    if (hoverTimeoutRef.current[slug]) clearTimeout(hoverTimeoutRef.current[slug]);
    hoverTimeoutRef.current[slug] = setTimeout(() => {
      queryClient.prefetchQuery({
        queryKey: ['product', slug],
        queryFn: () => getProductBySlug(slug),
        staleTime: 1000 * 60 * 5
      });
      if (image) {
        const img = new Image();
        img.src = image;
      }
    }, 200);
  };

  const handleCancelPrefetch = (slug: string) => {
    if (hoverTimeoutRef.current[slug]) {
      clearTimeout(hoverTimeoutRef.current[slug]);
    }
  };

  const currentCategory = categories.find((c) => c.slug === activeCategorySlug);
  const currentSub = currentCategory?.children?.find((s) => s.slug === activeSubSlug);

  // Fuzzy search with Fuse.js & filtering
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (activeSubSlug) {
      result = result.filter((p) => p.category?.slug === activeSubSlug);
    }

    if (customBuiltOnly) {
      result = result.filter(
        (p) =>
          p.notes?.some((n) => n.toLowerCase().includes('custom')) ||
          p.name.toLowerCase().includes('custom') ||
          (p.shortDesc && p.shortDesc.toLowerCase().includes('custom'))
      );
    }

    // Capacity Slider / Cap filter
    if (selectedCap !== 'all') {
      result = result.filter((p) => {
        const str = JSON.stringify(p.specTables || '') + ' ' + (p.code || '');
        if (selectedCap === 'under-1t') {
          return str.includes('300') || str.includes('350') || str.includes('500') || str.includes('750') || str.includes('800');
        } else if (selectedCap === '1t-3t') {
          return str.includes('1 TON') || str.includes('1000') || str.includes('1.5T') || str.includes('2 TON') || str.includes('2000') || str.includes('2.5T') || str.includes('3 TON');
        } else if (selectedCap === 'over-3t') {
          return str.includes('9000') || str.includes('10000') || str.includes('12000') || str.includes('10 TON') || str.includes('20T') || str.includes('25 TON');
        }
        return true;
      });
    }

    // Fuzzy matching
    if (debouncedSearch.trim()) {
      const fuse = new Fuse(result, {
        keys: ['name', 'code', 'shortDesc', 'description', 'applications'],
        threshold: 0.35,
        includeMatches: true
      });
      result = fuse.search(debouncedSearch).map((r) => r.item);
    }

    // Sorting
    if (selectedSort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [allProducts, activeSubSlug, customBuiltOnly, selectedCap, debouncedSearch, selectedSort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === 'false' || value === 'recommended') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const toggleBatchSelect = (id: number) => {
    setSelectedForBatch((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const extractProductSpecs = (p: Product) => {
    let capacity: string | undefined;
    let maxHeight: string | undefined;
    let platform: string | undefined;

    if (p.specTables && p.specTables.length > 0) {
      const table = p.specTables[0];
      const capRow = table.rows.find((r) => r.label.toUpperCase().includes('CAPACITY'));
      if (capRow && capRow.values.length > 0) {
        const v = capRow.values.filter(Boolean);
        capacity = v.length > 1 ? formatSpecValue(`${v[0]} - ${v[v.length - 1]}`, 'capacity') : formatSpecValue(v[0], 'capacity');
      }

      const htRow = table.rows.find(
        (r) => r.label.toUpperCase().includes('RAISED') || r.label.toUpperCase().includes('HEIGHT')
      );
      if (htRow && htRow.values.length > 0) {
        const v = htRow.values.filter(Boolean);
        maxHeight = v.length > 1 ? formatSpecValue(`${v[0]} - ${v[v.length - 1]}`, 'height') : formatSpecValue(v[0], 'height');
      }

      const platRow = table.rows.find(
        (r) => r.label.toUpperCase().includes('PLATFORM') || r.label.toUpperCase().includes('TABLE SIZE') || r.label.toUpperCase().includes('DIMENSION')
      );
      if (platRow && platRow.values.length > 0) {
        const v = platRow.values.filter(Boolean);
        platform = v.length > 1 ? formatSpecValue(`${v[0]} - ${v[v.length - 1]}`, 'dimension') : formatSpecValue(v[0], 'dimension');
      }
    }

    return { capacity, maxHeight, platform };
  };

  // Group products for grid view
  const groupedProducts = useMemo(() => {
    const map = new Map<string, { cat: any; items: Product[] }>();
    for (const p of filteredProducts) {
      const catName = p.category?.parent?.name || p.category?.name || 'Hydraulic Systems';
      if (!map.has(catName)) {
        map.set(catName, { cat: p.category?.parent || p.category, items: [] });
      }
      map.get(catName)!.items.push(p);
    }
    return Array.from(map.entries());
  }, [filteredProducts]);

  const selectedObjects: BasketItem[] = filteredProducts
    .filter((p) => selectedForBatch.includes(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      slug: p.slug,
      image: p.images?.[0] || null,
      categoryName: p.category?.name
    }));

  return (
    <div className="w-full bg-[#F6F4F0] min-h-screen text-[#15191E] pb-24">
      <Helmet>
        <title>
          {currentCategory
            ? `${currentCategory.name} | Equipment Catalog | Lift and Reach`
            : 'Products | Hydraulic Equipment Catalog | Lift and Reach Equipments'}
        </title>
      </Helmet>

      {/* Header */}
      <section
        className="w-full bg-[#F6F4F0] border-b border-[#D5CFC5]"
        style={{ padding: '24px var(--pad-x) 20px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-2">
          <div className="flex items-center gap-2 font-body text-[13px] text-[#7C8794]">
            <Link to="/" className="hover:text-[#15191E] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#15191E] transition-colors">Products</Link>
            {currentCategory && (
              <>
                <span>/</span>
                <span className="text-[#15191E] font-medium">{currentCategory.name}</span>
              </>
            )}
            {currentSub && (
              <>
                <span>/</span>
                <span className="text-[#1F4E96] font-medium">{currentSub.name}</span>
              </>
            )}
          </div>

          <div className="flex items-baseline justify-between">
            <h1
              className="font-heading text-[#15191E] m-0 font-semibold leading-[1.15] tracking-[-0.01em]"
              style={{ fontSize: 'var(--fs-h1)' }}
            >
              {currentCategory ? currentCategory.name : 'Products'}
            </h1>
            <span className="font-mono text-xs text-[#7C8794] tabular-nums" aria-live="polite">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'model' : 'models'}
            </span>
          </div>

          <p className="font-body text-[15px] text-[#3A424C] m-0 max-w-3xl leading-[1.5]">
            {currentCategory?.description ||
              'Standard hydraulic material handling equipment and custom-built lifts and aerial access platforms.'}
          </p>
        </div>
      </section>

      {/* STICKY FILTER BAR (gains hairline + e1 shadow when stuck) */}
      <section
        className="sticky top-[76px] z-30 w-full bg-[#E8E4DD] border-b border-[#D5CFC5] elevation-1"
        style={{ padding: '8px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-3 min-h-[40px]">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            {/* Search Input with Debounce */}
            <div className="relative min-w-[180px] max-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C8794]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => updateParam('q', e.target.value)}
                placeholder="Search models..."
                className="w-full h-[40px] pl-9 pr-3 bg-white border border-[#D5CFC5] rounded-none text-[13px] font-body text-[#15191E] focus:outline-hidden focus:border-[#1F4E96]"
              />
              {searchQuery && (
                <button
                  onClick={() => updateParam('q', '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7C8794] hover:text-[#15191E]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={activeCategorySlug}
              onChange={(e) => updateParam('category', e.target.value)}
              className="h-[40px] px-3 bg-white border border-[#D5CFC5] rounded-none text-[13px] font-body text-[#15191E] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Capacity Dropdown */}
            <select
              value={selectedCap}
              onChange={(e) => updateParam('cap', e.target.value)}
              className="h-[40px] px-3 bg-white border border-[#D5CFC5] rounded-none text-[13px] font-body text-[#15191E] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All capacities</option>
              <option value="under-1t">Under 1 ton (&lt; 1000 kg)</option>
              <option value="1t-3t">Medium (1 – 3 ton)</option>
              <option value="over-3t">Heavy Duty (&gt; 3 ton)</option>
            </select>

            {/* Custom Built Checkbox */}
            <label className="inline-flex items-center gap-2 text-[13px] font-body text-[#3A424C] cursor-pointer pl-1 whitespace-nowrap">
              <input
                type="checkbox"
                checked={customBuiltOnly}
                onChange={(e) => updateParam('custom', e.target.checked ? 'true' : 'false')}
                className="w-4 h-4 rounded-none text-[#1F4E96] focus:ring-0 cursor-pointer"
              />
              <span>Custom-built</span>
            </label>

            {/* Sort */}
            <select
              value={selectedSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="h-[40px] px-3 bg-white border border-[#D5CFC5] rounded-none text-[13px] font-body text-[#15191E] focus:outline-hidden cursor-pointer"
            >
              <option value="recommended">Sort: Default</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>

            {(searchQuery || activeCategorySlug !== 'all' || selectedCap !== 'all' || customBuiltOnly || selectedSort !== 'recommended') && (
              <button
                onClick={clearAllFilters}
                className="text-[13px] font-body text-[#1F4E96] hover:underline cursor-pointer whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* View Toggles (List | Grid | Table) */}
          <div className="flex items-center gap-1.5 shrink-0 border-l border-[#D5CFC5] pl-3">
            <button
              onClick={() => handleSetViewMode('list')}
              className={`h-[40px] px-3 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 text-[13px] font-body ${
                viewMode === 'list'
                  ? 'bg-[#15191E] text-[#F6F4F0]'
                  : 'bg-white text-[#7C8794] hover:text-[#15191E] border border-[#D5CFC5]'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden sm:inline">List</span>
            </button>

            <button
              onClick={() => handleSetViewMode('grid')}
              className={`h-[40px] px-3 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 text-[13px] font-body ${
                viewMode === 'grid'
                  ? 'bg-[#15191E] text-[#F6F4F0]'
                  : 'bg-white text-[#7C8794] hover:text-[#15191E] border border-[#D5CFC5]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => handleSetViewMode('table')}
              className={`h-[40px] px-3 rounded-none transition-colors cursor-pointer flex items-center gap-1.5 text-[13px] font-body ${
                viewMode === 'table'
                  ? 'bg-[#15191E] text-[#F6F4F0]'
                  : 'bg-white text-[#7C8794] hover:text-[#15191E] border border-[#D5CFC5]'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog with Layout animations */}
      <main
        className="w-full pt-6"
        style={{ paddingLeft: 'var(--pad-x)', paddingRight: 'var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto">
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[80px] w-full bg-[#E8E4DD] animate-shimmer" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="font-heading text-xl font-medium text-[#3A424C]">
                No equipment found matching criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm font-medium text-[#1F4E96] hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : viewMode === 'list' ? (
            /* DEFAULT LIST VIEW with Quick Actions on Hover & Layout Transitions */
            <div className="border border-[#D5CFC5] bg-white">
              <div
                className="hidden lg:grid items-center bg-[#E8E4DD] border-b border-[#D5CFC5] py-2.5 px-4 font-mono text-[12px] uppercase tracking-[0.04em] text-[#3A424C] font-semibold"
                style={{
                  gridTemplateColumns: '40px 88px 1.4fr 1.2fr 130px 150px 180px 110px',
                  gap: '12px'
                }}
              >
                <div className="text-center">Sel</div>
                <div>Photo</div>
                <div>Equipment Name</div>
                <div>Model Codes</div>
                <div>Capacity</div>
                <div>Max Height</div>
                <div>Platform Size</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#D5CFC5]">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => {
                    const specs = extractProductSpecs(p);
                    const detailUrl = p.category?.parent
                      ? `/products/${p.category.parent.slug}/${p.category.slug}/${p.slug}`
                      : `/products/${p.category?.slug || 'equipment'}/${p.slug}`;
                    const codes = parseModelCodes(p.code);
                    const categoryName = p.category?.name || 'Equipment';
                    const isChecked = selectedForBatch.includes(p.id);

                    return (
                      <motion.div
                        key={p.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => handlePrefetchOnHover(p.slug, p.images?.[0])}
                        onMouseLeave={() => handleCancelPrefetch(p.slug)}
                        className="group flex flex-col lg:grid items-start lg:items-center py-2.5 px-4 hover:bg-[#F6F4F0] transition-colors min-h-[80px]"
                        style={{
                          gridTemplateColumns: '40px 88px 1.4fr 1.2fr 130px 150px 180px 110px',
                          gap: '12px'
                        }}
                      >
                        {/* Checkbox */}
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBatchSelect(p.id)}
                            className="w-4 h-4 rounded-none text-[#1F4E96] focus:ring-0 cursor-pointer"
                            aria-label={`Select ${p.name}`}
                          />
                        </div>

                        {/* 88px Thumbnail */}
                        <Link to={detailUrl} className="w-[88px] h-[66px] bg-[#E8E4DD] shrink-0 flex items-center justify-center p-1 overflow-hidden border border-[#D5CFC5]/60">
                          <img
                            src={p.images?.[0] || '/images/product/scissor lift.jpg'}
                            alt={p.name}
                            width={88}
                            height={66}
                            className="max-w-[90%] max-h-[90%] object-contain mix-blend-multiply transition-opacity duration-250"
                          />
                        </Link>

                        {/* Equipment Name */}
                        <div className="space-y-0.5 min-w-0">
                          <Link
                            to={detailUrl}
                            className="font-heading text-[#15191E] m-0 font-semibold leading-[1.35] group-hover:text-[#1F4E96] transition-colors block truncate no-underline"
                            style={{ fontSize: 'var(--fs-h3)' }}
                          >
                            {p.name}
                          </Link>
                          <span
                            className="font-body text-[#7C8794] block leading-tight"
                            style={{ fontSize: 'var(--fs-micro)' }}
                          >
                            {categoryName}
                          </span>
                        </div>

                        {/* Model Codes on separate lines */}
                        <div className="font-mono text-[12px] text-[#7C8794] space-y-0.5 leading-snug">
                          {codes.map((code, idx) => (
                            <div key={idx} className="whitespace-normal">
                              {code}
                            </div>
                          ))}
                        </div>

                        {/* Capacity */}
                        <div className="font-body text-[14px] text-[#15191E] tabular-nums">
                          <span className="lg:hidden text-[11px] text-[#7C8794] block">Capacity:</span>
                          {specs.capacity || '—'}
                        </div>

                        {/* Max Height */}
                        <div className="font-body text-[14px] text-[#15191E] tabular-nums">
                          <span className="lg:hidden text-[11px] text-[#7C8794] block">Max Height:</span>
                          {specs.maxHeight || '—'}
                        </div>

                        {/* Platform */}
                        <div className="font-body text-[14px] text-[#15191E] tabular-nums">
                          <span className="lg:hidden text-[11px] text-[#7C8794] block">Platform:</span>
                          {specs.platform || '—'}
                        </div>

                        {/* Quick Action Icons: Quick View, Compare, Enquiry */}
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => setQuickViewProductSlug(p.slug)}
                            className="p-1.5 text-[#3A424C] hover:text-[#1F4E96] hover:bg-white border border-transparent hover:border-[#D5CFC5] rounded-none cursor-pointer"
                            title="Quick view drawer"
                            aria-label={`Quick view ${p.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (addToCompare({
                                id: p.id,
                                name: p.name,
                                code: p.code,
                                slug: p.slug,
                                image: p.images?.[0] || null,
                                categoryName: p.category?.name
                              })) {
                                toast.success(`Added ${p.name} to compare`);
                              } else {
                                toast.info('Maximum 4 models allowed in compare');
                              }
                              setCompareDialogOpen(true);
                            }}
                            className="p-1.5 text-[#3A424C] hover:text-[#1F4E96] hover:bg-white border border-transparent hover:border-[#D5CFC5] rounded-none cursor-pointer"
                            title="Add to compare"
                            aria-label={`Compare ${p.name}`}
                          >
                            <Columns className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              addToBasket({
                                id: p.id,
                                name: p.name,
                                code: p.code,
                                slug: p.slug,
                                image: p.images?.[0] || null,
                                categoryName: p.category?.name
                              });
                              toast.success(`Added ${p.name} to enquiry list`);
                            }}
                            className="p-1.5 text-[#3A424C] hover:text-[#1F4E96] hover:bg-white border border-transparent hover:border-[#D5CFC5] rounded-none cursor-pointer"
                            title="Add to enquiry list"
                            aria-label={`Add ${p.name} to enquiry`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="space-y-12">
              {groupedProducts.map(([catName, group]) => (
                <section key={catName} className="space-y-4">
                  <div className="border-b border-[#D5CFC5] pb-2 flex items-baseline justify-between">
                    <h2
                      className="font-heading text-[#15191E] m-0 font-semibold"
                      style={{ fontSize: 'var(--fs-h2)' }}
                    >
                      {catName}
                    </h2>
                    <span className="font-mono text-[12px] text-[#7C8794]">
                      {group.items.length} {group.items.length === 1 ? 'model' : 'models'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {group.items.map((product) => (
                      <ProductFigure
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        code={product.code}
                        slug={product.slug}
                        categorySlug={product.category?.slug}
                        parentCategorySlug={product.category?.parent?.slug}
                        image={product.images?.[0] || '/images/product/scissor lift.jpg'}
                        specs={extractProductSpecs(product)}
                        isChecked={selectedForBatch.includes(product.id)}
                        onToggleCheck={() => toggleBatchSelect(product.id)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="overflow-x-auto border border-[#D5CFC5] bg-white">
              <table className="w-full text-left border-collapse text-[14px]">
                <thead>
                  <tr className="bg-[#E8E4DD] border-b border-[#D5CFC5] font-mono text-[12px] text-[#3A424C] uppercase tracking-[0.04em] sticky top-0">
                    <th className="py-2.5 px-3 w-10 text-center">Sel</th>
                    <th className="py-2.5 px-3 font-semibold">Model Code</th>
                    <th className="py-2.5 px-3 font-semibold">Equipment Name</th>
                    <th className="py-2.5 px-3 font-semibold">Capacity</th>
                    <th className="py-2.5 px-3 font-semibold">Max Height</th>
                    <th className="py-2.5 px-3 font-semibold">Platform Size</th>
                    <th className="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D5CFC5] font-body text-[#15191E]">
                  {filteredProducts.map((product) => {
                    const specs = extractProductSpecs(product);
                    const isChecked = selectedForBatch.includes(product.id);
                    const detailUrl = product.category?.parent
                      ? `/products/${product.category.parent.slug}/${product.category.slug}/${product.slug}`
                      : `/products/${product.category?.slug || 'equipment'}/${product.slug}`;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-[#F6F4F0] transition-colors cursor-pointer group"
                      >
                        <td
                          className="py-2 px-3 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBatchSelect(product.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded-none text-[#1F4E96] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-2 px-3 font-mono text-[12px] text-[#1F4E96] font-medium whitespace-nowrap">
                          {product.code || '—'}
                        </td>

                        <td className="py-2 px-3 font-medium text-[#15191E]">
                          <Link to={detailUrl} className="hover:underline text-inherit no-underline">
                            {product.name}
                          </Link>
                        </td>

                        <td className="py-2 px-3 font-body text-[13px] text-[#3A424C] tabular-nums">
                          {specs.capacity || '—'}
                        </td>

                        <td className="py-2 px-3 font-body text-[13px] text-[#3A424C] tabular-nums">
                          {specs.maxHeight || '—'}
                        </td>

                        <td className="py-2 px-3 font-body text-[13px] text-[#3A424C] tabular-nums">
                          {specs.platform || '—'}
                        </td>

                        <td className="py-2 px-3 text-right">
                          <Link
                            to={detailUrl}
                            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1F4E96] hover:underline"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Floating Selection Bottom Tray */}
      <SelectionBottomTray
        selectedItems={selectedObjects}
        onClear={() => setSelectedForBatch([])}
      />
    </div>
  );
};
