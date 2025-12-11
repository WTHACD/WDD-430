'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import EditBio from './EditBio';

export default function BioSection({ artisanId, initialBio }: { artisanId: string; initialBio?: string }) {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);

  const isOwner = session?.user?.id === artisanId;

  return (
    <div>
      {!editing ? (
        <div>
          <p style={{ color: '#444' }}>{initialBio ? initialBio : 'You have not added a biography yet.'}</p>
          {isOwner && (
            <div style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setEditing(true)}>Edit bio</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <EditBio artisanId={artisanId} initialBio={initialBio} onSaved={() => setEditing(false)} />
          <div style={{ marginTop: 8 }}>
            <button className="btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
