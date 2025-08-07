// export interface BreastfeedingSession {
//   id: string;
//   user_id: string;
//   start_time: string;
//   end_time?: string;
//   duration_minutes?: number;
//   side: 'left' | 'right' | 'both';
//   notes?: string;
//   created_at: string;
// }
// // types/breastfeeding.ts - Type definitions
export interface BreastfeedingSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  duration_seconds?: number;
  total_duration_seconds?: number;
  side: 'left' | 'right' | 'both';
  notes?: string;
  created_at: string;
}

export type BreastSide = 'left' | 'right' | 'both';

export interface SessionStatistics {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  leftSessions: number;
  rightSessions: number;
  lastSession?: BreastfeedingSession;
}

export interface BreastfeedingSettings {
  reminderEnabled: boolean;
  reminderInterval: number; // in hours
  defaultSide: BreastSide;
  autoSwitchSide: boolean;
}

// Profile types
export type Language = 'english' | 'hindi' | 'assamese' | 'bengali' | 'kannada' | 'tamil' | 'marathi';
export type Relationship = 'child' | 'father' | 'mother' | 'nanny' | 'grandparent';

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  language: Language;
  relationship?: Relationship;
  location?: string;
  is_primary_caregiver: boolean;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

// Child profile types
export type ChildRelationship = 'parent' | 'father' | 'mother' | 'nanny' | 'grandparent' | 'guardian';
export type ChildGender = 'boy' | 'girl';

export interface ChildProfile {
  id: string;
  name: string;
  avatar_url?: string;
  date_of_birth: string;
  gender?: ChildGender;
  created_at: string;
  updated_at: string;
}

export interface ChildMeasurement {
  id: string;
  child_id: string;
  height_cm?: number;
  weight_kg?: number;
  head_circumference_cm?: number;
  measured_at: string;
  notes?: string;
  created_at: string;
}

export interface UserChildRelationship {
  id: string;
  user_id: string;
  child_id: string;
  is_primary_caregiver: boolean;
  relationship?: ChildRelationship;
  can_edit: boolean;
  can_view: boolean;
  added_at: string;
  added_by?: string;
}

export interface ChildWithRelationship extends ChildProfile {
  user_relationship: UserChildRelationship;
  latest_measurements?: ChildMeasurement;
}

export interface ChildWithMeasurements extends ChildProfile {
  measurements: ChildMeasurement[];
  latest_measurements?: ChildMeasurement;
}

// Memory types
export interface ChildMemory {
  id: string;
  child_id: string;
  created_by: string;
  title: string;
  description?: string;
  images: string[];
  created_at: string;
  memory_date: string;
  updated_at: string;
}

export interface MemoryLike {
  id: string;
  memory_id: string;
  user_id: string;
  created_at: string;
}

export interface MemoryComment {
  id: string;
  memory_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface MemoryWithDetails extends ChildMemory {
  child_profile: ChildProfile;
  creator_profile: { username?: string } | null;
  likes: MemoryLike[];
  comments: MemoryComment[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
}