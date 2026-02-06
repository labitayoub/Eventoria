# 🚀 Guide de Démarrage - Jour 1

## ✅ Ce qui a été implémenté

### Backend (NestJS)
- ✅ Structure modulaire complète
- ✅ Configuration TypeORM + PostgreSQL
- ✅ Entité User avec enum UserRole (ADMIN/PARTICIPANT)
- ✅ Module Auth complet avec JWT
- ✅ DTOs avec validation (class-validator)
- ✅ Guards (JwtAuthGuard, RolesGuard)
- ✅ Decorators (@Roles, @GetUser)
- ✅ Tests unitaires AuthService

## 📦 Installation

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Configuration Base de Données

**Option A : PostgreSQL Local**
```bash
# Installer PostgreSQL
# Créer la base de données
createdb eventoria
```

**Option B : Docker PostgreSQL**
```bash
docker run --name eventoria-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=eventoria \
  -p 5432:5432 \
  -d postgres:15
```

### 3. Variables d'environnement
```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer .env avec vos valeurs
DATABASE_URL=postgresql://postgres:password@localhost:5432/eventoria
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
PORT=3001
```

## 🚀 Démarrage

### Mode développement
```bash
npm run start:dev
```

Le serveur démarre sur http://localhost:3001

## 🧪 Tests

### Lancer les tests
```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:cov

# Tests en mode watch
npm run test:watch
```

## 📡 Tester l'API

### 1. Register (Créer un Admin)
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eventoria.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }'
```

**Réponse attendue :**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@eventoria.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Register (Créer un Participant)
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "participant@eventoria.com",
    "password": "Participant123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eventoria.com",
    "password": "Admin123!"
  }'
```

### 4. Get Profile (Route protégée)
```bash
# Remplacer YOUR_TOKEN par le token reçu
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔍 Vérifications

### ✅ Checklist Jour 1
- [ ] Backend démarre sans erreur
- [ ] Base de données connectée
- [ ] Register fonctionne (Admin + Participant)
- [ ] Login retourne un token JWT
- [ ] Route /auth/profile protégée par JWT
- [ ] Tests passent (npm run test)
- [ ] Validation DTOs fonctionne (tester avec données invalides)

### 🧪 Tests de Validation

**Email invalide :**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```
**Attendu :** Erreur 400 avec message de validation

**Mot de passe trop court :**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "123",
    "firstName": "Test",
    "lastName": "User"
  }'
```
**Attendu :** Erreur 400 (password doit avoir min 6 caractères)

## 📊 Structure Créée

```
backend/src/
├── auth/
│   ├── decorators/
│   │   ├── get-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── auth.service.spec.ts
├── database/
│   └── database.module.ts
├── users/
│   ├── entities/
│   │   └── user.entity.ts
│   └── users.module.ts
├── app.module.ts
└── main.ts
```

## 🎯 Prochaines Étapes (Jour 2)

1. **Module Events**
   - Entity Event avec enum EventStatus
   - CRUD complet
   - Règles métier (capacité, statuts)

2. **Module Reservations**
   - Entity Reservation avec enum ReservationStatus
   - Validation capacité
   - Pas de doublon réservation

3. **Frontend Next.js**
   - Setup base
   - Pages auth
   - API client

## 🐛 Troubleshooting

### Erreur de connexion DB
```bash
# Vérifier que PostgreSQL est démarré
pg_isready

# Vérifier les credentials dans .env
```

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=3002
```

### Tests échouent
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run test
```

## 📝 Commits Git

```bash
git add .
git commit -m "SC2-1: Setup initial project structure"
git commit -m "SC2-2: Add User entity and database configuration"
git commit -m "SC2-3: Implement JWT authentication with guards"
git commit -m "SC2-4: Add authentication tests"
```

---

**✅ Jour 1 Terminé !** Backend auth fonctionnel avec tests.
