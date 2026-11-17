import React, { useState } from 'react';
import { useBasket } from '../context/BasketContext';
import { useApp } from '../context/AppContext';
import { submitEnquiry, getCaptcha } from '../services/api';
import {
  X,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export const EnquiryBasketDrawer: React.FC = () => {
  const { basket, removeFromBasket, clearBasket, isBasketOpen, setIsBasketOpen } = useBasket();
  const { settings } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    captchaAnswer: ''
  });

  const [captcha, setCaptcha] = useState<{ token: string; question: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCaptcha = async () => {
    try {
      const res = await getCaptcha();
      setCaptcha(res);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    if (isBasketOpen) {
      fetchCaptcha();
      setSubmitted(false);
      setErrorMsg(null);
    }
  }, [isBasketOpen]);

  if (!isBasketOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha) return;

    setSubmitting(true);
    setErrorMsg(null);

    const productNames = basket.map((b) => `${b.name} (${b.code || 'N/A'})`).join(', ');

    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Multi-Product Quote Enquiry: ${basket.length} Items`,
        message: `Items requested:\n${productNames}\n\nCustomer message:\n${formData.message}`,
        productIds: basket.map((b) => b.id),
        captchaToken: captcha.token,
        captchaAnswer: formData.captchaAnswer
      });
      setSubmitted(true);
      clearBasket();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit enquiry. Please try again.');
      fetchCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Hello Lift and Reach Equipments, I would like to request a quote for the following equipment:\n${basket
    .map((b, i) => `${i + 1}. ${b.name} (Code: ${b.code || 'N/A'})`)
    .join('\n')}`;

  const whatsappUrl = `https://wa.me/${settings.whatsapp || '918939359592'}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-[#1A2E4C] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#E53935]" />
            <h3 className="font-heading font-bold text-base">Enquiry Basket</h3>
            <span className="bg-[#E53935] text-white text-xs px-2 py-0.5 rounded-full font-bold ml-1">
              {basket.length}
            </span>
          </div>
          <button
            onClick={() => setIsBasketOpen(false)}
            className="p-1 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
              <h4 className="font-heading font-bold text-lg text-slate-900">
                Enquiry Dispatched!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed px-4">
                Your multi-product enquiry has been forwarded directly to Lift and Reach sales engineers. We will prepare your comprehensive quote and respond promptly.
              </p>
              <button
                onClick={() => setIsBasketOpen(false)}
                className="px-6 py-2 bg-[#2F5FA8] text-white text-xs font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          ) : basket.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <div className="font-heading font-bold text-sm text-slate-600">
                Your Enquiry Basket is Empty
              </div>
              <p className="text-xs">
                Browse our product catalog and click "Add to Enquiry Basket" on any equipment.
              </p>
            </div>
          ) : (
            <>
              {/* Product Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pb-1 border-b">
                  <span>Selected Equipment</span>
                  <button
                    onClick={clearBasket}
                    className="text-[#E53935] hover:underline text-[11px]"
                  >
                    Clear All
                  </button>
                </div>

                {basket.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white p-1 border border-slate-200 shrink-0 overflow-hidden">
                      <img
                        src={item.image || '/images/product/scissor lift.jpg'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 truncate">{item.name}</div>
                      {item.code && (
                        <div className="text-[10px] font-mono text-slate-500">{item.code}</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromBasket(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Remove from basket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Combined Enquiry Form */}
              <form onSubmit={handleSubmit} className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Submit Collective Quotation Request
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#2F5FA8]"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email <span className="text-[#E53935]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#2F5FA8]"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#2F5FA8]"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Requirements & Site Parameters <span className="text-[#E53935]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-hidden focus:border-[#2F5FA8]"
                    placeholder="Describe lifting capacity, pit depth, or specific cycle requirements..."
                  />
                </div>

                {/* Anti-Spam verification */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span>Anti-spam:</span>
                    <span className="font-mono font-bold text-xs text-[#2F5FA8]">
                      {captcha?.question || '...'}
                    </span>
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.captchaAnswer}
                    onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                    placeholder="Answer"
                    className="w-20 px-2 py-1 border rounded text-center font-bold text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#E53935] hover:bg-[#C62828] text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Send Collective Enquiry ({basket.length} Items)</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Instant WhatsApp Option */}
              <div className="pt-2 text-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>Or send this list via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
