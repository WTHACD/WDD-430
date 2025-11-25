"use client";
import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="btn"
      onClick={() => {
        setLoading(true);
        signOut({ callbackUrl: '/' }).finally(() => setLoading(false));
      }}
      disabled={loading}
    >
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}
