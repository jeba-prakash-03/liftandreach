import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { submitEnquiry, getCaptcha } from '../../services/api';
import { Helmet } from 'react-helmet-async';
import { PageBand } from '../components/PageBand';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const ContactPageV4: React.FC = () => {
  const { settings } = useApp();

  const phone1 = settings.phone_1 || '(+91) 89393 59592';
  const phone2 = settings.phone_2 || '(+91) 97893 97504';
  const phone1Tel = phone1.replace(/[^0-9+]/g, '');
  const phone2Tel = phone2.replace(/[^0-9+]/g, '');
  const email = settings.email || 'liftnreach@gmail.com';
  const address = settings.address || 'No B3-G4, Arakonam Road, Mevallurkuppam village, Sriperumbudur Taluk 602015.';
  const whatsappNum = (settings.whatsapp || '918939359592').replace(/[^0-9]/g, '');
  const googleMapEmbed = settings.google_map_embed || 'https://www.google.com/maps?q=Kuthambakkam,+Chennai';
  const udyamNo = settings.udyam_no || 'UDYAM-TN-08-0090275';
  const gstNo = settings.gst_no || '33BNOPK2159N1ZJ';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
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
      console.error('Failed to load anti-spam question:', err);
    }
  };

  useEffect(() => {
    fetchNewCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        phone: formData.phone || undefined,
        message: formData.message || '',
        captchaToken: captcha.token,
        captchaAnswer: formData.captchaAnswer
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        phone: '',
        message: '',
        captchaAnswer: ''
      });
      fetchNewCaptcha();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit enquiry.');
      fetchNewCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F3F5F8] text-[#0B1220] min-h-[calc(100vh-80px)] pb-24">
      <Helmet>
        <title>Contact Us | Hydrelex Lift Systems Chennai</title>
        <meta
          name="description"
          content="Get in touch with Hydrelex Lift Systems for industrial hydraulic lifting inquiries, quotes, and facility location."
        />
      </Helmet>

      {/* -------------------------------------------------------------
          PART 6.1 - PAGEBAND WITH ORIGINAL HEADING "Interested in discussing?"
      ------------------------------------------------------------- */}
      <PageBand
        pill="GET IN TOUCH"
        title="Interested in"
        accentWord="discussing?"
        heightClass="min-h-[220px]"
      />

      {/* Content Grid */}
      <div className="w-full mx-auto px-[var(--pad-x)] py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Name*, Email*, Subject*, Phone (opt), Message (opt), Anti-spam */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-8 sm:p-10 shadow-sm border border-[#E3E8F0]">
            <h2 className="text-[20px] font-semibold text-[#0B1220] tracking-tight mb-6">
              Send an Enquiry
            </h2>

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                <div className="text-[13px]">
                  <p className="font-semibold">Your inquiry has been sent successfully.</p>
                  <p className="text-emerald-700/90 mt-0.5">
                    We have received your requirement.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div className="text-[13px]">
                  <p className="font-semibold">Unable to submit inquiry</p>
                  <p className="text-red-700/90 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F5F8] border border-[#E3E8F0] text-[16px] sm:text-[14px] text-[#0B1220] focus:outline-none focus:border-[#2A62C9]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F5F8] border border-[#E3E8F0] text-[16px] sm:text-[14px] text-[#0B1220] focus:outline-none focus:border-[#2A62C9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Equipment Requirement"
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F5F8] border border-[#E3E8F0] text-[16px] sm:text-[14px] text-[#0B1220] focus:outline-none focus:border-[#2A62C9]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 89393 59592"
                    className="w-full h-12 px-4 rounded-xl bg-[#F3F5F8] border border-[#E3E8F0] text-[16px] sm:text-[14px] text-[#0B1220] focus:outline-none focus:border-[#2A62C9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[#6B7685] mb-1.5">
                  Message (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Requirement details..."
                  className="w-full p-4 rounded-xl bg-[#F3F5F8] border border-[#E3E8F0] text-[16px] sm:text-[14px] text-[#0B1220] focus:outline-none focus:border-[#2A62C9]"
                />
              </div>

              {/* Anti-spam math check */}
              {captcha && (
                <div className="p-4 rounded-xl bg-[#F3F5F8] border border-[#E3E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-[#0B1220]">
                    <span className="font-semibold">Anti-spam check:</span>
                    <span>What is {captcha.question}?</span>
                    <button
                      type="button"
                      onClick={fetchNewCaptcha}
                      className="p-1 text-[#6B7685] hover:text-[#0B1220]"
                      title="New question"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.captchaAnswer}
                    onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                    placeholder="Your answer"
                    className="w-28 h-10 px-3 rounded-lg bg-white border border-[#E3E8F0] text-[13px] text-center font-bold focus:outline-none focus:border-[#2A62C9]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#0E1A33] text-white font-semibold text-[14px] hover:bg-black transition-colors shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Send your message'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Three Cards + WhatsApp + Map */}
          <div className="lg:col-span-5 space-y-4">
            {/* Card 1: Our office location */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E3E8F0] space-y-2">
              <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-wider text-[#2A62C9]">
                <MapPin className="w-4 h-4" />
                <span>Our office location</span>
              </div>
              <p className="text-[14px] text-[#0B1220] leading-relaxed">
                {address}
              </p>
              <div className="pt-2 border-t border-[#E3E8F0] text-[11px] font-mono text-[#6B7280] flex flex-wrap gap-x-4 gap-y-1">
                <span>GST: <strong className="text-[#0B1220]">{gstNo}</strong></span>
                <span>UDYAM: <strong className="text-[#0B1220]">{udyamNo}</strong></span>
              </div>
            </div>

            {/* Card 2: Our contact number */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E3E8F0] space-y-2">
              <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-wider text-[#2A62C9]">
                <Phone className="w-4 h-4" />
                <span>Our contact number</span>
              </div>
              <div className="text-[14px] text-[#0B1220] font-medium space-x-2">
                <a href={`tel:${phone1Tel}`} className="hover:text-[#2A62C9]">
                  {phone1}
                </a>
                <span>/</span>
                <a href={`tel:${phone2Tel}`} className="hover:text-[#2A62C9]">
                  {phone2}
                </a>
              </div>
            </div>

            {/* Card 3: Our contact e-mail */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E3E8F0] space-y-2">
              <div className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-wider text-[#2A62C9]">
                <Mail className="w-4 h-4" />
                <span>Our contact e-mail</span>
              </div>
              <p className="text-[14px]">
                <a href={`mailto:${email}`} className="text-[#0B1220] hover:text-[#2A62C9] font-medium">
                  {email}
                </a>
              </p>
            </div>

            {/* WhatsApp Chat Button */}
            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#2A62C9] text-white font-medium text-[13px] hover:bg-[#1e4e96] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp Directly</span>
            </a>

            {/* Map below in rounded 28px frame with an 'Open in Maps' pill */}
            <div className="relative rounded-[28px] overflow-hidden border border-[#E3E8F0] bg-white shadow-sm h-[220px]">
              <iframe
                title="Google Maps Location"
                src={googleMapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=Kuthambakkam,+Chennai+-+600124"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E3E8F0] text-[11px] font-semibold text-[#0B1220] shadow-sm hover:bg-white inline-flex items-center gap-1.5"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3 text-[#2A62C9]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
