"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          </ul>
          <div className="nav-actions">
            <Link href="/login" style={{ padding: '12px', color: 'var(--primary)', fontWeight: 500 }}>Log In</Link>
            <Link href="/join" className="btn btn-primary">Join as Artisan</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}