
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignOutButton from './SignOutButton';
import { useRouter } from 'next/navigation';

export default function Header({ user }: { user?: any | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: clientSession } = useSession();

  // prefer client session when available to avoid flicker; fall back to server-provided `user`
  const effectiveUser = clientSession?.user ?? user ?? null;
  const isAuthed = !!effectiveUser;
  const isArtisan = effectiveUser?.role === 'ARTISAN' || effectiveUser?.role === 'artisan';

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (!containerRef.current) return;
      if (containerRef.current.contains(target)) return; // inside menu
      if (buttonRef.current && buttonRef.current.contains(target)) return; // clicked hamburger
      setIsMenuOpen(false);
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMenuOpen(false);
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  // Close menu on navigation
  useEffect(() => {
    // next/navigation's router doesn't expose events in the same way as next/router
    // so we use a simple approach: whenever location pathname changes, close menu.
    const onRoute = () => setIsMenuOpen(false);
    window.addEventListener('popstate', onRoute);
    return () => window.removeEventListener('popstate', onRoute);
  }, []);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">Handcrafted Haven</Link>

        <button
          ref={buttonRef}
          className="hamburger"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </button>

        <div ref={containerRef} className={`nav-links-container ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/browse">Browse Catalog</Link></li>
            <li><Link href="/our-story">Our Story</Link></li>
            {isArtisan && <li><Link href="/seller/dashboard">My Shop</Link></li>}
          </ul>
          <div className="nav-actions">
            {!isAuthed ? (
              <>
                <Link href="/signin" style={{ padding: '12px', color: 'var(--primary)', fontWeight: 500 }}>Sign In</Link>
                <Link href="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {effectiveUser?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={effectiveUser.image} alt={effectiveUser.name || 'avatar'} style={{ width: 36, height: 36, borderRadius: 999 }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: 999, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(effectiveUser?.name || effectiveUser?.email || 'U')[0]}</div>
                )}
                <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 140, cursor: 'pointer' }}>
                    <span style={{ fontWeight: 600 }}>{effectiveUser?.name ?? effectiveUser?.email}</span>
                    <span style={{ fontSize: 12, color: '#666' }}>{effectiveUser?.role ?? ''}</span>
                  </div>
                </Link>
                <SignOutButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}