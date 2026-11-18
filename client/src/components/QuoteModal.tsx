import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { submitEnquiry, getCaptcha } from '../services/api';
import { X, CheckCircle, AlertCircle, RefreshCw, Send } from 'lucide-react';

export const QuoteModal: React.FC = () => {
  const { isQuoteOpen, closeQuoteModal, quoteProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    captchaAnswer: ''
  });

  const [captcha, setCaptcha] = useState<{ token: string; question: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchNewCaptcha = async () => {
    try {
      const res = await getCaptcha();
      setCaptcha(res);
    } catch (err) {
      console.error('Failed to load anti-spam captcha:', err);
    }
  };

  useEffect(() => {
    if (isQuoteOpen) {
      setSuccess(false);
      setErrorMsg(null);
      fetchNewCaptcha();

      if (quoteProduct) {
        setFormData((prev) => ({
          ...prev,
          subject: `Quote Request: ${quoteProduct.name} ${quoteProduct.code ? `(${quoteProduct.code})` : ''}`,
          message: `Hello,\n\nI would like to request a quotation and technical specification sheet for ${quoteProduct.name} ${quoteProduct.code ? `[Type: ${quoteProduct.code}]` : ''}.\n\nOur application details:\n- Required Capacity:\n- Required Lift Height:\n- Installation Environment:\n\nPlease contact me.`
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          subject: 'Custom Material Handling Equipment Quote',
          message: 'Hello Hydrelex team,\n\nI would like to enquire about your hydraulic lifting solutions.'
        }));
      }
    }
  }, [isQuoteOpen, quoteProduct]);

  if (!isQuoteOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        productId: quoteProduct?.id || null,
        captchaToken: captcha.token,
        captchaAnswer: formData.captchaAnswer
      });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit quote request. Please try again.');
      fetchNewCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-[#1A2E4C] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg">
              {quoteProduct ? `Request Quote: ${quoteProduct.name}` : 'Request a Product Quotation'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Direct factory pricing & custom technical specification
            </p>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <h4 className="text-xl font-bold text-slate-900 font-heading">
                Thank You For Your Enquiry!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your request has been received by Hydrelex Lift Systems sales & engineering team. We will review your application specifications and contact you shortly.
              </p>
              <button
                onClick={closeQuoteModal}
                className="mt-4 px-6 py-2.5 bg-[#2F5FA8] text-white font-semibold rounded-lg text-sm hover:bg-[#1F3F73]"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#2F5FA8] focus:ring-1 focus:ring-[#2F5FA8]"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / Mobile <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#2F5FA8] focus:ring-1 focus:ring-[#2F5FA8]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#2F5FA8] focus:ring-1 focus:ring-[#2F5FA8]"
                  placeholder="contact@company.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Subject <span className="text-[#E53935]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#2F5FA8] focus:ring-1 focus:ring-[#2F5FA8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Requirements & Specifications <span className="text-[#E53935]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#2F5FA8] focus:ring-1 focus:ring-[#2F5FA8]"
                />
              </div>

              {/* Anti-spam math question */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Anti-Spam Verification:</span>
                  <span className="bg-white px-2.5 py-1 rounded border font-mono font-bold text-sm text-[#2F5FA8]">
                    {captcha?.question || 'Loading...'}
                  </span>
                  <button
                    type="button"
                    onClick={fetchNewCaptcha}
                    className="p-1 text-slate-400 hover:text-slate-600"
                    title="Refresh question"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.captchaAnswer}
                  onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                  placeholder="Answer"
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-center font-bold text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeQuoteModal}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#E53935] hover:bg-[#C62828] text-white font-semibold rounded-lg flex items-center gap-2 shadow cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Send Enquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
