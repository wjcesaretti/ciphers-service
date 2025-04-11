'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to sign in...');
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        setIsLoading(false);
        return;
      }
      
      console.log('Sign in successful, redirecting...');
      // Redirect to the dashboard now that we know authentication works
      console.log('Redirecting to: /dashboard');
      
      // Use a direct link instead of window.location
      const link = document.createElement('a');
      link.href = '/dashboard';
      link.click();
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Image 
              src="/rrLogo.png" 
              alt="RowRecruiter Logo" 
              width={80} 
              height={80} 
              className="rounded-full"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-6">Welcome Back</h1>
          
          {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
} 