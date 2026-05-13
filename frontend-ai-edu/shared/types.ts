/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

// Inline types that were previously generated from drizzle schema
export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
  loginMethod: string | null;
  lastSignedIn: Date | null;
  createdAt: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string | null;
  category: string;
  level: string;
  instructor: string | null;
  duration: string | null;
  thumbnail: string | null;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
}

export interface CommunityPost {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  tags: string | null;
  likes: number;
  views: number;
  createdAt: Date;
}

export interface Project {
  id: number;
  title: string;
  description: string | null;
  status: 'planning' | 'recruiting' | 'in_progress' | 'completed';
  maxMembers: number;
  createdAt: Date;
}

export interface MarketplaceItem {
  id: number;
  title: string;
  description: string | null;
  category: string;
  price: number;
  sellerUserId: number;
  status: 'active' | 'sold' | 'inactive';
  createdAt: Date;
}

export interface NewsEvent {
  id: number;
  title: string;
  content: string;
  type: 'news' | 'event';
  eventDate: Date | null;
  thumbnail: string | null;
  createdAt: Date;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}
