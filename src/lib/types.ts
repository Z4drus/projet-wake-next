import { Role, ReservationStatus } from "@prisma/client";

// Extension du type Session de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    };
  }
}

// Extension du type JWT de NextAuth
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: Role;
  }
}

// Type pour les créneaux horaires
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

// Type pour les codes promo
export interface PromoCodeType {
  id: string;
  code: string;
  hours: number;
  hoursLeft: number;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type pour les réservations
export interface ReservationType {
  id: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  userId: string;
  promoCodeId?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    email: string;
  };
  promoCode?: PromoCodeType;
}

// Type pour les configurations de créneaux horaires
export interface TimeSlotConfigType {
  id: string;
  name: string;
  duration: number;
  setupTime: number;
  isActive: boolean;
}

// Type pour les articles de blog
export interface BlogPostType {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
} 