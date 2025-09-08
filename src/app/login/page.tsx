'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [suggestSignup, setSuggestSignup] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const next = params.get('callbackUrl') || '/feed';
      router.replace(next);
    }
  }, [loading, user, router, params]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      const anyErr = err as { code?: string; message?: string };
      const code = anyErr?.code || anyErr?.message || '';
      if (typeof code === 'string' && (code.includes('auth/invalid-credential') || code.includes('auth/user-not-found'))) {
        setError('We could not find an account with these credentials.');
        setSuggestSignup(true);
      } else {
        const message = anyErr?.message || 'Failed to sign in';
        setError(message);
        setSuggestSignup(false);
      }
    }
  };

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-gray-50 dark:bg-gray-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Sign in</h1>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2" role="alert">
            {error}
            {suggestSignup && (
              <>
                {' '}
                <a className="underline text-red-700" href="/signup">Create an account</a>
              </>
            )}
          </div>
        )}
        <input
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2 font-medium">Sign in</button>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No account? <a className="text-blue-600" href="/signup">Create one</a>
        </p>
      </form>
    </main>
  );
}


