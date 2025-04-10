'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (user) {
      // Get user role from metadata
      const role = user.user_metadata?.role || 'ATHLETE';
      setUserRole(role);
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <AuroraBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </AuroraBackground>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-4 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/rrLogo.png" 
                alt="RowRecruiter Logo" 
                width={40} 
                height={40} 
                className="mr-2"
              />
              <h1 className="text-2xl font-bold text-white">RowRecruiter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white">
                {user.email}
              </span>
              <Button 
                onClick={handleSignOut}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Welcome to your {userRole === 'ATHLETE' ? 'Athlete' : userRole === 'COACH' ? 'Coach' : 'Parent'} Dashboard
            </h2>
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
              <p className="text-blue-200 mb-4">
                This is a placeholder dashboard. In a full implementation, you would see:
              </p>
              <ul className="list-disc list-inside text-blue-200 space-y-2">
                {userRole === 'ATHLETE' && (
                  <>
                    <li>Your rowing profile and achievements</li>
                    <li>College programs that match your interests</li>
                    <li>Messages from college coaches</li>
                    <li>Upcoming events and deadlines</li>
                  </>
                )}
                {userRole === 'COACH' && (
                  <>
                    <li>Your recruitment criteria</li>
                    <li>Potential recruits that match your criteria</li>
                    <li>Messages from athletes</li>
                    <li>Recruitment calendar and tasks</li>
                  </>
                )}
                {userRole === 'PARENT' && (
                  <>
                    <li>Your athlete&apos;s profile</li>
                    <li>College programs of interest</li>
                    <li>Recruitment timeline</li>
                    <li>Resources for the recruitment process</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">Profile Completion</h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-blue-200">
                  Complete your profile to increase your visibility and chances of connecting with {userRole === 'ATHLETE' ? 'college coaches' : 'athletes'}.
                </p>
                <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                  Complete Profile
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">Recent Activity</h3>
                <p className="text-blue-200">
                  No recent activity to display. Start connecting with {userRole === 'ATHLETE' ? 'college coaches' : 'athletes'} to see your activity here.
                </p>
                <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                  Explore {userRole === 'ATHLETE' ? 'Colleges' : 'Athletes'}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
} 