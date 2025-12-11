
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignOutButton from './SignOutButton';

export default function Header({ user }: { user?: any | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: clientSession } = useSession();

  // prefer client session when available to avoid flicker; fall back to server-provided `user`
  const effectiveUser = clientSession?.user ?? user ?? null;
  const isAuthed = !!effectiveUser;
  const isArtisan = effectiveUser?.role === 'ARTISAN' || effectiveUser?.role === 'artisan';

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">Handcrafted Haven</Link>

        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        <div className={`nav-links-container ${isMenuOpen ? 'open' : ''}`}>
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