import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import SignOutButton from '@/app/components/SignOutButton';

export default async function ProfilePage() {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session) {
    return (
      <div style={{ padding: 24 }}>
        <h2>You are not signed in</h2>
        <p>
          Please <Link href="/signin">sign in</Link> to view your profile.
        </p>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="container" style={{ padding: 24 }}>
      <h1>Profile</h1>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12 }}>
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt={user.name || 'avatar'} style={{ width: 96, height: 96, borderRadius: 12 }} />
        ) : (
          <div style={{ width: 96, height: 96, borderRadius: 12, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{(user?.name || user?.email || 'U')[0]}</div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>{user.name ?? user.email}</div>
          <div style={{ color: '#666', marginTop: 4 }}>{user.email}</div>
          <div style={{ marginTop: 8 }}>Role: <strong>{user.role}</strong></div>
          <div style={{ marginTop: 12 }}>
            <SignOutButton />
            {user.role === 'ARTISAN' && (
              <Link href="/seller/dashboard" style={{ marginLeft: 12 }} className="btn">Manage shop</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
