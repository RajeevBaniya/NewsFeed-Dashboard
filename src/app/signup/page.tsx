'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/auth-provider';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const { user, loading, signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace('/feed');
  }, [loading, user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email.trim(), password, name.trim());
      router.replace('/feed');
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || 'Failed to sign up';
      setError(message);
    }
  };

  if (loading) return <main className="p-6">Loading…</main>;

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-gray-50 dark:bg-gray-900">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Create account</h1>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <input
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2 font-medium">Sign up</button>
      </form>
    </main>
  );
}


