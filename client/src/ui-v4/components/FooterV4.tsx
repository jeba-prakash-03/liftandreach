import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FooterV4: React.FC = () => {
  const { categories, settings } = useApp();

  const phone1 = settings.phone_1 || '(+91) 89393 59592';
  const phone2 = settings.phone_2 || '(+91) 97893 97504';
  const phone1Tel = phone1.replace(/[^0-9+]/g, '');
  const phone2Tel = phone2.replace(/[^0-9+]/g, '');
  const email = settings.email || 'liftnreach@gmail.com';
  const address = settings.address || 'No B3-G4, Arakonam Road, Mevallurkuppam village, Sriperumbudur Taluk 602015.';
  const whatsappNum = (settings.whatsapp || '918939359592').replace(/[^0-9]/g, '');
  const udyamNo = settings.udyam_no || 'UDYAM-TN-08-0090275';
  const gstNo = settings.gst_no || '33BNOPK2159N1ZJ';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0E1A33] text-white pt-16 pb-12 px-6 sm:px-12 rounded-t-[36px] relative overflow-hidden mt-12 mb-0">
      {/* Subtle top ambient radial light */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(42,98,201,0.5) 0%, rgba(14,26,51,0) 70%)'
        }}
      />

      <div className="w-full mx-auto relative z-10" style={{ paddingInline: 'var(--pad-x)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
          {/* Col 1 & 2: Brand, identity & contact */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-block" aria-label="Hydrelex Lift Systems Home">
              <img
                src="/images/logo-white-footer.png"
                alt="Hydrelex Lift Systems"
                className="h-[46px] w-auto object-contain"
              />
            </Link>
            <p className="text-[14px] text-white/70 max-w-sm leading-relaxed">
              Hydrelex Lift Systems is a premier hydraulic equipment manufacturing company, located in Sriperumbudur Taluk, Chennai, in the state of Tamil Nadu registered under the laws of 'The Republic of India'.
            </p>

            <div className="space-y-3 pt-2 text-[13px] text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6FA0E8] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#6FA0E8] shrink-0" />
                <div className="space-x-1">
                  <a href={`tel:${phone1Tel}`} className="hover:text-white transition-colors">
                    {phone1}
                  </a>
                  <span>/</span>
                  <a href={`tel:${phone2Tel}`} className="hover:text-white transition-colors">
                    {phone2}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6FA0E8] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="pt-2 text-[11px] font-mono text-white/60 space-y-1">
                <div>GST NO: <span className="text-white/80 font-semibold">{gstNo}</span></div>
                <div>UDYAM: <span className="text-white/80 font-semibold">{udyamNo}</span></div>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Products */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/40 mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-[13px] text-white/75">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products/${cat.slug}`}
                    className="hover:text-white transition-colors inline-block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/40 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[13px] text-white/75">
              <li>
                <Link to="/" className="hover:text-white transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors inline-block">
                  All Equipment
                </Link>
              </li>
              <li>
                <Link to="/find-my-lift" className="hover:text-white transition-colors inline-block">
                  Find-My-Lift Wizard
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="hover:text-white transition-colors inline-block">
                  Enquiry List
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors inline-block">
                  Compare Specs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Working Hours & Support */}
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/40 mb-4">
              Direct Contact
            </h4>
            <div className="text-[13px] text-white/75 space-y-2">
              <p className="font-semibold text-white/90">Hydrelex Lift Systems</p>
              <p className="text-white/60 text-[12px] leading-relaxed">{address}</p>
              <div className="pt-4">
                <a
                  href={`https://wa.me/${whatsappNum}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A62C9] text-white font-medium hover:bg-[#1f4e96] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-white/50">
          <div>
            &copy; {new Date().getFullYear()} Hydrelex Lift Systems. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Chennai, Tamil Nadu, India</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors p-1"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
