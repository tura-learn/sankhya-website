import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import { Brand } from '@/site/components/atoms/Brand';
import { openWaitlist, WaitlistDialog } from '@/site/components/molecules/Waitlist';

/** Two pages, and the waitlist as the pill on the end. */
const PAGES = [
  ['Home', '/'],
  ['About', '/about'],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Brand />
        <div className="site-nav__links">
          {PAGES.map(([label, to]) => (
            <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined}>
              {label}
            </Link>
          ))}
          <button type="button" className="site-nav__login" onClick={openWaitlist}>
            Join waitlist
          </button>
        </div>
        <button className="site-nav__toggle" type="button" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>
      {open ? (
        <div className="mobile-menu">
          {PAGES.map(([label, to]) => (
            <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openWaitlist();
            }}
          >
            Join waitlist <span>↗</span>
          </button>
        </div>
      ) : null}
      <WaitlistDialog />
    </header>
  );
}
