'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { BackButton } from '@/components/ui/back-button';
import Image from 'next/image';

type UserRole = 'ATHLETE' | 'COACH' | 'PARENT';

// Mock data for colleges
const mockColleges = [
  {
    id: 1,
    name: 'Harvard University',
    location: 'Cambridge, MA',
    division: 'D1',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
    description: 'One of the oldest and most prestigious rowing programs in the United States.',
  },
  {
    id: 2,
    name: 'Yale University',
    location: 'New Haven, CT',
    division: 'D1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Home to the Yale Bulldogs, with a rich history in collegiate rowing.',
  },
  {
    id: 3,
    name: 'University of Washington',
    location: 'Seattle, WA',
    division: 'D1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Known for its strong rowing program and beautiful boathouse on Lake Washington.',
  },
  {
    id: 4,
    name: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    division: 'D1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'The Golden Bears have a storied history in collegiate rowing.',
  },
  {
    id: 5,
    name: 'Brown University',
    location: 'Providence, RI',
    division: 'D1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'Known for its competitive rowing program and historic boathouse.',
  },
  {
    id: 6,
    name: 'Princeton University',
    location: 'Princeton, NJ',
    division: 'D1',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    description: 'The Tigers have a strong tradition in collegiate rowing.',
  },
];

// Mock data for athletes
const mockAthletes = [
  {
    id: 1,
    name: 'Alex Johnson',
    graduationYear: '2025',
    location: 'Seattle, WA',
    height: '6\'2"',
    weight: '185 lbs',
    clubTeam: 'Seattle Rowing Center',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    achievements: 'State Champion, National Team Development Camp',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    graduationYear: '2024',
    location: 'Boston, MA',
    height: '5\'11"',
    weight: '160 lbs',
    clubTeam: 'Community Rowing Inc.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    achievements: 'Regional Champion, Youth National Team',
  },
  {
    id: 3,
    name: 'Michael Chen',
    graduationYear: '2025',
    location: 'San Francisco, CA',
    height: '6\'4"',
    weight: '190 lbs',
    clubTeam: 'Marin Rowing Association',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    achievements: 'State Champion, National Team Development Camp',
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    graduationYear: '2024',
    location: 'Miami, FL',
    height: '5\'10"',
    weight: '155 lbs',
    clubTeam: 'Miami Rowing Club',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    achievements: 'Regional Champion, Youth National Team',
  },
  {
    id: 5,
    name: 'James Wilson',
    graduationYear: '2025',
    location: 'Chicago, IL',
    height: '6\'3"',
    weight: '185 lbs',
    clubTeam: 'Chicago Rowing Foundation',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    achievements: 'State Champion, National Team Development Camp',
  },
  {
    id: 6,
    name: 'Olivia Thompson',
    graduationYear: '2024',
    location: 'Philadelphia, PA',
    height: '5\'11"',
    weight: '160 lbs',
    clubTeam: 'Philadelphia City Rowing',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    achievements: 'Regional Champion, Youth National Team',
  },
];

export default function ExplorePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState('all');
  const [filterGraduationYear, setFilterGraduationYear] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Get user role from metadata
      const role = user.user_metadata?.role || 'ATHLETE';
      setUserRole(role as UserRole);
    }
  }, [user, loading, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter the results
    console.log('Searching for:', searchTerm);
  };

  const filteredColleges = mockColleges.filter(college => {
    if (filterDivision !== 'all' && college.division !== filterDivision) {
      return false;
    }
    if (searchTerm && !college.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !college.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filteredAthletes = mockAthletes.filter(athlete => {
    if (filterGraduationYear !== 'all' && athlete.graduationYear !== filterGraduationYear) {
      return false;
    }
    if (searchTerm && !athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !athlete.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <AuroraBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </AuroraBackground>
    );
  }

  if (!user || !userRole) {
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
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Explore Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <BackButton className="mr-4" />
              <h2 className="text-3xl font-bold text-white">
                Explore {userRole === 'ATHLETE' ? 'Colleges' : 'Athletes'}
              </h2>
            </div>
            
            {/* Search and Filters */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <label htmlFor="search" className="block text-sm font-medium text-white mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Search ${userRole === 'ATHLETE' ? 'colleges' : 'athletes'}...`}
                    />
                  </div>
                  
                  {userRole === 'ATHLETE' ? (
                    <div className="w-full md:w-48">
                      <label htmlFor="division" className="block text-sm font-medium text-white mb-1">
                        Division
                      </label>
                      <select
                        id="division"
                        value={filterDivision}
                        onChange={(e) => setFilterDivision(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Divisions</option>
                        <option value="D1">Division I</option>
                        <option value="D2">Division II</option>
                        <option value="D3">Division III</option>
                        <option value="NAIA">NAIA</option>
                        <option value="Club">Club</option>
                      </select>
                    </div>
                  ) : (
                    <div className="w-full md:w-48">
                      <label htmlFor="graduationYear" className="block text-sm font-medium text-white mb-1">
                        Graduation Year
                      </label>
                      <select
                        id="graduationYear"
                        value={filterGraduationYear}
                        onChange={(e) => setFilterGraduationYear(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Years</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="flex items-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRole === 'ATHLETE' ? (
                // College cards
                filteredColleges.map(college => (
                  <div key={college.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                    <div className="h-48 relative">
                      <img 
                        src={college.image} 
                        alt={college.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {college.division}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white mb-1">{college.name}</h3>
                      <p className="text-blue-200 mb-2">{college.location}</p>
                      <p className="text-white text-sm mb-4">{college.description}</p>
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                // Athlete cards
                filteredAthletes.map(athlete => (
                  <div key={athlete.id} className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                    <div className="h-48 relative">
                      <img 
                        src={athlete.image} 
                        alt={athlete.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Class of {athlete.graduationYear}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white mb-1">{athlete.name}</h3>
                      <p className="text-blue-200 mb-2">{athlete.location}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-white mb-4">
                        <div>
                          <span className="font-medium">Height:</span> {athlete.height}
                        </div>
                        <div>
                          <span className="font-medium">Weight:</span> {athlete.weight}
                        </div>
                        <div>
                          <span className="font-medium">Club:</span> {athlete.clubTeam}
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {userRole === 'ATHLETE' && filteredColleges.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white text-lg">No colleges found matching your criteria.</p>
              </div>
            )}
            
            {userRole !== 'ATHLETE' && filteredAthletes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white text-lg">No athletes found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
} 