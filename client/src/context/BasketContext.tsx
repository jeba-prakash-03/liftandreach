import React, { createContext, useContext, useEffect, useState } from 'react';
import { EnquiryBasketItem } from '../types/basket';

interface BasketContextType {
  basket: EnquiryBasketItem[];
  addToBasket: (item: EnquiryBasketItem) => void;
  removeFromBasket: (productId: number) => void;
  clearBasket: () => void;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
  isInBasket: (productId: number) => boolean;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const STORAGE_KEY = 'liftandreach_enquiry_basket';

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [basket, setBasket] = useState<EnquiryBasketItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to read basket from localStorage:', e);
      return [];
    }
  });

  const [isBasketOpen, setIsBasketOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    } catch (e) {
      console.error('Failed to save basket to localStorage:', e);
    }
  }, [basket]);

  const addToBasket = (item: EnquiryBasketItem) => {
    setBasket((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsBasketOpen(true);
  };

  const removeFromBasket = (productId: number) => {
    setBasket((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const isInBasket = (productId: number) => {
    return basket.some((i) => i.id === productId);
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        removeFromBasket,
        clearBasket,
        isBasketOpen,
        setIsBasketOpen,
        isInBasket
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used within BasketProvider');
  return ctx;
};
