import { ChevronDown, Cpu, Menu, NotebookText, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';

import { Brand } from '@/site/components/atoms/Brand';
import { openWaitlist, WaitlistDialog } from '@/site/components/molecules/Waitlist';

/** What Sankhya makes: the diary, and the model under it. */
const PRODUCTS = [
  { to: '/', label: 'Manu', note: 'The case diary that reads the court', icon: NotebookText },
  { to: '/manu-s1', label: 'Manu-S1', note: 'Our fast model for court procedure', icon: Cpu, badge: 'New' },
] as const;

/** Products as a small menu, About, and the waitlist as the pill on the end. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const onProduct = PRODUCTS.some((p) => p.to === pathname);

  useEffect(() => setProducts(false), [pathname]);
  useEffect(() => {
    if (!products) return undefined;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !menu.current?.contains(event.target as Node)) setProducts(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [products]);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Brand />
        <div className="site-nav__links">
          <div className="site-nav__products" ref={menu}>
            <button
              type="button"
              className="site-nav__products-toggle"
              aria-expanded={products}
              aria-current={onProduct ? 'page' : undefined}
              onClick={() => setProducts((v) => !v)}
            >
              Products <ChevronDown size={14} aria-hidden="true" />
            </button>
            {products ? (
              <div className="site-nav__menu" role="menu">
                {PRODUCTS.map(({ to, label, note, icon: Icon, ...rest }) => (
                  <Link key={to} to={to} role="menuitem" className={pathname === to ? 'is-here' : ''}>
                    <span className="site-nav__menu-icon">
                      <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span>
                      <b>
                        {label}
                        {'badge' in rest ? <i>{rest.badge}</i> : null}
                      </b>
                      <small>{note}</small>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link to="/about" aria-current={pathname === '/about' ? 'page' : undefined}>
            About
          </Link>
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
          {PRODUCTS.map(({ to, label, note }) => (
            <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined} onClick={() => setOpen(false)}>
              <span>
                {label} <small>{note}</small>
              </span>
            </Link>
          ))}
          <Link to="/about" aria-current={pathname === '/about' ? 'page' : undefined} onClick={() => setOpen(false)}>
            About
          </Link>
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
