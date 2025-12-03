"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductItem({ product }: { product: any }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(String(product.price ?? '0'));
  const [stock, setStock] = useState(String(product.stock ?? '0'));
  const [imageUrl, setImageUrl] = useState(product.images?.[0] ?? '');
  const [category, setCategory] = useState(product.category ?? 'OTHER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/seller/product/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = { name, description, price, stock, category };
      if (imageUrl) payload.imageUrl = imageUrl;
      const res = await fetch(`/api/seller/product/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Update failed');
        setLoading(false);
        return;
      }
      setEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="product-card">
      <div className={imageUrl ? "card-image has-image" : "card-image"} style={{ backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined }}></div>
      <div className="card-content">
        {!editing ? (
          <>
            <span className="category">{product.category}</span>
            <h3 className="product-title">{product.name}</h3>
            <p className="artisan">by {product.artisan?.name ?? 'You'}</p>
            <div className="card-footer">
              <span className="price">${Number(product.price).toFixed(2)}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setEditing(true)}>Edit</button>
                <button className="btn" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Price</label>
                <input className="input" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div style={{ width: 120 }}>
                <label>Stock</label>
                <input className="input" value={stock} onChange={e => setStock(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input className="input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              <button type="button" className="btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
        )}
      </div>
    </article>
  );
}
