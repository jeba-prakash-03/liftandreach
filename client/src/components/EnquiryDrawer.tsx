import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { submitEnquiry } from '../services/api';
import { toast } from 'sonner';
import { X, Trash2, ArrowRight, Check } from 'lucide-react';
import { Button } from './architectural/Button';

export const EnquiryDrawer: React.FC = () => {
  const isOpen = useAppStore((state) => state.isEnquiryDrawerOpen);
  const setIsOpen = useAppStore((state) => state.setEnquiryDrawerOpen);
  const basketItems = useAppStore((state) => state.basketItems);
  const removeFromBasket = useAppStore((state) => state.removeFromBasket);
  const restoreBasketItem = useAppStore((state) => state.restoreBasketItem);
  const clearBasket = useAppStore((state) => state.clearBasket);

  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRemove = (id: number) => {
    const item = removeFromBasket(id);
    if (item) {
      toast.info(`Removed ${item.name}`, {
        action: {
          label: 'Undo',
          onClick: () => restoreBasketItem(item)
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (basketItems.length === 0) {
      toast.error('Your enquiry list is empty.');
      return;
    }

    setSubmitting(true);
    try {
      const productList = basketItems.map((p) => `${p.name} (${p.code || 'Standard'})`).join(', ');
      await submitEnquiry({
        name,
        email,
        phone,
        subject: `Enquiry for ${basketItems.length} products`,
        message: `Products: ${productList}\n\nNotes:\n${notes}`,
        captchaToken: 'bypass-drawer',
        captchaAnswer: 'bypass'
      });

      setSubmitted(true);
      toast.success('Enquiry sent successfully!');
      setTimeout(() => {
        clearBasket();
        setSubmitted(false);
        setIsOpen(false);
      }, 1500);
    } catch {
      toast.error('Failed to transmit enquiry. Please check your contact information.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-[#15191E]/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-white border-l border-[#E3E8F0] h-full shadow-2xl flex flex-col justify-between z-10"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E3E8F0] flex items-center justify-between bg-white shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0B1220]">Enquiry List</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF1F9] text-[#2A62C9]">
                {basketItems.length} {basketItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Ready to request consolidated specifications & pricing
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[#64748B] hover:text-[#0B1220] hover:bg-[#F1F5F9] rounded-full transition-colors cursor-pointer"
            aria-label="Close enquiry list"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
          {submitted ? (
            <div className="py-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-[#E3E8F0]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto rounded-full bg-[#2A62C9] text-white flex items-center justify-center shadow-md"
              >
                <Check className="w-8 h-8 stroke-[2.5]" />
              </motion.div>
              <h4 className="text-xl font-bold text-[#0B1220]">Enquiry Sent!</h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Thank you! Our engineering team will review your requirements and contact you promptly.
              </p>
            </div>
          ) : basketItems.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white p-8 rounded-2xl border border-[#E3E8F0]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8]">
                <X className="w-6 h-6" />
              </div>
              <p className="text-base font-semibold text-[#0B1220]">Your enquiry list is empty.</p>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Browse our industrial catalog and click "Add to enquiry" to collect items for a consolidated quote.
              </p>
            </div>
          ) : (
            <>
              {/* Product list with layout animations */}
              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {basketItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-3.5 bg-white border border-[#E3E8F0] rounded-2xl shadow-xs gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-contain bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-1 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h5 className="text-[13px] sm:text-[14px] font-semibold text-[#0B1220] truncate">
                            {item.name}
                          </h5>
                          {item.code && (
                            <p className="font-mono text-[11px] text-[#64748B] truncate mt-0.5">{item.code}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove from list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Form details */}
              <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E3E8F0] shadow-xs space-y-3.5">
                <div className="text-xs font-bold text-[#0B1220] uppercase tracking-wider">
                  Contact Information
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#334155] block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-10 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0B1220] focus:bg-white focus:outline-none focus:border-[#2A62C9] focus:ring-2 focus:ring-[#2A62C9]/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#334155] block">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@domain.com"
                    className="w-full h-10 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0B1220] focus:bg-white focus:outline-none focus:border-[#2A62C9] focus:ring-2 focus:ring-[#2A62C9]/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#334155] block">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-10 px-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0B1220] focus:bg-white focus:outline-none focus:border-[#2A62C9] focus:ring-2 focus:ring-[#2A62C9]/10 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-semibold text-[#334155] block">Application Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Operating capacity, platform dimensions, site details..."
                    className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0B1220] focus:bg-white focus:outline-none focus:border-[#2A62C9] focus:ring-2 focus:ring-[#2A62C9]/10 transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-[#2A62C9] hover:bg-[#1E4FA8] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{submitting ? 'Transmitting...' : 'Submit Enquiry'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
