"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function LandingPage() {
  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col">
        {/* Header/Navigation */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center">
                <Image 
                  src="/rrLogo.png" 
                  alt="RowRecruiter Logo" 
                  width={50} 
                  height={50} 
                  className="mr-3"
                />
                <h1 className="text-3xl font-extrabold text-white tracking-tight">RowRecruiter</h1>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/login"
                className="bg-transparent border border-white text-white hover:bg-white/10"
              >
                <Button>
                  Log In
                </Button>
              </Link>
              <Link 
                href="/register"
                className="bg-white text-blue-900 hover:bg-gray-100"
              >
                <Button>
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
              Connecting Rowing Talent with College Opportunities
            </h2>
            <p className="text-xl text-blue-200 mb-12 max-w-3xl mx-auto">
              The premier platform for high school rowers to connect with college coaches and take the next step in their athletic journey.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link 
                href="/register?role=ATHLETE"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-4">
                  I&apos;m a High School Rower
                </Button>
              </Link>
              <Link 
                href="/register?role=COACH"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-4">
                  I&apos;m a College Coach
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full max-w-6xl mx-auto mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">For Athletes</h3>
                <p className="text-blue-200">
                  Create your profile, showcase your achievements, and connect directly with college coaches looking for talent like you.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">For Coaches</h3>
                <p className="text-blue-200">
                  Find and evaluate potential recruits, manage your recruitment process, and build your team&apos;s future.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-3">For Parents</h3>
                <p className="text-blue-200">
                  Support your athlete&apos;s journey, track their progress, and help them navigate the college recruitment process.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-blue-200">© {new Date().getFullYear()} RowRecruiter. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-blue-200 hover:text-white">
                About
              </Link>
              <Link href="/contact" className="text-blue-200 hover:text-white">
                Contact
              </Link>
              <Link href="/privacy" className="text-blue-200 hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-blue-200 hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </AuroraBackground>
  );
}
