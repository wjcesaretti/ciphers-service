'use client';

import { useAuth } from '@/lib/context/auth-context';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button 
            className="bg-gray-100 text-gray-900 hover:bg-gray-200"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p className="text-muted-foreground">
            This is your dashboard. More features coming soon!
          </p>
        </div>
      </div>
    </Layout>
  );
} 