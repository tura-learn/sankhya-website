import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { ReactLenis } from 'lenis/react';
// The public site's faces and sheet (Tura's design): Baloo 2 for the wordmark,
// Averia Serif Libre for display, Roboto Flex for everything else.
import '@fontsource/baloo-2/700.css';
import '@fontsource/averia-serif-libre/latin-300.css';
import '@fontsource/averia-serif-libre/latin-300-italic.css';
import '@fontsource-variable/roboto-flex/wght.css';
import '@/site/styles/global.css';

import { AboutPage } from '@/site/features/about/AboutPage';
import { MarketingPage } from '@/site/features/marketing/MarketingPage';

/**
 * Two halves in one deployment.
 *
 * The public site is Manu, from Sankhya AI Labs: `/` and `/about`. The account
 * area (`/account/*`) and the privacy policy stay as they were: customers sign
 * in, pay and hand off to the desktop apps there, and the API behind them
 * (`api/`) is unchanged. The account half brings its own Tailwind sheet and is
 * loaded only when it is visited.
 */
const AccountApp = lazy(() => import('@/account/AccountApp').then((module) => ({ default: module.AccountApp })));

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);

const TITLES: Record<string, string> = {
  '/': 'Manu · The case diary that reads the court for you',
  '/about': 'About · Manu, from Sankhya AI Labs',
};

function isAccountPath(pathname: string) {
  return pathname === '/account' || pathname.startsWith('/account/') || pathname === '/privacy';
}

/**
 * The two halves style the page globally (Tailwind's reset on one side, the
 * site's sheet on the other), so moving between them inside the app would
 * leave both sheets applied. Crossing over is a fresh load instead.
 */
function useHalfBoundary(accountHalf: boolean) {
  const first = useRef(accountHalf);
  useEffect(() => {
    if (accountHalf !== first.current) window.location.reload();
  }, [accountHalf]);
}

/** A new page on the site starts at its top and says which page it is in the tab. */
function useSitePageChange(pathname: string, hash: string, active: boolean) {
  useEffect(() => {
    if (!active) return;
    document.title = TITLES[pathname] ?? TITLES['/'];
    if (!hash) window.scrollTo(0, 0);
  }, [active, pathname, hash]);
}

function Opening() {
  return (
    <main style={{ display: 'grid', minHeight: '100vh', placeItems: 'center', background: '#f0ede6' }}>
      <img src="/assets/sankhya-logo.png" alt="" width="36" height="36" />
    </main>
  );
}

function App() {
  const { pathname, hash } = useLocation();
  const accountHalf = isAccountPath(pathname);
  useHalfBoundary(accountHalf);
  useSitePageChange(pathname, hash, !accountHalf);

  return (
    <>
      {accountHalf ? (
        <Suspense fallback={<Opening />}>
          <AccountApp />
        </Suspense>
      ) : (
        <Routes>
          <Route path="/about" element={<ReactLenis root options={{ lerp: 0.085, smoothWheel: true }}><AboutPage /></ReactLenis>} />
          <Route path="/" element={<ReactLenis root options={{ lerp: 0.085, smoothWheel: true }}><MarketingPage /></ReactLenis>} />
          {/* The old product and blog pages are gone; their addresses land on the home page. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
      {LOCAL_HOSTNAMES.has(window.location.hostname) ? null : <Analytics />}
    </>
  );
}

export default App;
