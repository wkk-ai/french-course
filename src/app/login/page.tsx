'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function friendlyAuthError(err: unknown): string {
  if (!(err instanceof Error)) return 'Sign-in failed. Please try again.';
  const msg = err.message.toLowerCase();
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid email or password')) {
    return 'Wrong email or password. Please try again.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }
  if (msg.includes('too many requests')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  return 'Sign-in failed. Please check your details and try again.';
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm tactile-card p-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-on-primary font-bold text-3xl">L&apos;</span>
          </div>
          <h1 className="text-headline-md text-on-surface">L&apos;Art du Français</h1>
          <p className="text-body-ui text-on-surface-variant mt-1">
            Sign in to continue learning
          </p>
          <p className="mt-3 text-sm text-on-surface-variant/80">
            Accounts are invite-only for now. Contact your teacher if you need access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-label-caps text-on-surface-variant mb-1 block">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-surface-variant rounded-lg p-3 text-body-ui text-on-surface outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div>
            <label className="text-label-caps text-on-surface-variant mb-1 block">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-lowest border-2 border-surface-variant rounded-lg p-3 text-body-ui text-on-surface outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-xl text-body-ui font-bold tactile-button border-[#002b54] mt-2 disabled:opacity-50"
          >
            {loading ? 'WAIT...' : 'SIGN IN'}
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            <a href="mailto:support@example.com?subject=Password%20reset%20request" className="font-semibold text-primary underline">
              Forgot password?
            </a>
            {' '}Contact your teacher for help.
          </p>
        </form>
      </div>
    </div>
  );
}
