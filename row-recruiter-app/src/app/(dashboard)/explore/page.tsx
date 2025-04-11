'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { BackButton } from '@/components/ui/back-button';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/supabase';

// Define interfaces based on our database schema
type Athlete = Database['public']['Tables']['athletes']['Row'];
type School = Database['public']['Tables']['schools']['Row'];
type Video = Database['public']['Tables']['videos']['Row'];
type Achievement = Database['public']['Tables']['achievements']['Row'];
type SchoolInterest = Database['public']['Tables']['school_interests']['Row'];

export default function ExplorePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
  // Data states
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [athleteVideos, setAthleteVideos] = useState<Record<string, Video[]>>({});
  const [athleteAchievements, setAthleteAchievements] = useState<Record<string, Achievement[]>>({});
  const [athleteInterests, setAthleteInterests] = useState<Record<string, SchoolInterest[]>>({});
  
  // Coach-specific filters
  const [selectedGraduationYear, setSelectedGraduationYear] = useState<string>('');
  const [heightMinFilter, setHeightMinFilter] = useState<string>('');
  const [heightMaxFilter, setHeightMaxFilter] = useState<string>('');
  const [weightMinFilter, setWeightMinFilter] = useState<string>('');
  const [weightMaxFilter, setWeightMaxFilter] = useState<string>('');
  const [erg2kMaxFilter, setErg2kMaxFilter] = useState<string>('');
  const [sideFilter, setSideFilter] = useState<string>('');
  
  // Athlete-specific filters
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  
  // Filter visibility state
  const [showFilters, setShowFilters] = useState(false);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const userRole = user?.user_metadata?.role || 'ATHLETE';

  // Fetch data based on user role
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setDataLoading(true);
      
      try {
        if (userRole === 'COACH') {
          // Fetch athletes for coaches
          const { data: athletesData, error: athletesError } = await supabase
            .from('athletes')
            .select('*');
            
          if (athletesError) throw athletesError;
          setAthletes(athletesData || []);
        } else {
          // Fetch schools for athletes
          const { data: schoolsData, error: schoolsError } = await supabase
            .from('schools')
            .select('*');
            
          if (schoolsError) throw schoolsError;
          setSchools(schoolsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, [user, userRole]);

  // Fetch athlete details when selected
  useEffect(() => {
    const fetchAthleteDetails = async () => {
      if (!selectedAthlete) return;
      
      setProfileLoading(true);
      
      try {
        // Fetch videos
        const { data: videosData, error: videosError } = await supabase
          .from('videos')
          .select('*')
          .eq('athlete_id', selectedAthlete.id);
          
        if (videosError) throw videosError;
        setAthleteVideos(prev => ({
          ...prev,
          [selectedAthlete.id]: videosData || []
        }));
        
        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('athlete_id', selectedAthlete.id);
          
        if (achievementsError) throw achievementsError;
        setAthleteAchievements(prev => ({
          ...prev,
          [selectedAthlete.id]: achievementsData || []
        }));
        
        // Fetch school interests
        const { data: interestsData, error: interestsError } = await supabase
          .from('school_interests')
          .select('*')
          .eq('athlete_id', selectedAthlete.id);
          
        if (interestsError) throw interestsError;
        setAthleteInterests(prev => ({
          ...prev,
          [selectedAthlete.id]: interestsData || []
        }));
      } catch (error) {
        console.error('Error fetching athlete details:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchAthleteDetails();
  }, [selectedAthlete]);

  // Filter athletes based on coach criteria
  const filteredAthletes = athletes.filter(athlete => {
    // Name search
    if (searchQuery && !`${athlete.first_name} ${athlete.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Graduation year filter
    if (selectedGraduationYear && athlete.graduation_year.toString() !== selectedGraduationYear) {
      return false;
    }
    
    // Height filter (in cm)
    if (heightMinFilter && athlete.height < parseFloat(heightMinFilter)) {
      return false;
    }
    
    if (heightMaxFilter && athlete.height > parseFloat(heightMaxFilter)) {
      return false;
    }
    
    // Weight filter (in kg)
    if (weightMinFilter && athlete.weight < parseFloat(weightMinFilter)) {
      return false;
    }
    
    if (weightMaxFilter && athlete.weight > parseFloat(weightMaxFilter)) {
      return false;
    }
    
    // 2K time filter (lower is better)
    if (erg2kMaxFilter && athlete.erg_2k && athlete.erg_2k > parseFloat(erg2kMaxFilter)) {
      return false;
    }
    
    // Side filter
    if (sideFilter && athlete.side !== sideFilter) {
      return false;
    }
    
    return true;
  });

  // Filter schools based on athlete criteria
  const filteredSchools = schools.filter(school => {
    // Name search
    if (searchQuery && !school.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Division filter
    if (selectedDivision && school.division !== selectedDivision) {
      return false;
    }
    
    return true;
  });

  // Handle school click
  const handleSchoolClick = (school: School) => {
    setSelectedSchool(school);
  };

  // Handle athlete click
  const handleAthleteClick = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
  };

  // Handle close profile
  const handleCloseProfile = () => {
    setSelectedAthlete(null);
  };

  // Handle close school details
  const handleCloseSchoolDetails = () => {
    setSelectedSchool(null);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGraduationYear('');
    setHeightMinFilter('');
    setHeightMaxFilter('');
    setWeightMinFilter('');
    setWeightMaxFilter('');
    setErg2kMaxFilter('');
    setSideFilter('');
    setSelectedDivision('');
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'heightMin':
        setHeightMinFilter(value);
        break;
      case 'heightMax':
        setHeightMaxFilter(value);
        break;
      case 'weightMin':
        setWeightMinFilter(value);
        break;
      case 'weightMax':
        setWeightMaxFilter(value);
        break;
      case 'erg2kMax':
        setErg2kMaxFilter(value);
        break;
      case 'side':
        setSideFilter(value);
        break;
    }
  };

  // Handle division change
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDivision(e.target.value);
  };

  // Handle graduation year change
  const handleGraduationYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGraduationYear(e.target.value);
  };

  // Format time from seconds to MM:SS.T
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toFixed(1).padStart(4, '0')}`;
  };

  // Convert cm to feet and inches
  const cmToFeetInches = (cm: number) => {
    const inches = cm / 2.54;
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };

  // Convert kg to lbs
  const kgToLbs = (kg: number) => {
    return Math.round(kg * 2.20462);
  };

  if (loading || dataLoading) {
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
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
                  <input
                    type="text"
                    placeholder={`Search ${userRole === 'ATHLETE' ? 'colleges' : 'athletes'}...`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                  <Button
                    onClick={resetFilters}
                    className="bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
              
              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {userRole === 'COACH' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Graduation Year
                        </label>
                        <select
                          value={selectedGraduationYear}
                          onChange={handleGraduationYearChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                          <option value="">All Years</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Side
                        </label>
                        <select
                          name="side"
                          value={sideFilter}
                          onChange={handleFilterChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                          <option value="">All Sides</option>
                          <option value="PORT">Port</option>
                          <option value="STARBOARD">Starboard</option>
                          <option value="BOTH">Both</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Min Height (cm)
                        </label>
                        <input
                          type="number"
                          name="heightMin"
                          value={heightMinFilter}
                          onChange={handleFilterChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="e.g., 170"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Max Height (cm)
                        </label>
                        <input
                          type="number"
                          name="heightMax"
                          value={heightMaxFilter}
                          onChange={handleFilterChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="e.g., 190"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Min Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weightMin"
                          value={weightMinFilter}
                          onChange={handleFilterChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="e.g., 70"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Max Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weightMax"
                          value={weightMaxFilter}
                          onChange={handleFilterChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="e.g., 90"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">
                          Max 2K Time (seconds)
                        </label>
                        <input
                          type="number"
                          name="erg2kMax"
                          value={erg2kMaxFilter}
                          onChange={handleFilterChange}
                          className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="e.g., 390"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">
                        Division
                      </label>
                      <select
                        value={selectedDivision}
                        onChange={handleDivisionChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      >
                        <option value="">All Divisions</option>
                        <option value="D1">Division I</option>
                        <option value="D2">Division II</option>
                        <option value="D3">Division III</option>
                        <option value="CLUB">Club</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Results */}
            {userRole === 'COACH' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAthletes.length > 0 ? (
                  filteredAthletes.map((athlete) => (
                    <div
                      key={athlete.id}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer"
                      onClick={() => handleAthleteClick(athlete)}
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-gray-700 flex items-center justify-center">
                          <span className="text-white text-xl">
                            {athlete.first_name.charAt(0)}{athlete.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{athlete.first_name} {athlete.last_name}</h3>
                          <p className="text-blue-200">Class of {athlete.graduation_year}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Height:</span>
                          <span className="text-white ml-2">{cmToFeetInches(athlete.height)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Weight:</span>
                          <span className="text-white ml-2">{kgToLbs(athlete.weight)} lbs</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Side:</span>
                          <span className="text-white ml-2">{athlete.side || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">2K Time:</span>
                          <span className="text-white ml-2">{athlete.erg_2k ? formatTime(athlete.erg_2k) : 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white ml-2">{athlete.experience} years</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-white text-xl">No athletes found matching your criteria.</p>
                    <Button
                      onClick={resetFilters}
                      className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer"
                      onClick={() => handleSchoolClick(school)}
                    >
                      <div className="h-40 rounded-lg overflow-hidden mb-4 bg-gray-700 flex items-center justify-center">
                        <span className="text-white text-2xl">{school.name}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{school.name}</h3>
                      <p className="text-blue-200 mb-2">{school.location}</p>
                      <div className="flex justify-between items-center">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                          {school.division}
                        </span>
                        <Button
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-white text-xl">No colleges found matching your criteria.</p>
                    <Button
                      onClick={resetFilters}
                      className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        
        {/* Athlete Profile Modal */}
        {selectedAthlete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-3xl">
                        {selectedAthlete.first_name.charAt(0)}{selectedAthlete.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedAthlete.first_name} {selectedAthlete.last_name}</h2>
                      <p className="text-blue-200">Class of {selectedAthlete.graduation_year}</p>
                      <p className="text-white">Side: {selectedAthlete.side || 'N/A'}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleCloseProfile}
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Close
                  </Button>
                </div>
                
                {profileLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="text-white text-xl">Loading profile details...</div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white/10 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-white mb-2">Physical Stats</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-400">Height:</span>
                            <span className="text-white ml-2">{cmToFeetInches(selectedAthlete.height)}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Weight:</span>
                            <span className="text-white ml-2">{kgToLbs(selectedAthlete.weight)} lbs</span>
                          </div>
                          <div>
                            <span className="text-gray-400">2K Time:</span>
                            <span className="text-white ml-2">{selectedAthlete.erg_2k ? formatTime(selectedAthlete.erg_2k) : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">6K Time:</span>
                            <span className="text-white ml-2">{selectedAthlete.erg_6k ? formatTime(selectedAthlete.erg_6k) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-white mb-2">Experience</h3>
                        <div>
                          <p className="text-white mb-2">
                            <span className="text-gray-400">Years of Experience:</span>
                            <span className="ml-2">{selectedAthlete.experience} years</span>
                          </p>
                          <p className="text-white">
                            <span className="text-gray-400">Side Preference:</span>
                            <span className="ml-2">{selectedAthlete.side || 'N/A'}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    {athleteAchievements[selectedAthlete.id]?.length > 0 && (
                      <div className="bg-white/10 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">Achievements</h3>
                        <div className="space-y-2">
                          {athleteAchievements[selectedAthlete.id].map((achievement) => (
                            <div key={achievement.id} className="bg-white/5 p-3 rounded-lg">
                              <h4 className="text-white font-medium">{achievement.title}</h4>
                              {achievement.description && (
                                <p className="text-gray-300 text-sm mt-1">{achievement.description}</p>
                              )}
                              <p className="text-gray-400 text-xs mt-1">
                                {new Date(achievement.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Videos */}
                    {athleteVideos[selectedAthlete.id]?.length > 0 && (
                      <div className="bg-white/10 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-bold text-white mb-4">Videos</h3>
                        <div className="grid grid-cols-1 gap-4">
                          {athleteVideos[selectedAthlete.id].map((video) => (
                            <div key={video.id} className="bg-white/5 p-3 rounded-lg">
                              <h4 className="text-white font-medium mb-2">{video.title}</h4>
                              <div className="aspect-video rounded-lg overflow-hidden">
                                <iframe
                                  src={video.url}
                                  title={video.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full"
                                ></iframe>
                              </div>
                              <p className="text-gray-400 text-xs mt-2">
                                Type: {video.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* School Interests */}
                    {athleteInterests[selectedAthlete.id]?.length > 0 && (
                      <div className="bg-white/10 p-4 rounded-lg mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">School Interests</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 px-4 text-gray-400">School</th>
                                <th className="text-left py-2 px-4 text-gray-400">Status</th>
                                <th className="text-left py-2 px-4 text-gray-400">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {athleteInterests[selectedAthlete.id].map((interest) => {
                                const school = schools.find(s => s.id === interest.school_id);
                                return (
                                  <tr key={interest.id} className="border-b border-gray-700">
                                    <td className="py-2 px-4 text-white">{school?.name || 'Unknown School'}</td>
                                    <td className="py-2 px-4 text-white">{interest.status}</td>
                                    <td className="py-2 px-4 text-white">{interest.notes || 'N/A'}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Contact Athlete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* School Detail Modal */}
        {selectedSchool && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedSchool.name}</h2>
                    <p className="text-blue-200">{selectedSchool.location}</p>
                    <p className="text-white mt-2">Division: {selectedSchool.division}</p>
                    {selectedSchool.conference && (
                      <p className="text-white">Conference: {selectedSchool.conference}</p>
                    )}
                  </div>
                  <Button
                    onClick={handleCloseSchoolDetails}
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Close
                  </Button>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">About</h3>
                  <p className="text-white">
                    {selectedSchool.website ? (
                      <a 
                        href={selectedSchool.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      'No additional information available.'
                    )}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      // In a real app, this would add the school to the athlete's interests
                      alert('Feature coming soon: Express interest in this school');
                    }}
                  >
                    Express Interest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuroraBackground>
  );
} 