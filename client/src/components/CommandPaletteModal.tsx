import React, { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAppStore } from '../store/useAppStore';
import { Product } from '../types';
import {
  Search,
  Package,
  Layers,
  FileText,
  Phone,
  MessageSquare,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { categories, openQuoteModal } = useApp();
  const setEnquiryDrawerOpen = useAppStore((state) => state.setEnquiryDrawerOpen);
  const [search, setSearch] = useState('');

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products-all'],
    queryFn: () => getProducts(),
    staleTime: 1000 * 60 * 10
  });

  useEffect(() => {
    if (isOpen) setSearch('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectProduct = (p: Product) => {
    const link = p.category?.parent
      ? `/products/${p.category.parent.slug}/${p.category.slug}/${p.slug}`
      : `/products/${p.category?.slug || 'equipment'}/${p.slug}`;
    navigate(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#15191E]/60 backdrop-blur-xs"
      />

      {/* Palette Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.16 }}
        className="relative w-full max-w-xl bg-white border border-[#D5CFC5] shadow-2xl z-10 overflow-hidden rounded-none elevation-3"
      >
        <Command label="Global Command Menu" className="w-full flex flex-col">
          {/* Input Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#D5CFC5] bg-[#F6F4F0]">
            <Search className="w-4 h-4 text-[#7C8794] shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search equipment models, categories, actions..."
              className="w-full bg-transparent border-0 outline-hidden text-[14px] font-body text-[#15191E] placeholder:text-[#7C8794]"
              autoFocus
            />
            <span className="font-mono text-[11px] text-[#7C8794] px-1.5 py-0.5 bg-white border border-[#D5CFC5]">
              ESC
            </span>
          </div>

          {/* Results List */}
          <Command.List className="max-h-[360px] overflow-y-auto p-2 divide-y divide-[#D5CFC5]/40 text-xs font-body">
            <Command.Empty className="py-10 text-center text-[#7C8794]">
              No matching equipment or actions found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Actions" className="py-2 text-[11px] font-mono uppercase tracking-wider text-[#7C8794] px-2">
              <Command.Item
                onSelect={() => {
                  onClose();
                  openQuoteModal();
                }}
                className="flex items-center justify-between p-2 hover:bg-[#E8E4DD] rounded-none cursor-pointer text-[#15191E]"
              >
                <div className="flex items-center gap-2.5 font-body text-xs">
                  <FileText className="w-4 h-4 text-[#1F4E96]" />
                  <span>Request a Custom Quote</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C8794]" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onClose();
                  setEnquiryDrawerOpen(true);
                }}
                className="flex items-center justify-between p-2 hover:bg-[#E8E4DD] rounded-none cursor-pointer text-[#15191E]"
              >
                <div className="flex items-center gap-2.5 font-body text-xs">
                  <ShoppingBag className="w-4 h-4 text-[#1F4E96]" />
                  <span>Open Enquiry List</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C8794]" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  window.open('tel:918939359592', '_self');
                  onClose();
                }}
                className="flex items-center justify-between p-2 hover:bg-[#E8E4DD] rounded-none cursor-pointer text-[#15191E]"
              >
                <div className="flex items-center gap-2.5 font-body text-xs">
                  <Phone className="w-4 h-4 text-[#1F4E96]" />
                  <span>Call Works (+91 89393 59592)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#7C8794]" />
              </Command.Item>
            </Command.Group>

            {/* Products Group */}
            <Command.Group heading="Equipment Models" className="py-2 text-[11px] font-mono uppercase tracking-wider text-[#7C8794] px-2">
              {products.slice(0, 8).map((p) => (
                <Command.Item
                  key={p.id}
                  value={`${p.name} ${p.code || ''}`}
                  onSelect={() => handleSelectProduct(p)}
                  className="flex items-center justify-between p-2 hover:bg-[#E8E4DD] rounded-none cursor-pointer text-[#15191E]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.images?.[0] || '/images/product/scissor lift.jpg'}
                      alt={p.name}
                      className="w-8 h-8 object-contain bg-[#E8E4DD] p-0.5 mix-blend-multiply shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-heading text-xs font-semibold text-[#15191E] truncate">
                        {p.name}
                      </div>
                      {p.code && <div className="font-mono text-[10px] text-[#7C8794] truncate">{p.code}</div>}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7C8794]" />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Categories Group */}
            <Command.Group heading="Categories" className="py-2 text-[11px] font-mono uppercase tracking-wider text-[#7C8794] px-2">
              {categories.map((c) => (
                <Command.Item
                  key={c.id}
                  value={c.name}
                  onSelect={() => {
                    navigate(`/products/${c.slug}`);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 hover:bg-[#E8E4DD] rounded-none cursor-pointer text-[#15191E]"
                >
                  <div className="flex items-center gap-2.5 font-body text-xs">
                    <Layers className="w-4 h-4 text-[#7C8794]" />
                    <span>{c.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7C8794]" />
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Palette Footer */}
          <div className="px-4 py-2 border-t border-[#D5CFC5] bg-[#F6F4F0] flex items-center justify-between text-[11px] font-mono text-[#7C8794]">
            <span>Navigate with &uarr; &darr;</span>
            <span>Press Enter to select</span>
          </div>
        </Command>
      </motion.div>
    </div>
  );
};
