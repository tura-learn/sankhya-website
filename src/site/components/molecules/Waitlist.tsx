import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';

import { cn } from '@/site/lib/cn';

const OPEN_EVENT = 'manu:waitlist';

/** Opens the one waitlist dialog, from anywhere on the page. */
export function openWaitlist() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

type WaitlistButtonProps = {
  children?: ReactNode;
  tone?: 'ink' | 'paper' | 'outline' | 'accent';
  arrow?: boolean;
  className?: string;
};

/** A button in the site's button style that opens the waitlist. */
export function WaitlistButton({ children = 'Join the waitlist', tone = 'ink', arrow = true, className }: WaitlistButtonProps) {
  return (
    <button type="button" className={cn('button-link', `button-link--${tone}`, className)} onClick={openWaitlist}>
      <span>{children}</span>
      {arrow ? <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /> : null}
    </button>
  );
}

type State = 'idle' | 'sending' | 'joined' | 'error';

/** The waitlist: an email, one button, and a plain word back. Mounted once, with the header. */
export function WaitlistDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    const open = () => {
      setState((current) => (current === 'joined' ? current : 'idle'));
      setError('');
      dialog.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, page: window.location.pathname }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not join just now. Try again in a minute.');
      setState('joined');
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <dialog
      ref={dialog}
      className="waitlist"
      aria-labelledby="waitlist-title"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="waitlist__card">
        <button type="button" className="waitlist__close" aria-label="Close" onClick={() => dialog.current?.close()}>
          <X size={18} />
        </button>
        {state === 'joined' ? (
          <div className="waitlist__done">
            <span className="waitlist__tick" aria-hidden="true">
              <Check size={20} strokeWidth={2.4} />
            </span>
            <h2 id="waitlist-title">You’re on the list.</h2>
            <p>We’ll write to {email || 'you'} when Manu opens.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2 id="waitlist-title">Join the waitlist</h2>
            <div className="waitlist__row">
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                placeholder="you@chambers.in"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="button-link button-link--ink" disabled={state === 'sending'}>
                <span>{state === 'sending' ? 'Joining…' : 'Join'}</span>
              </button>
            </div>
            <input
              className="waitlist__trap"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            {error ? <p className="waitlist__error">{error}</p> : null}
          </form>
        )}
      </div>
    </dialog>
  );
}
