# Eventoria — Application de réservation d’événements (NestJS / Next.js)

## 📌 Description
**Eventoria** est une application web de réservation d’événements développée dans le cadre d’un projet individuel.  
Elle permet aux organisations (centres de formation, entreprises, associations, espaces de coworking) de **gérer leurs événements** et de **centraliser les réservations des participants** via une plateforme moderne, sécurisée et fiable.

L’objectif principal est de remplacer une gestion manuelle (Excel, emails, formulaires simples) par une **solution web professionnelle, scalable et industrialisée**.

----------------------------

## 👨‍💻 Rôle dans le projet
🔹 **Développeur Full-Stack (Back-end & Front-end)**  

J’ai assuré **l’intégralité du développement du projet** :
- Analyse du besoin et conception de l’architecture
- Développement du **Back-end (API REST sécurisée)**
- Développement du **Front-end (interfaces utilisateur)**
- Mise en place des tests, Docker et CI/CD
- Planification et suivi du projet sur **JIRA**

---

## 🧩 Fonctionnalités principales
- Création, modification, publication et annulation d’événements
- Affichage d’un catalogue public des événements publiés
- Gestion des capacités et du nombre de places restantes
- Réservation d’événements par les participants
- Gestion du cycle de vie des réservations  
  *(PENDING, CONFIRMED, REFUSED, CANCELED)*
- Génération et téléchargement de tickets PDF pour les réservations confirmées
- Gestion des rôles : **Admin / Participant**

---

## 🛠️ Stack technique

### 🔙 Back-end
- **NestJS (TypeScript)**
- Base de données : **MongoDB ou PostgreSQL**
- Authentification sécurisée avec **JWT**
- Autorisation basée sur les rôles
- Validation des données avec `class-validator`
- Gestion centralisée des erreurs
- Tests unitaires et end-to-end avec **Jest**

### 🔜 Front-end
- **Next.js + TypeScript**
- SSR pour les pages publiques (liste & détail des événements)
- CSR pour les espaces authentifiés (dashboards)
- Gestion d’état global (Redux ou Context API)
- Gestion des formulaires et validations côté client
- Tests avec **React Testing Library**

---

## 🚀 DevOps & Qualité
- **Docker & docker-compose** (Front, Back, DB)
- Gestion des variables d’environnement (`.env.example`)
- Séparation des environnements dev / prod
- **CI/CD avec GitHub Actions**
  - Lint
  - Tests
  - Build
  - Publication des images Docker

----------------------------

## 📂 Organisation du projet
- Architecture modulaire et maintenable
- Respect des principes **DRY** et **SRP**
- Sécurité des routes sensibles
- Commits Git référencés avec les tickets JIRA
- Code clair, structuré et documenté

---

## 🎯 Objectifs pédagogiques
- Concevoir une application web complète de niveau professionnel
- Mettre en pratique les bonnes pratiques Back-end et Front-end
- Implémenter une pipeline CI/CD fonctionnelle
- Être capable d’expliquer et défendre les choix techniques

---

## 📅 Durée du projet
- **5 jours** — Travail individuel
