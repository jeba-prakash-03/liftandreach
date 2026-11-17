import { create } from 'zustand';

export interface BasketItem {
  id: number;
  name: string;
  code: string | null;
  slug: string;
  image: string | null;
  categoryName?: string;
}

interface AppStoreState {
  // Enquiry basket
  basketItems: BasketItem[];
  addToBasket: (item: BasketItem) => void;
  removeFromBasket: (id: number) => BasketItem | undefined;
  restoreBasketItem: (item: BasketItem) => void;
  clearBasket: () => void;
  isEnquiryDrawerOpen: boolean;
  setEnquiryDrawerOpen: (open: boolean) => void;
  badgeBump: boolean;
  triggerBadgeBump: () => void;

  // Compare
  compareItems: BasketItem[];
  addToCompare: (item: BasketItem) => boolean;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isCompareDialogOpen: boolean;
  setCompareDialogOpen: (open: boolean) => void;

  // Quick view drawer
  quickViewProductSlug: string | null;
  setQuickViewProductSlug: (slug: string | null) => void;

  // Quote modal
  quoteModalData: { id?: number; name?: string; code?: string | null } | null;
  openQuoteModal: (data?: { id?: number; name?: string; code?: string | null }) => void;
  closeQuoteModal: () => void;

  // Navigation / Loading state
  isNavigating: boolean;
  setNavigating: (val: boolean) => void;
}

const loadPersisted = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const savePersisted = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  basketItems: loadPersisted<BasketItem[]>('lar_enquiry_basket', []),
  addToBasket: (item) => {
    const current = get().basketItems;
    if (current.some((x) => x.id === item.id)) return;
    const next = [...current, item];
    savePersisted('lar_enquiry_basket', next);
    set({ basketItems: next, badgeBump: true });
    setTimeout(() => set({ badgeBump: false }), 400);
  },
  removeFromBasket: (id) => {
    const current = get().basketItems;
    const target = current.find((x) => x.id === id);
    const next = current.filter((x) => x.id !== id);
    savePersisted('lar_enquiry_basket', next);
    set({ basketItems: next });
    return target;
  },
  restoreBasketItem: (item) => {
    const current = get().basketItems;
    if (current.some((x) => x.id === item.id)) return;
    const next = [...current, item];
    savePersisted('lar_enquiry_basket', next);
    set({ basketItems: next });
  },
  clearBasket: () => {
    savePersisted('lar_enquiry_basket', []);
    set({ basketItems: [] });
  },
  isEnquiryDrawerOpen: false,
  setEnquiryDrawerOpen: (open) => set({ isEnquiryDrawerOpen: open }),
  badgeBump: false,
  triggerBadgeBump: () => {
    set({ badgeBump: true });
    setTimeout(() => set({ badgeBump: false }), 400);
  },

  compareItems: loadPersisted<BasketItem[]>('lar_compare_items', []),
  addToCompare: (item) => {
    const current = get().compareItems;
    if (current.length >= 4) return false;
    if (current.some((x) => x.id === item.id)) return false;
    const next = [...current, item];
    savePersisted('lar_compare_items', next);
    set({ compareItems: next });
    return true;
  },
  removeFromCompare: (id) => {
    const next = get().compareItems.filter((x) => x.id !== id);
    savePersisted('lar_compare_items', next);
    set({ compareItems: next });
  },
  clearCompare: () => {
    savePersisted('lar_compare_items', []);
    set({ compareItems: [] });
  },
  isCompareDialogOpen: false,
  setCompareDialogOpen: (open) => set({ isCompareDialogOpen: open }),

  quickViewProductSlug: null,
  setQuickViewProductSlug: (slug) => set({ quickViewProductSlug: slug }),

  quoteModalData: null,
  openQuoteModal: (data) => set({ quoteModalData: data || {} }),
  closeQuoteModal: () => set({ quoteModalData: null }),

  isNavigating: false,
  setNavigating: (val) => set({ isNavigating: val })
}));
