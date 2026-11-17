import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, BasketItem } from '../store/useAppStore';
import { toast } from 'sonner';
import { Button } from './architectural/Button';
import { Columns, ShoppingBag, X } from 'lucide-react';

interface SelectionBottomTrayProps {
  selectedItems: BasketItem[];
  onClear: () => void;
}

export const SelectionBottomTray: React.FC<SelectionBottomTrayProps> = ({ selectedItems, onClear }) => {
  const addToBasket = useAppStore((state) => state.addToBasket);
  const addToCompare = useAppStore((state) => state.addToCompare);
  const setCompareDialogOpen = useAppStore((state) => state.setCompareDialogOpen);

  if (selectedItems.length === 0) return null;

  const handleAddAllToEnquiry = () => {
    selectedItems.forEach((item) => addToBasket(item));
    toast.success(`Added ${selectedItems.length} items to enquiry list`);
    onClear();
  };

  const handleCompareAll = () => {
    let added = 0;
    selectedItems.forEach((item) => {
      if (addToCompare(item)) added++;
    });
    setCompareDialogOpen(true);
    onClear();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#15191E] text-white px-5 py-3 border border-[#D5CFC5]/40 flex items-center gap-6 rounded-none elevation-2"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-2 py-0.5 bg-[#1F4E96] text-white font-semibold">
            {selectedItems.length}
          </span>
          <span className="font-body text-xs text-[#D5CFC5]">selected</span>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCompareAll}
            className="inline-flex items-center gap-1.5 text-xs font-body font-medium hover:text-[#1F4E96] transition-colors cursor-pointer"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          <button
            type="button"
            onClick={handleAddAllToEnquiry}
            className="inline-flex items-center gap-1.5 text-xs font-body font-medium hover:text-[#1F4E96] transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Enquiry</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-1 text-[#7C8794] hover:text-white transition-colors cursor-pointer ml-2"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
