import React, { createContext, useContext, useEffect, useState } from 'react';
import { SettingsMap, Category } from '../types';
import { getSettings, getCategories } from '../services/api';

interface AppContextType {
  settings: SettingsMap;
  categories: Category[];
  loading: boolean;
  refreshSettings: () => Promise<void>;
  openQuoteModal: (product?: { id: number; name: string; code?: string | null }) => void;
  closeQuoteModal: () => void;
  quoteProduct: { id: number; name: string; code?: string | null } | null;
  isQuoteOpen: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Quote modal state
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<{ id: number; name: string; code?: string | null } | null>(null);

  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([getSettings(), getCategories()]);
      setSettings(s);
      setCategories(c);
    } catch (err) {
      console.error('Failed to load initial settings or categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openQuoteModal = (product?: { id: number; name: string; code?: string | null }) => {
    setQuoteProduct(product || null);
    setIsQuoteOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteOpen(false);
    setQuoteProduct(null);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        categories,
        loading,
        refreshSettings: loadData,
        openQuoteModal,
        closeQuoteModal,
        quoteProduct,
        isQuoteOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
