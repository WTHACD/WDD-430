"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/seller/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, stock }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Unable to create');
        setLoading(false);
        return;
      }
      setName(''); setDescription(''); setPrice(''); setStock('0');
      setLoading(false);
      // refresh server-rendered data (no function passed from server)
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Server error');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
      <div className="form-group">
        <label>Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input className="input" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="form-group" style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Price</label>
          <input className="input" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div style={{ width: 120 }}>
          <label>Stock</label>
          <input className="input" value={stock} onChange={e => setStock(e.target.value)} />
        </div>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ marginTop: 8 }}>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add product'}</button>
      </div>
    </form>
  );
}
