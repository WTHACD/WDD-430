"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, formatCategory } from '@/lib/categories';

export default function ProductForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [stock, setStock] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = { name, description, price, stock, category };
      if (imageUrl) payload.imageUrl = imageUrl;

      const res = await fetch('/api/seller/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Unable to create');
        setLoading(false);
        return;
      }
      setName(''); setDescription(''); setPrice(''); setImageUrl(''); setCategory('OTHER'); setStock('0');
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
        <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </div>
      <div className="form-group">
        <label>Image URL</label>
        <input className="input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {/** Use shared categories list so filters and dashboard stay in sync */}
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{formatCategory(c)}</option>
            ))}
        </select>
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
