import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { UtilityBar } from './v3/components/UtilityBar';
import { Header } from './v3/components/Header';
import { Footer } from './v3/components/Footer';
import { HeaderV4 } from './ui-v4/components/HeaderV4';
import { FooterV4 } from './ui-v4/components/FooterV4';
import { QuoteModal } from './components/QuoteModal';
import { FloatingWidgets } from './components/FloatingWidgets';
import { LegacyUrlRedirect } from './components/LegacyUrlRedirect';
import { EnquiryDrawer } from './components/EnquiryDrawer';
import { QuickViewDrawer } from './components/QuickViewDrawer';
import { CompareDialog } from './components/CompareDialog';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { FindMyLiftWizard } from './components/FindMyLiftWizard';
import { TopProgressBar } from './components/TopProgressBar';
import { PageSkeleton } from './components/PageSkeleton';
import { RouteTransition } from './components/RouteTransition';
import { HeaderToneCtx, Tone } from './ui-v4/hooks/useHeaderTone';

// Code-split pages with React.lazy
const HomePageLegacy = lazy(() => import('./v3/pages/HomePage').then((m) => ({ default: m.HomePage })));
const HomePageV4 = lazy(() => import('./ui-v4/pages/HomeV4').then((m) => ({ default: m.HomeV4 })));
const AboutPageLegacy = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const AboutPageV4 = lazy(() => import('./ui-v4/pages/AboutPageV4').then((m) => ({ default: m.AboutPageV4 })));
const ProductsPageLegacy = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const ProductsPageV4 = lazy(() => import('./ui-v4/pages/ProductsPageV4').then((m) => ({ default: m.ProductsPageV4 })));
const ProductDetailPageLegacy = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const ProductDetailPageV4 = lazy(() => import('./ui-v4/pages/ProductDetailPageV4').then((m) => ({ default: m.ProductDetailPageV4 })));
const ContactPageLegacy = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ContactPageV4 = lazy(() => import('./ui-v4/pages/ContactPageV4').then((m) => ({ default: m.ContactPageV4 })));
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

const isV4 = import.meta.env.VITE_UI_VERSION !== 'legacy';

const PublicLayout: React.FC<{
  onOpenCommandPalette: () => void;
  onOpenWizard: () => void;
}> = ({ onOpenCommandPalette, onOpenWizard }) => {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between w-full overflow-x-clip bg-[#F3F5F8]">
      {!isV4 && <UtilityBar />}
      {isV4 ? (
        <HeaderV4 onOpenCommandPalette={onOpenCommandPalette} onOpenWizard={onOpenWizard} />
      ) : (
        <Header onOpenCommandPalette={onOpenCommandPalette} onOpenWizard={onOpenWizard} />
      )}
      <main className="flex-1 w-full flex flex-col">
        <Suspense fallback={<PageSkeleton />}>
          <RouteTransition>
            <Outlet />
          </RouteTransition>
        </Suspense>
      </main>
      {isV4 ? <FooterV4 /> : <Footer />}
      <QuoteModal />
      <FloatingWidgets />
      <EnquiryDrawer />
      <QuickViewDrawer />
      <CompareDialog />
    </div>
  );
};

export const App: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [headerTone, setHeaderTone] = useState<Tone>('light');

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeaderToneCtx.Provider value={{ tone: headerTone, setTone: setHeaderTone }}>
        <LazyMotion features={domAnimation}>
        <TopProgressBar />
        <LegacyUrlRedirect>
            <Routes>
              {/* Isolated Admin Route */}
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AdminPage />
                  </Suspense>
                }
              />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AdminPage />
                  </Suspense>
                }
              />

              {/* Public Routes with Full App Shell */}
              <Route
                element={
                  <PublicLayout
                    onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                    onOpenWizard={() => setWizardOpen(true)}
                  />
                }
              >
                <Route path="/" element={isV4 ? <HomePageV4 onOpenWizard={() => setWizardOpen(true)} /> : <HomePageLegacy />} />
                <Route path="/about" element={isV4 ? <AboutPageV4 /> : <AboutPageLegacy />} />
                <Route path="/design-system" element={<DesignSystemPage />} />

                {/* Product routes */}
                <Route path="/products" element={isV4 ? <ProductsPageV4 /> : <ProductsPageLegacy />} />
                <Route path="/products/:category" element={isV4 ? <ProductsPageV4 /> : <ProductsPageLegacy />} />
                <Route path="/products/:category/:slug" element={isV4 ? <ProductDetailPageV4 /> : <ProductDetailPageLegacy />} />
                <Route path="/products/:category/:sub/:slug" element={isV4 ? <ProductDetailPageV4 /> : <ProductDetailPageLegacy />} />

                <Route path="/contact" element={isV4 ? <ContactPageV4 /> : <ContactPageLegacy />} />
                <Route path="*" element={isV4 ? <ProductDetailPageV4 /> : <ProductDetailPageLegacy />} />
              </Route>
            </Routes>

            {/* Global Modals */}
            <CommandPaletteModal
              isOpen={commandPaletteOpen}
              onClose={() => setCommandPaletteOpen(false)}
            />
            <FindMyLiftWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />

            {/* Accessible Sonner Toasts */}
            <Toaster position="bottom-right" richColors />
          </LegacyUrlRedirect>
        </LazyMotion>
      </HeaderToneCtx.Provider>
    </QueryClientProvider>
  );
};
