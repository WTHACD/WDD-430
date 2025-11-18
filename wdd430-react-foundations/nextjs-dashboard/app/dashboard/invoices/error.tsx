'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center text-xl font-semibold text-gray-900">
        Uh oh! Something went wrong.
      </h2>
      <p className="mt-4 text-gray-600">
        We&apos;re sorry. There was a problem loading invoices. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400"
      >
        Try again
      </button>
    </main>
  );
}
