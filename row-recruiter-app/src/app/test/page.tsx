'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function TestPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Test page loaded');
    console.log('User:', user);
    console.log('Loading:', loading);
  }, [user, loading]);

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-white">
          <h1 className="text-2xl font-bold mb-4">Test Page</h1>
          <p>This is a test page to verify navigation after login.</p>
          <p className="mt-4">User: {user ? 'Logged in' : 'Not logged in'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </AuroraBackground>
  );
} 