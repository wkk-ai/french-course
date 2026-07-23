'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          router.push('/');
          router.refresh();
        } else {
          setMessage('Check your inbox to confirm your account, then return here to sign in.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
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
            {isLogin ? 'Sign in to continue learning' : 'Create an account to start'}
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
          {message && <div className="rounded-lg bg-primary-fixed/30 p-3 text-sm text-on-primary-fixed">{message}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 rounded-xl text-body-ui font-bold tactile-button border-[#002b54] mt-2 disabled:opacity-50"
          >
            {loading ? 'WAIT...' : (isLogin ? 'SIGN IN' : 'SIGN UP')}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? <>Don&apos;t have an account? Sign up</> : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
