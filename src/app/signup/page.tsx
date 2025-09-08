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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  // Enforce dark mode on this page only
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.add('dark');
    return () => {
      if (!wasDark) root.classList.remove('dark');
    };
  }, []);

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
    <main
      className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 overflow-hidden"
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
      }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-fuchsia-500 to-amber-400 opacity-20 blur-3xl" />

      {/* Aurora sweep */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(60rem 25rem at 85% 70%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(45rem 18rem at 15% 35%, rgba(56,189,248,0.28), transparent 60%), radial-gradient(35rem 16rem at 70% 20%, rgba(244,63,94,0.22), transparent 60%)",
        }}
      />

      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_45%,black,transparent)] bg-black/40" />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-200"
        style={{
          background: `radial-gradient(300px 300px at ${mousePos.x}% ${mousePos.y}%, rgba(59,130,246,0.12), transparent 60%)`,
        }}
      />

      {/* Top feature strip (same as sign-in) */}
      <div className="absolute top-6 inset-x-0 z-10 flex justify-center px-4">
        <div className="pointer-events-none inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] sm:text-sm text-white/90">
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h16M4 14h10"/><circle cx="6" cy="12" r="2"/></svg>
            Gather 4+ sources
          </span>
          <span className="opacity-60">•</span>
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>
            Drag to reorder
          </span>
          <span className="opacity-60">•</span>
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="7"/></svg>
            Fast search
          </span>
          <span className="opacity-60">•</span>
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Save favorites
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12 lg:py-20 min-h-screen grid content-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left pitch */}
          <section className="hidden lg:block">
            <div className="rounded-2xl p-10 bg-white/80 dark:bg-gray-800/70 backdrop-blur border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Create your PersonalFeed</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Sign up to start curating and organizing your multi‑source feed.
              </p>
            </div>
          </section>

          {/* Signup card */}
          <section>
            <div className="w-full max-w-md mx-auto rounded-2xl bg-white/90 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
              <div className="px-6 py-6 sm:px-8 sm:py-8">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-inner" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Create account</span>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-700 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Name</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Email</span>
                    <input
                      className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Password</span>
                    <div className="mt-1 relative">
                      <input
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute inset-y-0 right-2 my-auto text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </label>

                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white rounded-lg px-4 py-2.5 font-medium shadow-sm transition-all"
                    disabled={!name || !email || !password}
                  >
                    Sign up
                  </button>

                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Already have an account? <a className="text-blue-600 hover:underline" href="/login">Sign in</a>
                  </p>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


