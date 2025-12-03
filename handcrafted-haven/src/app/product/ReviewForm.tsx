"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarRating from '@/app/components/StarRating';

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const MAX = 1000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Client-side validation
    if (!rating || rating < 1 || rating > 5) {
      setError('Please select a rating between 1 and 5');
      setLoading(false);
      return;
    }
    const trimmed = comment.trim();
    if (trimmed.length > MAX) {
      setError(`Comment must be at most ${MAX} characters`);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/product/${productId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      if (res.status === 201) {
        setComment('');
        setRating(5);
        router.refresh();
      } else if (res.status === 401) {
        setError('You must be signed in to submit a review.');
      } else if (res.status === 409) {
        setError('You have already reviewed this product.');
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>Rating</label>
        <StarRating value={rating} onChange={(v) => setRating(v)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Comment</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} style={{ width: '100%' }} />
        <div style={{ marginTop: 6, color: '#666', fontSize: 12 }}>{comment.length}/{MAX} characters</div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

      <div>
        <button className="btn" disabled={loading} type="submit">
          {loading ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  );
}
