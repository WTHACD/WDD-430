'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function EditBio({ artisanId, initialBio, onSaved }: { artisanId: string; initialBio?: string; onSaved?: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bio, setBio] = useState(initialBio ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = session?.user?.id === artisanId;
  if (!isOwner) return null;

  async function save() {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/artisan/${artisanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Failed to save');
        setSaving(false);
        return;
      }
      // call optional callback then refresh the page to show updated bio
      try { onSaved && onSaved(); } catch (e) {}
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'Request failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }} htmlFor="bio">About / Biography</label>
      <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={6} style={{ width: '100%', padding: 8, borderRadius: 6 }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <button className="btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <div style={{ color: '#666' }}>{bio.length} chars</div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </div>
    </div>
  );
}
