# 🎉 Eventoria - Application de réservation d'événements

[![CI/CD](https://github.com/username/eventoria/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/username/eventoria/actions)

Application web complète de gestion et réservation d'événements développée avec NestJS et Next.js.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [Docker](#-docker)
- [CI/CD](#-cicd)
- [Documentation](#-documentation)
- [Licence](#-licence)

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription et connexion sécurisées
- ✅ JWT avec expiration configurable
- ✅ Gestion des rôles (Admin / Participant)
- ✅ Protection des routes

### Gestion des événements
- ✅ CRUD complet (Admin)
- ✅ Statuts : Draft, Published, Cancelled
- ✅ Gestion des capacités et places disponibles
- ✅ Publication et annulation
- ✅ Catalogue public des événements

### Système de réservations
- ✅ Réservation d'événements (Participants)
- ✅ Workflow : Pending → Confirmed / Refused / Cancelled
- ✅ Validation des places disponibles
- ✅ Gestion admin des réservations
- ✅ Annulation par l'utilisateur

## 🛠️ Technologies

### Backend
- **NestJS 11** - Framework Node.js
- **TypeScript 5.7** - Langage typé
- **PostgreSQL 16** - Base de données
- **TypeORM 0.3** - ORM
- **Passport JWT** - Authentification
- **bcryptjs** - Hashage mots de passe
- **class-validator** - Validation

### Frontend
- **Next.js 14+** - Framework React (App Router)
- **React 18** - Bibliothèque UI
- **TypeScript 5** - Langage typé
- **Tailwind CSS** - Styling
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

### DevOps
- **Docker & Docker Compose** - Conteneurisation
- **GitHub Actions** - CI/CD
- **Jest** - Tests
- **ESLint & Prettier** - Qualité code

## 📦 Prérequis

- Node.js 18+
- Docker & Docker Compose
- npm ou yarn

## 🚀 Installation

### 1. Cloner le repository
```bash
git clone https://github.com/username/eventoria.git
cd eventoria
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Éditer .env avec vos configurations
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Éditer .env avec vos configurations
```

### 4. Base de données
```bash
# À la racine du projet
docker-compose up -d postgres
```

## 💻 Utilisation

### Développement

#### Backend
```bash
cd backend
npm run start:dev
# API disponible sur http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm run dev
# App disponible sur http://localhost:3000
```

### Production avec Docker
```bash
docker-compose up -d
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

## 🧪 Tests

### Backend
```bash
cd backend

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend
```bash
cd frontend
npm run lint
npm run build
```

## 🐳 Docker

### Commandes utiles
```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Reset complet
docker-compose down -v
```

### Services
- **postgres** : Port 5433
- **backend** : Port 3001
- **frontend** : Port 3000

## 🔄 CI/CD

Le projet utilise GitHub Actions pour :
- ✅ Lint du code
- ✅ Tests unitaires et E2E
- ✅ Build des applications
- ✅ Build des images Docker

Workflow déclenché sur :
- Push sur `main` ou `develop`
- Pull requests vers `main` ou `develop`

## 📚 Documentation

- [Contenu complet](docs/CONTENU-COMPLET.md)
- [Jour 1 : Setup](docs/JOUR-1-COMPLETE.md)
- [Jour 2 : Authentification](docs/JOUR-2-COMPLETE.md)
- [Jour 3 : Événements](docs/JOUR-3-COMPLETE.md)
- [Jour 4 : Réservations](docs/JOUR-4-COMPLETE.md)
- [Jour 5 : Tests & Docker](docs/JOUR-5-COMPLETE.md)
- [PostgreSQL & TypeORM](docs/POSTGRESQL-TYPEORM.md)
- [Guide de tests](docs/GUIDE-TESTS.md)
- [Quickstart](QUICKSTART.md)

## 🗄️ Base de données

### Structure
- **users** : Utilisateurs (admin, participant)
- **events** : Événements
- **reservations** : Réservations avec relations

### Accès PostgreSQL
```bash
docker exec -it eventoria_postgres psql -U eventoria_user -d eventoria_db
```

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- JWT avec secret configurable
- Validation des données (DTOs)
- Protection des routes par rôles
- Variables d'environnement

## 👥 Rôles

### Admin
- Gestion complète des événements
- Gestion des réservations
- Confirmation/Refus des réservations

### Participant
- Consultation des événements
- Réservation d'événements
- Gestion de ses réservations

## 📊 API Endpoints

### Auth
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/profile` - Profil (protégé)

### Events
- `GET /events` - Liste tous
- `GET /events/published` - Liste publiés
- `GET /events/:id` - Détails
- `POST /events` - Créer (Admin)
- `PATCH /events/:id` - Modifier (Admin)
- `DELETE /events/:id` - Supprimer (Admin)

### Reservations
- `POST /reservations` - Créer
- `GET /reservations/my-reservations` - Mes réservations
- `GET /reservations` - Toutes (Admin)
- `PATCH /reservations/:id/confirm` - Confirmer (Admin)
- `DELETE /reservations/:id` - Annuler

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Développé dans le cadre d'un projet individuel de formation.

## 🙏 Remerciements

- NestJS Team
- Next.js Team
- PostgreSQL Community
