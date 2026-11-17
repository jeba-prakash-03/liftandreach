import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { UtilityBar } from './v3/components/UtilityBar';
import { Header } from './v3/components/Header';
import { Footer } from './v3/components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { FloatingWidgets } from './components/FloatingWidgets';
import { LegacyUrlRedirect } from './components/LegacyUrlRedirect';
import { EnquiryDrawer } from './components/EnquiryDrawer';
import { QuickViewDrawer } from './components/QuickViewDrawer';
import { CompareDialog } from './components/CompareDialog';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { FindMyLiftWizard } from './components/FindMyLiftWizard';
import { TopProgressBar } from './components/TopProgressBar';
import { BackToTopButton } from './components/BackToTopButton';
import { PageSkeleton } from './components/PageSkeleton';
import { RouteTransition } from './components/RouteTransition';

// Code-split pages with React.lazy
const HomePage = lazy(() => import('./v3/pages/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
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

const PublicLayout: React.FC<{
  onOpenCommandPalette: () => void;
  onOpenWizard: () => void;
}> = ({ onOpenCommandPalette, onOpenWizard }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between w-full overflow-x-hidden">
      <UtilityBar />
      <Header onOpenCommandPalette={onOpenCommandPalette} onOpenWizard={onOpenWizard} />
      <main className="flex-1 w-full flex flex-col">
        <Suspense fallback={<PageSkeleton />}>
          <RouteTransition>
            <Outlet />
          </RouteTransition>
        </Suspense>
      </main>
      <Footer />
      <QuoteModal />
      <FloatingWidgets />
      <EnquiryDrawer />
      <QuickViewDrawer />
      <CompareDialog />
      <BackToTopButton />
    </div>
  );
};

export const App: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

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
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/design-system" element={<DesignSystemPage />} />

                {/* Product routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:category" element={<ProductsPage />} />
                <Route path="/products/:category/:slug" element={<ProductDetailPage />} />
                <Route path="/products/:category/:sub/:slug" element={<ProductDetailPage />} />

                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<ProductDetailPage />} />
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
    </QueryClientProvider>
  );
};
