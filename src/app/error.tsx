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
    // Log the error to an enterprise error reporting service
    console.error('Enterprise Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 mt-12 bg-surface border border-red-900/50 rounded-2xl max-w-2xl mx-auto shadow-2xl">
      <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6">
        <span className="text-red-500 text-2xl font-bold">!</span>
      </div>
      <h2 className="text-2xl text-white font-bold mb-3 tracking-tight">System Exception</h2>
      <p className="text-neutral-400 max-w-md text-center mb-8">
        We encountered an unexpected error processing your request. Our engineering telemetry has logged this issue.
      </p>
      <div className="flex space-x-4">
        <button
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-red-900/20"
          onClick={() => reset()}
        >
          Attempt Recovery
        </button>
      </div>
    </div>
  );
}
