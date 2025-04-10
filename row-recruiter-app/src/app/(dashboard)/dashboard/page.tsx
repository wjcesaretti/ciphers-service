'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(25);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Get user role from metadata
      const role = user.user_metadata?.role || 'ATHLETE';
      setUserRole(role);
      
      // Calculate profile completion based on available data
      if (user.user_metadata?.profile) {
        const profile = user.user_metadata.profile;
        let completedFields = 0;
        let totalFields = 0;
        
        // Count basic fields
        const basicFields = ['firstName', 'lastName', 'phone', 'location'];
        totalFields += basicFields.length;
        basicFields.forEach(field => {
          if (profile[field]) completedFields++;
        });
        
        // Count role-specific fields
        if (role === 'ATHLETE') {
          const athleteFields = ['graduationYear', 'height', 'weight', 'clubTeam', 'schoolTeam', 'achievements'];
          totalFields += athleteFields.length;
          athleteFields.forEach(field => {
            if (profile[field]) completedFields++;
          });
        } else if (role === 'COACH') {
          const coachFields = ['school', 'program', 'division', 'recruitmentCriteria'];
          totalFields += coachFields.length;
          coachFields.forEach(field => {
            if (profile[field]) completedFields++;
          });
        } else if (role === 'PARENT') {
          const parentFields = ['childName', 'childGraduationYear'];
          totalFields += parentFields.length;
          parentFields.forEach(field => {
            if (profile[field]) completedFields++;
          });
        }
        
        // Calculate percentage
        const percentage = Math.round((completedFields / totalFields) * 100);
        setProfileCompletion(percentage);
      }
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      console.log('Signing out...');
      await signOut();
      console.log('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
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
                disabled={isSigningOut}
              >
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
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
                This is your personalized dashboard. Heres what you can do:
              </p>
              <ul className="list-disc list-inside text-blue-200 space-y-2">
                {userRole === 'ATHLETE' && (
                  <>
                    <li>Complete your rowing profile to showcase your achievements</li>
                    <li>Browse college programs that match your interests</li>
                    <li>Connect with college coaches</li>
                    <li>Track upcoming events and deadlines</li>
                  </>
                )}
                {userRole === 'COACH' && (
                  <>
                    <li>Set up your recruitment criteria</li>
                    <li>Browse potential recruits that match your criteria</li>
                    <li>Connect with athletes</li>
                    <li>Manage your recruitment calendar</li>
                  </>
                )}
                {userRole === 'PARENT' && (
                  <>
                    <li>Complete your child&apos;s rowing profile</li>
                    <li>Browse college programs that match your child&apos;s interests</li>
                    <li>Connect with college coaches</li>
                    <li>Track upcoming events and deadlines</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Link href="/explore" className="block">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:bg-white/20 transition-colors">
                  <h3 className="text-xl font-bold text-white mb-2">Explore</h3>
                  <p className="text-white/80">
                    {userRole === 'ATHLETE' 
                      ? 'Browse college programs and find your perfect match.'
                      : 'Discover talented athletes and start recruiting.'}
                  </p>
                </div>
              </Link>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">Profile Completion</h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-blue-200">
                  Complete your profile to increase your visibility and chances of connecting with {userRole === 'ATHLETE' ? 'college coaches' : 'athletes'}.
                </p>
                <Link href="/profile">
                  <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                    Complete Profile
                  </Button>
                </Link>
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
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">Messages</h3>
                <p className="text-blue-200 mb-4">
                  You have no new messages.
                </p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  View Messages
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">Events</h3>
                <p className="text-blue-200 mb-4">
                  No upcoming events scheduled.
                </p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  View Calendar
                </Button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">Resources</h3>
                <p className="text-blue-200 mb-4">
                  Access helpful resources for {userRole === 'ATHLETE' ? 'your recruitment journey' : userRole === 'COACH' ? 'your recruitment process' : 'supporting your child'}.
                </p>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Browse Resources
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
} 