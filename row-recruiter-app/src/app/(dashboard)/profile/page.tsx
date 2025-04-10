'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { BackButton } from '@/components/ui/back-button';
import Image from 'next/image';

type UserRole = 'ATHLETE' | 'COACH' | 'PARENT';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  // Athlete specific fields
  graduationYear?: string;
  height?: string;
  weight?: string;
  clubTeam?: string;
  schoolTeam?: string;
  achievements?: string;
  // Coach specific fields
  school?: string;
  program?: string;
  division?: string;
  recruitmentCriteria?: string;
  // Parent specific fields
  childName?: string;
  childGraduationYear?: string;
}

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Get user role from metadata
      const role = user.user_metadata?.role || 'ATHLETE';
      setUserRole(role as UserRole);
      
      // Pre-fill form with existing data if available
      if (user.user_metadata?.profile) {
        setFormData(user.user_metadata.profile);
      }
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // In a real app, you would update the user's profile in your database
      // For now, we'll just simulate a successful save
      console.log('Saving profile data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
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
              <span className="text-white">
                {user.email}
              </span>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Dashboard
              </Button>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <BackButton className="mr-4" />
              <h2 className="text-3xl font-bold text-white">
                Complete Your Profile
              </h2>
            </div>
            
            {saveSuccess && (
              <div className="mb-6 p-4 bg-green-500/20 rounded-lg text-green-200">
                Profile saved successfully!
              </div>
            )}
            
            {saveError && (
              <div className="mb-6 p-4 bg-red-500/20 rounded-lg text-red-200">
                {saveError}
              </div>
            )}
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, State"
                    />
                  </div>
                </div>
                
                {/* Role-specific fields */}
                {userRole === 'ATHLETE' && (
                  <>
                    <h3 className="text-xl font-bold text-white mt-6 mb-4">Athlete Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-white mb-1">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          id="graduationYear"
                          name="graduationYear"
                          value={formData.graduationYear || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 2025"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-white mb-1">
                          Height
                        </label>
                        <input
                          type="text"
                          id="height"
                          name="height"
                          value={formData.height || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 6 feet 2 inches"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-white mb-1">
                          Weight
                        </label>
                        <input
                          type="text"
                          id="weight"
                          name="weight"
                          value={formData.weight || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 180 lbs"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="clubTeam" className="block text-sm font-medium text-white mb-1">
                          Club Team
                        </label>
                        <input
                          type="text"
                          id="clubTeam"
                          name="clubTeam"
                          value={formData.clubTeam || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="schoolTeam" className="block text-sm font-medium text-white mb-1">
                        School Team
                      </label>
                      <input
                        type="text"
                        id="schoolTeam"
                        name="schoolTeam"
                        value={formData.schoolTeam || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="achievements" className="block text-sm font-medium text-white mb-1">
                        Achievements
                      </label>
                      <textarea
                        id="achievements"
                        name="achievements"
                        value={formData.achievements || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List your rowing achievements, awards, and experience"
                      />
                    </div>
                  </>
                )}
                
                {userRole === 'COACH' && (
                  <>
                    <h3 className="text-xl font-bold text-white mt-6 mb-4">Coach Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="school" className="block text-sm font-medium text-white mb-1">
                          School/University
                        </label>
                        <input
                          type="text"
                          id="school"
                          name="school"
                          value={formData.school || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="program" className="block text-sm font-medium text-white mb-1">
                          Program
                        </label>
                        <input
                          type="text"
                          id="program"
                          name="program"
                          value={formData.program || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="division" className="block text-sm font-medium text-white mb-1">
                        Division
                      </label>
                      <select
                        id="division"
                        name="division"
                        value={formData.division || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Division</option>
                        <option value="D1">Division I</option>
                        <option value="D2">Division II</option>
                        <option value="D3">Division III</option>
                        <option value="NAIA">NAIA</option>
                        <option value="Club">Club</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="recruitmentCriteria" className="block text-sm font-medium text-white mb-1">
                        Recruitment Criteria
                      </label>
                      <textarea
                        id="recruitmentCriteria"
                        name="recruitmentCriteria"
                        value={formData.recruitmentCriteria || ''}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe what you're looking for in recruits"
                      />
                    </div>
                  </>
                )}
                
                {userRole === 'PARENT' && (
                  <>
                    <h3 className="text-xl font-bold text-white mt-6 mb-4">Parent Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="childName" className="block text-sm font-medium text-white mb-1">
                          Childs Name
                        </label>
                        <input
                          type="text"
                          id="childName"
                          name="childName"
                          value={formData.childName || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="childGraduationYear" className="block text-sm font-medium text-white mb-1">
                          Childs Graduation Year
                        </label>
                        <input
                          type="text"
                          id="childGraduationYear"
                          name="childGraduationYear"
                          value={formData.childGraduationYear || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-white/10 border border-gray-300 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 2025"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end pt-6">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2"
                  >
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
} 