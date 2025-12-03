"use client";

import React, { useState } from 'react';

type Props = {
  value?: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
};

export default function StarRating({ value = 0, onChange, readOnly = false, size = 22 }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div role={readOnly ? undefined : 'radiogroup'} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {stars.map((s) => {
        const active = (hover ?? value) >= s;
        const color = active ? '#FFC107' : '#ddd';
        const style: React.CSSProperties = {
          fontSize: size,
          lineHeight: 1,
          color,
          transition: 'color 120ms ease',
          cursor: readOnly ? 'default' : 'pointer',
          background: 'transparent',
          border: 'none',
          padding: 0,
        };

        if (readOnly) {
          return (
            <span key={s} aria-hidden style={style}>
              ★
            </span>
          );
        }

        return (
          <button
            key={s}
            type="button"
            aria-label={`${s} star`}
            onClick={() => onChange?.(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(null)}
            style={style}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
