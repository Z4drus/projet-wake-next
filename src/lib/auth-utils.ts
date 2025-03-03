import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { Role } from "@prisma/client";

// Vérifier si l'utilisateur est connecté
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

// Vérifier si l'utilisateur est un administrateur
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN;
}

// Middleware pour protéger les routes qui nécessitent une authentification
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  
  return user;
}

// Middleware pour protéger les routes qui nécessitent des droits d'administrateur
export async function requireAdmin() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }
  
  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }
  
  return user;
}

// Vérifier si l'utilisateur a accès à une ressource spécifique
export async function hasAccess(resourceUserId: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  // Les administrateurs ont accès à toutes les ressources
  if (user.role === Role.ADMIN) {
    return true;
  }
  
  // Les utilisateurs normaux n'ont accès qu'à leurs propres ressources
  return user.id === resourceUserId;
} 