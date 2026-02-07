# 📚 Contenu complet - Eventoria

## 🎯 Vue d'ensemble du projet

**Eventoria** est une application complète de gestion et réservation d'événements avec :
- Backend NestJS + PostgreSQL + TypeORM
- Frontend Next.js + TypeScript + Tailwind CSS
- Authentification JWT
- Gestion des rôles (Admin / Participant)
- CRUD complet des événements
- Système de réservations avec workflow

---

## 📦 Architecture Backend

### 1. Modules

#### AuthModule
**Fichiers** :
- `auth.controller.ts` - Endpoints auth
- `auth.service.ts` - Logique métier
- `auth.module.ts` - Configuration JWT
- `guards/jwt-auth.guard.ts` - Protection JWT
- `guards/roles.guard.ts` - Protection par rôles
- `strategies/jwt.strategy.ts` - Stratégie Passport
- `decorators/get-user.decorator.ts` - Récupérer user
- `decorators/roles.decorator.ts` - Décorateur @Roles
- `dto/register.dto.ts` - Validation inscription
- `dto/login.dto.ts` - Validation connexion

**Endpoints** :
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/profile` - Profil (protégé)

#### UsersModule
**Fichiers** :
- `users.module.ts` - Configuration
- `entities/user.entity.ts` - Entité User

**Entité User** :
```typescript
{
  id: uuid
  email: string (unique)
  password: string (hashé bcrypt)
  firstName: string
  lastName: string
  role: enum (admin, participant)
  createdAt: Date
  updatedAt: Date
}
```

#### EventsModule
**Fichiers** :
- `events.controller.ts` - Endpoints événements
- `events.service.ts` - Logique métier
- `events.module.ts` - Configuration
- `entities/event.entity.ts` - Entité Event
- `dto/create-event.dto.ts` - Validation création
- `dto/update-event.dto.ts` - Validation mise à jour

**Entité Event** :
```typescript
{
  id: uuid
  title: string
  description: text
  location: string
  startDate: timestamp
  endDate: timestamp
  capacity: int
  reservedSeats: int (default: 0)
  status: enum (draft, published, cancelled)
  createdAt: Date
  updatedAt: Date
}
```

**Endpoints** :
- `POST /events` - Créer (Admin)
- `GET /events` - Liste tous (Admin)
- `GET /events/published` - Liste publiés
- `GET /events/published/:id` - Détails publiés
- `GET /events/:id` - Détails (Admin)
- `PATCH /events/:id` - Modifier (Admin)
- `DELETE /events/:id` - Supprimer (Admin)
- `PATCH /events/:id/publish` - Publier (Admin)
- `PATCH /events/:id/cancel` - Annuler (Admin)
- `GET /events/:id/available-seats` - Places dispo

#### ReservationsModule
**Fichiers** :
- `reservations.controller.ts` - Endpoints réservations
- `reservations.service.ts` - Logique métier
- `reservations.module.ts` - Configuration
- `entities/reservation.entity.ts` - Entité Reservation
- `dto/create-reservation.dto.ts` - Validation création

**Entité Reservation** :
```typescript
{
  id: uuid
  userId: uuid (FK → users)
  eventId: uuid (FK → events)
  status: enum (pending, confirmed, refused, cancelled)
  createdAt: Date
  updatedAt: Date
  user: User (relation)
  event: Event (relation)
}
```

**Endpoints** :
- `POST /reservations` - Créer (Authentifié)
- `GET /reservations` - Liste toutes (Admin)
- `GET /reservations/my-reservations` - Mes réservations
- `GET /reservations/event/:eventId` - Par événement (Admin)
- `GET /reservations/user/:userId` - Par participant (Admin)
- `GET /reservations/stats` - Statistiques (Admin)
- `GET /reservations/:id` - Détails
- `PATCH /reservations/:id/confirm` - Confirmer (Admin)
- `PATCH /reservations/:id/refuse` - Refuser (Admin)
- `PATCH /reservations/:id/cancel` - Annuler (Admin)
- `DELETE /reservations/:id` - Annuler (User)
- `GET /reservations/:id/ticket` - Télécharger ticket PDF (Confirmée)

#### DatabaseModule
**Fichiers** :
- `database.module.ts` - Configuration TypeORM
- `data-source.ts` - DataSource pour migrations

**Configuration** :
```typescript
{
  type: 'postgres',
  url: DATABASE_URL,
  autoLoadEntities: true,
  synchronize: NODE_ENV !== 'production',
  logging: NODE_ENV === 'development'
}
```

---

## 🎨 Architecture Frontend

### 1. Pages publiques

#### `/` - Page d'accueil
- Navbar
- Message de bienvenue
- Liens vers événements

#### `/events` - Liste événements
- Affichage des événements publiés (SSR)
- Composant EventCard
- Lien vers détails

#### `/events/[id]` - Détail événement
- Informations complètes
- Places disponibles
- Bouton "Réserver" (si connecté)
- Gestion des statuts

#### `/login` - Connexion
- Formulaire email/password
- Gestion erreurs
- Redirection après connexion
- Lien vers inscription

#### `/register` - Inscription
- Formulaire complet
- Validation (min 6 caractères)
- Redirection après inscription
- Lien vers connexion

### 2. Pages authentifiées

#### `/reservations` - Mes réservations
- Liste des réservations de l'utilisateur
- Statuts avec badges colorés
- Bouton annuler
- Téléchargement du ticket PDF si confirmé
- Protection par ProtectedRoute

### 3. Pages admin

#### `/admin/events` - Gestion événements
- Tableau avec tous les événements
- Actions : Modifier, Publier, Annuler, Supprimer
- Bouton créer événement
- Protection par AdminRoute

#### `/admin/events/create` - Créer événement
- Formulaire complet
- Validation dates
- Choix du statut
- Protection par AdminRoute

#### `/admin/events/[id]/edit` - Modifier événement
- Non implémenté (lien présent, page à créer)

#### `/admin/reservations` - Gestion réservations
- Tableau avec toutes les réservations
- Informations participant + événement
- Actions : Confirmer, Refuser, Annuler
- Protection par AdminRoute

#### `/admin` - Dashboard admin
- Indicateurs : événements à venir, taux de remplissage, réservations par statut

### 4. Composants

#### `Navbar`
- Logo Eventoria
- Liens : Événements, Mes réservations
- Section admin (si admin)
- Bouton connexion/déconnexion
- Affichage nom utilisateur

#### `EventCard`
- Titre et description
- Lieu et date
- Places disponibles
- Bouton "Voir détails"

#### `ProtectedRoute`
- HOC pour routes authentifiées
- Redirection vers /login si non connecté
- État de chargement

#### `AdminRoute`
- HOC pour routes admin
- Vérification rôle admin
- Redirection si non autorisé

### 5. Context & Hooks

#### `AuthContext`
- État global authentification
- Fonctions : login, register, logout
- Persistance token (localStorage)
- Récupération automatique profil
- Hook useAuth()

### 6. Types TypeScript

#### `types/event.ts`
```typescript
EventStatus: draft | published | cancelled
Event: { id, title, description, location, dates, capacity, status }
CreateEventDto: { title, description, location, dates, capacity }
```

#### `types/reservation.ts`
```typescript
ReservationStatus: pending | confirmed | refused | cancelled
Reservation: { id, userId, eventId, status, user?, event? }
```

#### `types/user.ts`
```typescript
User: { id, email, firstName, lastName, role }
```

### 7. Configuration

#### `lib/api.ts`
- Instance axios configurée
- Base URL : http://localhost:3001
- Intercepteur pour JWT automatique

#### Tests Front-end
- Jest + React Testing Library
- Config : `jest.config.js` + `jest.setup.ts`
- Commande : `npm test`

---

## 🗄️ Base de données PostgreSQL

### Tables

#### `users`
```sql
id              uuid PRIMARY KEY
email           varchar UNIQUE
password        varchar
firstName       varchar
lastName        varchar
role            enum (admin, participant)
createdAt       timestamp
updatedAt       timestamp
```

#### `events`
```sql
id              uuid PRIMARY KEY
title           varchar
description     text
location        varchar
startDate       timestamp
endDate         timestamp
capacity        int
reservedSeats   int DEFAULT 0
status          enum (draft, published, cancelled)
createdAt       timestamp
updatedAt       timestamp
```

#### `reservations`
```sql
id              uuid PRIMARY KEY
userId          uuid FK → users(id)
eventId         uuid FK → events(id)
status          enum (pending, confirmed, refused, cancelled)
createdAt       timestamp
updatedAt       timestamp
```

---

## 🔐 Sécurité

### Authentification
- JWT avec secret configurable
- Expiration : 24h
- Token stocké dans localStorage (frontend)
- Mot de passe hashé avec bcryptjs (12 rounds)

### Autorisation
- Guard JWT pour routes authentifiées
- Guard Roles pour routes admin
- Décorateur @Roles(UserRole.ADMIN)
- Vérification côté backend et frontend

### Validation
- class-validator pour DTOs
- Validation des emails
- Longueur minimale mot de passe (6)
- Validation des dates
- Validation des capacités (min: 1)

---

## 🚀 Flux utilisateur complets

### Flux inscription/connexion
1. User va sur `/register`
2. Remplit formulaire
3. Backend crée user + hash password
4. Retourne user + JWT token
5. Frontend stocke token
6. Redirection vers `/`
7. Navbar affiche nom user

### Flux réservation
1. User consulte `/events`
2. Clique sur événement
3. Voit détails sur `/events/:id`
4. Clique "Réserver"
5. Backend vérifie places disponibles
6. Crée réservation PENDING
7. Redirection vers `/reservations`
8. Admin va sur `/admin/reservations`
9. Confirme la réservation
10. Places réservées incrémentées
11. User voit statut CONFIRMED
12. User télécharge le ticket PDF depuis `/reservations`

### Flux création événement
1. Admin va sur `/admin/events`
2. Clique "Créer un événement"
3. Remplit formulaire
4. Choisit statut (draft/published)
5. Backend crée événement
6. Redirection vers liste
7. Admin peut publier si draft

### Flux dashboard admin
1. Admin ouvre `/admin`
2. Chargement des statistiques via `/reservations/stats`
3. Affichage : événements à venir, taux de remplissage, répartition par statut

---

## 📊 Statistiques du projet

### Backend
- **4 modules** : Auth, Users, Events, Reservations
- **3 entités** : User, Event, Reservation
- **20+ endpoints** API REST
- **6 DTOs** de validation
- **4 guards** de sécurité
- **2 stratégies** Passport

### Frontend
- **Pages** : publiques, authentifiées, admin
- **Composants** : Navbar, EventCard, ProtectedRoute, AdminRoute, ReserveButton
- **1 context** global (Auth)
- **3 types** TypeScript
- **Protection** routes par HOC
- **Tests** : RTL (composant + flux)

### Base de données
- **3 tables** avec relations
- **5 enums** pour statuts
- **Migrations** supportées
- **Synchronisation** auto en dev

---

## 🛠️ Technologies utilisées

### Backend
- NestJS 11

### Frontend
- Next.js 16 + TypeScript
- Tailwind CSS 4
- Axios

### Tests
- Jest
- React Testing Library

---

## 🐳 Docker & Docker Compose

### Images
- Backend : `backend/Dockerfile`
- Frontend : `frontend/Dockerfile`
- Database : `postgres:16-alpine`

### docker-compose.yml
- Services : `postgres`, `backend`, `frontend`
- Réseau : `eventoria-network`
- Variables d’environnement gérées via `DATABASE_URL`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`

### Variables d’environnement
- Backend : [backend/.env.example](backend/.env.example)
- Frontend : [frontend/.env.example](frontend/.env.example)

---

## 🔁 CI/CD (GitHub Actions)

### Workflow
Fichier : [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

### Déclencheurs
- `push` et `pull_request` sur `main` et `master`

### Jobs
- **backend-test** : install, lint, tests unitaires, e2e
- **frontend-test** : install, lint, build
- **docker-build** : build & push images Docker Hub (push seulement)

### Secrets requis
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- TypeScript 5.7
- PostgreSQL 16
- TypeORM 0.3
- Passport JWT
- bcryptjs
- class-validator

### Frontend
- Next.js 14+ (App Router)
- React 18
- TypeScript 5
- Tailwind CSS
- Axios
- Context API

### DevOps
- Docker & Docker Compose
- PostgreSQL en conteneur
- Variables d'environnement
- Scripts npm

---

## 📝 Variables d'environnement

### Backend (.env)
```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## ✅ Fonctionnalités complètes

### Authentification
- [x] Inscription avec validation
- [x] Connexion avec JWT
- [x] Récupération profil
- [x] Déconnexion
- [x] Persistance session
- [x] Protection routes

### Gestion événements
- [x] CRUD complet
- [x] Statuts (draft, published, cancelled)
- [x] Gestion capacités
- [x] Places disponibles
- [x] Publication/Annulation
- [x] Liste publique
- [x] Détails événement

### Système réservations
- [x] Créer réservation
- [x] Validation places disponibles
- [x] Empêcher doublons
- [x] Statuts (pending, confirmed, refused, cancelled)
- [x] Confirmation admin
- [x] Refus admin
- [x] Annulation user
- [x] Mise à jour places automatique
- [x] Liste mes réservations
- [x] Liste toutes réservations (admin)

### Interface utilisateur
- [x] Design responsive
- [x] Navigation intuitive
- [x] Gestion erreurs
- [x] États de chargement
- [x] Badges statuts colorés
- [x] Formulaires validés
- [x] Messages confirmation

---

## 🎓 Concepts appliqués

- Architecture modulaire
- Séparation des responsabilités
- Principes SOLID
- REST API
- Relations base de données
- Authentification JWT
- Autorisation RBAC
- Validation des données
- Gestion d'état global
- Server-Side Rendering
- Client-Side Rendering
- Protection des routes
- Gestion des erreurs
- TypeScript strict
- Code DRY

---

Ce document représente l'intégralité du contenu et de l'architecture de l'application Eventoria.
