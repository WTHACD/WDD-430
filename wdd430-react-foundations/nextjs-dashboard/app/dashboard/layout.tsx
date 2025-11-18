import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Protect the dashboard routes on the server: if there's no authenticated
  // user, redirect to the login page. This ensures unauthenticated users
  // cannot access `/dashboard` by typing the URL.
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
