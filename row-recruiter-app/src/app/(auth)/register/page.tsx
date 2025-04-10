'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { BackButton } from '@/components/ui/back-button';

type UserRole = 'ATHLETE' | 'COACH' | 'PARENT';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('ATHLETE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get role from URL query parameter if available
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && (roleParam === 'ATHLETE' || roleParam === 'COACH' || roleParam === 'PARENT')) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await signUp(email, password, role);
      
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-blue-200">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-300 hover:text-blue-200">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="mt-8 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl">
            {success ? (
              <div className="rounded-md bg-green-500/20 p-4 text-center">
                <div className="text-sm text-green-200">
                  Registration successful! Please check your email to verify your account.
                  Redirecting to login...
                </div>
              </div>
            ) : (
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
                  <label htmlFor="role" className="block text-sm font-medium text-white">
                    I am a
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="ATHLETE">High School Rower</option>
                      <option value="COACH">College Coach</option>
                      <option value="PARENT">Parent</option>
                    </select>
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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
} 