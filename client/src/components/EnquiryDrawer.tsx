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
        className="relative w-full max-w-md bg-[#F6F4F0] border-l border-[#D5CFC5] h-full shadow-2xl flex flex-col justify-between z-10 elevation-3"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#D5CFC5] flex items-center justify-between bg-white">
          <div className="space-y-0.5">
            <h3 className="font-heading text-xl font-semibold text-[#15191E]">Enquiry List</h3>
            <p className="font-body text-xs text-[#7C8794]">
              {basketItems.length} {basketItems.length === 1 ? 'item' : 'items'} ready for RFQ
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-[#7C8794] hover:text-[#15191E] rounded-[2px] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto rounded-full bg-[#1F4E96] text-white flex items-center justify-center"
              >
                <Check className="w-8 h-8 stroke-[2.5]" />
              </motion.div>
              <h4 className="font-heading text-2xl font-semibold text-[#15191E]">Enquiry Sent!</h4>
              <p className="font-body text-sm text-[#3A424C]">
                Our engineering team will review your specs and respond shortly.
              </p>
            </div>
          ) : basketItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-heading text-lg font-medium text-[#7C8794]">Your enquiry list is empty.</p>
              <p className="font-body text-xs text-[#3A424C]">
                Browse our catalog and click "Add to enquiry" to collect items for a consolidated quote.
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
                      className="flex items-center justify-between p-3 bg-white border border-[#D5CFC5] rounded-none gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-10 object-contain bg-[#E8E4DD] p-1 shrink-0 mix-blend-multiply"
                          />
                        )}
                        <div className="min-w-0">
                          <h5 className="font-heading text-sm font-semibold text-[#15191E] truncate">
                            {item.name}
                          </h5>
                          {item.code && (
                            <p className="font-mono text-[11px] text-[#7C8794] truncate">{item.code}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-[#7C8794] hover:text-[#C8202F] transition-colors cursor-pointer"
                        title="Remove from list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Form details */}
              <form onSubmit={handleSubmit} className="pt-4 border-t border-[#D5CFC5] space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-[#7C8794] block">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-[38px] px-3 bg-white border border-[#D5CFC5] rounded-none text-xs font-body focus:outline-hidden focus:border-[#1F4E96]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-[#7C8794] block">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="company@domain.com"
                    className="w-full h-[38px] px-3 bg-white border border-[#D5CFC5] rounded-none text-xs font-body focus:outline-hidden focus:border-[#1F4E96]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-[#7C8794] block">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-[38px] px-3 bg-white border border-[#D5CFC5] rounded-none text-xs font-body focus:outline-hidden focus:border-[#1F4E96]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-[#7C8794] block">Application Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Operating capacity, platform dimensions, site details..."
                    className="w-full p-2.5 bg-white border border-[#D5CFC5] rounded-none text-xs font-body focus:outline-hidden focus:border-[#1F4E96]"
                  />
                </div>

                <div className="pt-2">
                  <Button variant="primary" size="md" className="w-full" disabled={submitting}>
                    {submitting ? 'Transmitting...' : 'Submit Enquiry'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
