'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { BackButton } from '@/components/ui/back-button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      // Redirect to the intended page or dashboard
      const redirectTo = searchParams.get('redirectTo') || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute top-4 left-4">
          <BackButton />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-blue-200">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-blue-300 hover:text-blue-200">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="mt-8 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-500/20 p-4">
                  <div className="text-sm text-red-200">{error}</div>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full appearance-none rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-blue-300 hover:text-blue-200">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
} 