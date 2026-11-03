// File: src/App.tsx  (fanitt-website)
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav } from '@/components/Nav';
import { ScrollProgress } from '@/components/motion';
import { Footer } from '@/components/Footer';
import Home from '@/pages/Home';
import { AuthProvider } from '@/lib/auth';

const Role = lazy(() => import('@/pages/Role'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const FaqPage = lazy(() => import('@/pages/Faq'));
const Legal = lazy(() => import('@/pages/Legal'));
const NotFound = lazy(() => import('@/pages/NotFound'));
// Website login + buying (used by share links and by iPhone users).
const Login = lazy(() => import('@/pages/Login'));
const OpenLink = lazy(() => import('@/pages/buy/OpenLink'));
const ProPlans = lazy(() => import('@/pages/buy/ProPlans'));
const Account = lazy(() => import('@/pages/buy/Account'));
const DeleteAccount = lazy(() => import('@/pages/buy/DeleteAccount'));

function LegalBySlug() {
  const { slug = '' } = useParams();
  return <Legal slug={slug} />;
}

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ScrollTop />
      <ScrollProgress />
      <Nav />
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/creators" element={<Role role="creators" />} />
            <Route path="/brands" element={<Role role="brands" />} />
            <Route path="/fans" element={<Role role="fans" />} />
            <Route path="/agencies" element={<Role role="agencies" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<Legal slug="privacy-policy" />} />
            <Route path="/terms" element={<Legal slug="terms-of-use" />} />
            <Route path="/refunds" element={<Legal slug="refund-policy" />} />
            <Route path="/legal/:slug" element={<LegalBySlug />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
            <Route path="/pro" element={<ProPlans />} />
            <Route path="/open/:type/:id" element={<OpenLink />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </AuthProvider>
  );
}