# Wakesurf Léman

Site web moderne et performant pour un club de wakesurf sur le lac Léman, avec système de réservation en ligne intégré.

## Fonctionnalités

- **Design Moderne et Responsive** : Interface utilisateur élégante et adaptée à tous les appareils (mobile-first)
- **Système de Réservation Intégré** : Réservation en temps réel avec gestion des créneaux horaires
- **Gestion des Codes Promo** : Achat et utilisation de codes pour des heures de wakesurf
- **Paiements Sécurisés** : Intégration de Stripe (cartes bancaires) et Twint
- **Panneau d'Administration** : Gestion complète des réservations, annulations et reporting
- **Blog Intégré** : Publication d'actualités et d'articles optimisés pour le SEO

## Technologies Utilisées

- **Frontend** : Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de Données** : PostgreSQL
- **Authentification** : NextAuth.js
- **Paiements** : Stripe API
- **Emails** : Nodemailer
- **Animations** : Framer Motion

## Prérequis

- Node.js 18+ et npm
- PostgreSQL

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/wakesurf-leman.git
   cd wakesurf-leman
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   - Copier le fichier `.env.example` vers `.env`
   - Remplir les variables avec vos propres valeurs

4. Initialiser la base de données :
   ```bash
   npx prisma migrate dev
   ```

5. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

6. Accéder au site à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure du Projet

- `/src/app` - Pages et routes de l'application
- `/src/components` - Composants React réutilisables
- `/src/lib` - Utilitaires et fonctions partagées
- `/prisma` - Schéma de base de données et migrations
- `/public` - Fichiers statiques (images, etc.)

## Déploiement

Le site est configuré pour être déployé sur Vercel. Connectez votre dépôt GitHub à Vercel pour un déploiement automatique à chaque push.

## Licence

Tous droits réservés © Wakesurf Léman
