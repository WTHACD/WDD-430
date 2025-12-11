import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  // Optionally extend User if used elsewhere
  interface User {
    id: string;
    role: string;
  }
}
