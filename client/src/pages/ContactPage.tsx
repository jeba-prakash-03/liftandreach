import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { submitEnquiry, getCaptcha } from '../services/api';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/architectural/Button';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();

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
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        captchaToken: captcha.token,
        captchaAnswer: formData.captchaAnswer
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        captchaAnswer: ''
      });
      fetchNewCaptcha();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          'Failed to send enquiry. Please verify the anti-spam sum and try again.'
      );
      fetchNewCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#F6F4F0] min-h-screen text-[#15191E] pb-32">
      <Helmet>
        <title>Contact Engineering | Lift and Reach Equipments</title>
        <meta
          name="description"
          content="Contact Lift and Reach Equipments in Chennai for industrial hydraulic equipment inquiries, custom lifting proposals, and technical service support."
        />
      </Helmet>

      {/* Header */}
      <section
        className="w-full bg-[#E8E4DD] border-b border-[#D5CFC5]"
        style={{ padding: '48px var(--pad-x) 40px var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto space-y-3">
          <p className="text-[12px] font-mono text-[#7C8794] m-0">
            Technical Consultation & Inquiries
          </p>
          <h1
            className="font-heading text-[#15191E] m-0 font-semibold leading-[1.15] tracking-[-0.01em]"
            style={{ fontSize: 'var(--fs-h1)' }}
          >
            Contact Our Works
          </h1>
          <p className="font-body text-[15px] text-[#3A424C] max-w-2xl leading-[1.6] m-0">
            Speak directly with our mechanical and hydraulic design team in Chennai regarding specifications, customization limits, or after-sales servicing.
          </p>
        </div>
      </section>

      {/* 7.2 SPLIT SCREEN (FORM ON LEFT, CONTACT DETAILS ON RIGHT) */}
      <section
        className="w-full border-b border-[#D5CFC5]"
        style={{ padding: 'var(--section-y) var(--pad-x)' }}
      >
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Engineering Enquiry Form (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-[#D5CFC5] space-y-4">
            <div className="space-y-1">
              <span className="text-[12px] font-mono text-[#7C8794] block font-semibold">
                Technical RFQ
              </span>
              <h2
                className="font-heading text-[#15191E] m-0 font-semibold"
                style={{ fontSize: 'var(--fs-h2)' }}
              >
                Send an Enquiry
              </h2>
            </div>

            {success ? (
              <div className="p-6 bg-[#E8E4DD] border border-[#D5CFC5] space-y-3">
                <div className="flex items-center gap-2 text-[#1F4E96]">
                  <CheckCircle className="w-5 h-5 stroke-[1.25]" />
                  <span className="font-medium text-sm">Enquiry transmitted successfully</span>
                </div>
                <p className="font-body text-xs text-[#3A424C] leading-relaxed">
                  Thank you. Your message has been sent to our sales and technical team. We will review your application requirements and respond promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="text-xs font-medium text-[#1F4E96] hover:underline pt-2 block"
                >
                  Send another message &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-body flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#C8202F]" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full py-2.5 px-0 border-b border-[#D5CFC5] focus:border-[#1F4E96] bg-transparent text-sm font-body text-[#15191E] rounded-none focus:outline-hidden transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full py-2.5 px-0 border-b border-[#D5CFC5] focus:border-[#1F4E96] bg-transparent text-sm font-mono text-[#15191E] rounded-none focus:outline-hidden transition-colors"
                      placeholder="+91..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full py-2.5 px-0 border-b border-[#D5CFC5] focus:border-[#1F4E96] bg-transparent text-sm font-mono text-[#15191E] rounded-none focus:outline-hidden transition-colors"
                      placeholder="name@company.com"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
                      Equipment Category / Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full py-2.5 px-0 border-b border-[#D5CFC5] focus:border-[#1F4E96] bg-transparent text-sm font-body text-[#15191E] rounded-none focus:outline-hidden transition-colors"
                      placeholder="e.g. Scissor Lift 2 Ton"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
                    Operating Requirements & Specifications *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full py-2.5 px-0 border-b border-[#D5CFC5] focus:border-[#1F4E96] bg-transparent text-sm font-body text-[#15191E] rounded-none focus:outline-hidden resize-y transition-colors"
                    placeholder="Specify target capacity, stroke height, platform dimensions, power type (AC/DC/Manual), and site constraints..."
                  />
                </div>

                {/* Anti-spam Math Verification */}
                <div className="p-4 bg-[#F6F4F0] border border-[#D5CFC5] flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#7C8794] block">
                      Verification Question
                    </span>
                    <span className="font-mono text-sm font-bold text-[#15191E]">
                      {captcha ? `${captcha.question} = ?` : 'Loading question...'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      required
                      value={formData.captchaAnswer}
                      onChange={(e) => setFormData({ ...formData, captchaAnswer: e.target.value })}
                      placeholder="Answer"
                      className="w-24 px-3 py-1.5 bg-white border border-[#D5CFC5] rounded-[2px] text-xs font-mono text-center focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={fetchNewCaptcha}
                      className="p-1.5 text-[#7C8794] hover:text-[#15191E]"
                      title="New Question"
                    >
                      <RefreshCw className="w-4 h-4 stroke-[1.25]" />
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="w-full sm:w-auto"
                >
                  {submitting ? 'Transmitting...' : 'Transmit Enquiry'}
                </Button>
              </form>
            )}
          </div>

          {/* Right: Address, Phones, Email in Large Light Type (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.08em] text-[#7C8794] block">
                Works Address
              </span>
              <div className="font-heading text-2xl font-light text-[#15191E] leading-relaxed">
                {settings.address || 'No.419/9-1, Pillaiyar Koil Street, Kuthambakkam, Chennai - 600124, Tamil Nadu'}
              </div>
            </div>

            <div className="space-y-4 border-t border-[#D5CFC5] pt-8">
              <span className="text-xs font-mono uppercase tracking-[0.08em] text-[#7C8794] block">
                Telephone & Direct Wire
              </span>
              <div className="space-y-2 font-mono text-xl sm:text-2xl text-[#15191E] font-light">
                <div>
                  <a href="tel:918939359592" className="hover:text-[#1F4E96] transition-colors">
                    (+91) 89393 59592
                  </a>
                </div>
                <div>
                  <a href="tel:919789397504" className="hover:text-[#1F4E96] transition-colors">
                    (+91) 97893 97504
                  </a>
                </div>
                {/* Note: Contact page on old site also listed (+91) 80729 30749 preserved in checklist */}
                <div className="text-sm text-[#7C8794] pt-1">
                  Alternate / Service line: (+91) 80729 30749
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-[#D5CFC5] pt-8">
              <span className="text-xs font-mono uppercase tracking-[0.08em] text-[#7C8794] block">
                Electronic Mail
              </span>
              <div className="font-mono text-lg sm:text-xl text-[#1F4E96]">
                <a href={`mailto:${settings.email || 'liftnreach@gmail.com'}`} className="hover:underline">
                  {settings.email || 'liftnreach@gmail.com'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.3 FULL-WIDTH GOOGLE MAP IN GRAYSCALE WITH "OPEN IN MAPS" LINK */}
      <section className="w-full px-6 sm:px-12 lg:px-20 pt-16">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#D5CFC5] pb-3">
            <span className="text-xs font-mono uppercase tracking-[0.08em] text-[#7C8794]">
              Location Elevation & Maps
            </span>
            <a
              href="https://maps.google.com/?q=Kuthambakkam+Chennai+600124"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1F4E96] hover:underline"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[1.25]" />
            </a>
          </div>

          <div className="w-full h-[400px] border border-[#D5CFC5] bg-[#E8E4DD] overflow-hidden grayscale contrast-125">
            <iframe
              title="Lift and Reach Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15545.92244222046!2d80.01538626977539!3d13.068305700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528a4787d6e469%3A0xe54dd0a5d519b5c3!2sKuthambakkam%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
