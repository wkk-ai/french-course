'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type Mode = 'signin' | 'signup' | 'forgot';

function friendlyAuthError(err: unknown): string {
  if (!(err instanceof Error)) return 'Something went wrong. Please try again.';
  const msg = err.message.toLowerCase();
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid email or password')) {
    return 'Wrong email or password. Please try again.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }
  if (msg.includes('already registered') || msg.includes('already been registered')) {
    return 'That email already has an account. Sign in instead.';
  }
  if (msg.includes('password') && msg.includes('least')) {
    return 'Password must be at least 6 characters.';
  }
  if (msg.includes('too many requests')) {
    return 'Too many attempts. Wait a moment and try again.';
  }
  return 'Please check your details and try again.';
}

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace('/');
    });
  }, [router]);

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const supabase = createClient();
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${siteOrigin}${basePath}/login/`,
        });
        if (error) throw error;
        setInfo('Check your email for a password reset link.');
        return;
      }
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${siteOrigin}${basePath}/`,
          },
        });
        if (error) throw error;
        setInfo('Account created. Check your email to confirm, then sign in.');
        setMode('signin');
        return;
      }
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

  const title =
    mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Reset password' : 'Sign in to continue learning';
  const buttonLabel =
    mode === 'signup' ? 'CREATE ACCOUNT' : mode === 'forgot' ? 'SEND RESET LINK' : 'SIGN IN';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm tactile-card p-8 flex flex-col gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-on-primary font-bold text-3xl">L&apos;</span>
          </div>
          <h1 className="text-headline-md text-on-surface">L&apos;Art du Français</h1>
          <p className="text-body-ui text-on-surface-variant mt-1">{title}</p>
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
          {mode !== 'forgot' && (
            <div>
              <label className="text-label-caps text-on-surface-variant mb-1 block">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-lowest border-2 border-surface-variant rounded-lg p-3 text-body-ui text-on-surface outline-none focus:border-primary transition-colors"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}
          {info && (
            <div className="bg-success/15 text-on-surface p-3 rounded-lg text-sm font-bold border-2 border-success/40">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-xl text-body-ui font-bold tactile-button border-[#002b54] mt-2 disabled:opacity-50"
          >
            {loading ? 'WAIT...' : buttonLabel}
          </button>

          <div className="flex flex-col gap-2 text-center text-sm text-on-surface-variant">
            {mode !== 'signin' && (
              <button type="button" className="font-semibold text-primary underline" onClick={() => { setMode('signin'); setError(null); setInfo(null); }}>
                Back to sign in
              </button>
            )}
            {mode === 'signin' && (
              <>
                <button type="button" className="font-semibold text-primary underline" onClick={() => { setMode('signup'); setError(null); setInfo(null); }}>
                  Create an account
                </button>
                <button type="button" className="font-semibold text-primary underline" onClick={() => { setMode('forgot'); setError(null); setInfo(null); }}>
                  Forgot password?
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
