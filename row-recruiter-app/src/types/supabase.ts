export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'ATHLETE' | 'COACH' | 'PARENT' | 'ADMIN'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'ATHLETE' | 'COACH' | 'PARENT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'ATHLETE' | 'COACH' | 'PARENT' | 'ADMIN'
          created_at?: string
          updated_at?: string
        }
      }
      athletes: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          date_of_birth: string
          graduation_year: number
          height: number
          weight: number
          erg_2k: number | null
          erg_6k: number | null
          side: 'PORT' | 'STARBOARD' | 'BOTH' | null
          experience: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          date_of_birth: string
          graduation_year: number
          height: number
          weight: number
          erg_2k?: number | null
          erg_6k?: number | null
          side?: 'PORT' | 'STARBOARD' | 'BOTH' | null
          experience: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          graduation_year?: number
          height?: number
          weight?: number
          erg_2k?: number | null
          erg_6k?: number | null
          side?: 'PORT' | 'STARBOARD' | 'BOTH' | null
          experience?: number
          created_at?: string
          updated_at?: string
        }
      }
      coaches: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          school_id: string
          title: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          school_id: string
          title: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          school_id?: string
          title?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      parents: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          division: 'D1' | 'D2' | 'D3' | 'CLUB'
          conference: string | null
          location: string
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          division: 'D1' | 'D2' | 'D3' | 'CLUB'
          conference?: string | null
          location: string
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          division?: 'D1' | 'D2' | 'D3' | 'CLUB'
          conference?: string | null
          location?: string
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          athlete_id: string
          title: string
          description: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          athlete_id: string
          title: string
          description?: string | null
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          athlete_id?: string
          title?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      school_interests: {
        Row: {
          id: string
          athlete_id: string
          school_id: string
          status: 'INTERESTED' | 'APPLIED' | 'CONTACTED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'COMMITTED'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          athlete_id: string
          school_id: string
          status: 'INTERESTED' | 'APPLIED' | 'CONTACTED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'COMMITTED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          athlete_id?: string
          school_id?: string
          status?: 'INTERESTED' | 'APPLIED' | 'CONTACTED' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED' | 'COMMITTED'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          athlete_id: string
          title: string
          url: string
          type: 'ERG' | 'RACING' | 'PRACTICE' | 'OTHER'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          athlete_id: string
          title: string
          url: string
          type: 'ERG' | 'RACING' | 'PRACTICE' | 'OTHER'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          athlete_id?: string
          title?: string
          url?: string
          type?: 'ERG' | 'RACING' | 'PRACTICE' | 'OTHER'
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          parent_id: string
          plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ELITE'
          status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'
          start_date: string
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ELITE'
          status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          plan?: 'FREE' | 'BASIC' | 'PREMIUM' | 'ELITE'
          status?: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING'
          start_date?: string
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 