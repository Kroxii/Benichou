# 🃏 Benichou TCG - Boutique de Cartes à Collectionner

## 📋 Description

Benichou est une boutique en ligne spécialisée dans les cartes à collectionner TCG (Trading Card Game). Le projet comprend :

- **Frontend** : Site web vitrine avec catalogue de produits
- **Backend** : API REST avec gestion des utilisateurs, produits et commandes
- **Base de données** : MongoDB pour le stockage des données

## 🚀 Démarrage Rapide

### 1. Prérequis

- **Node.js** (version 18+) : [Télécharger](https://nodejs.org/)
- **MongoDB** (une des options) :
  - Docker (recommandé) : [Télécharger](https://docs.docker.com/get-docker/)
  - Installation locale : [Guide MongoDB](https://docs.mongodb.com/manual/installation/)
  - MongoDB Atlas (cloud) : [Créer un compte](https://www.mongodb.com/cloud/atlas)

### 2. Installation

```bash
# Cloner le repository
git clone https://github.com/Kroxii/Benichou.git
cd Benichou

# Installer les dépendances backend
cd backend
npm install
```

### 3. Configuration de la Base de Données

#### Option A : Avec Docker (Recommandé)
```powershell
# Windows
./scripts/start-mongodb.ps1

# Linux/macOS
chmod +x scripts/start-mongodb.sh
./scripts/start-mongodb.sh
```

#### Option B : MongoDB Local
1. Installer MongoDB localement
2. Démarrer le service MongoDB
3. La configuration par défaut utilise `mongodb://localhost:27017/benichou_db`

#### Option C : MongoDB Atlas (Cloud)
1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Modifier le fichier `.env` avec votre URL de connexion :
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/benichou_db
```

### 4. Configuration Environment

Le fichier `.env` est déjà configuré avec des valeurs par défaut :

```env
# Configuration de base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/benichou_db

# Configuration JWT
JWT_SECRET=benichou_super_secret_jwt_key_2025
JWT_EXPIRES_IN=7d

# Configuration serveur
PORT=3000
NODE_ENV=development
```

### 5. Initialisation des Données

```bash
cd backend

# Tester la connexion à MongoDB
npm run test:connection

# Initialiser toutes les données (catégories, utilisateurs, produits)
npm run seed

# Ou initialiser séparément :
npm run seed:categories
npm run seed:users
npm run seed:products
```

### 6. Démarrage des Services

```bash
# Démarrer le serveur backend
cd backend
npm start

# Le serveur sera accessible sur http://localhost:3000
```

## 🛠 Commandes Disponibles

### Backend
```bash
# Démarrer le serveur en production
npm start

# Démarrer en mode développement (avec rechargement automatique)
npm run dev

# Tester la connexion à MongoDB
npm run test:connection

# Initialiser les données
npm run seed                # Toutes les données
npm run seed:categories     # Seulement les catégories
npm run seed:users         # Seulement les utilisateurs
npm run seed:products      # Seulement les produits

# Afficher les données existantes
npm run show:data
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/profile` - Profil utilisateur (authentifié)

### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:slug` - Détails d'une catégorie

### Produits
- `GET /api/products` - Liste des produits (avec pagination)
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/category/:categorySlug` - Produits par catégorie
- `GET /api/products/search?q=terme` - Recherche de produits

### Commandes (Authentifiées)
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Commandes de l'utilisateur
- `GET /api/orders/:id` - Détails d'une commande

### Utilitaires
- `GET /api/health` - Status de l'API
- `GET /api/` - Documentation des endpoints

## 🗄 Modèles de Données

### Catégories
- Pokemon, Yu-Gi-Oh!, Magic: The Gathering, Lorcana, Altered, Riftbound, Accessoires

### Utilisateurs
- Clients et administrateurs avec authentification JWT

### Produits
- Boosters, decks, cartes singles avec gestion des stocks

### Commandes
- Panier, adresses, statuts de commande, historique

## 🔧 Dépannage

### Erreur de connexion MongoDB
```bash
# Vérifier si MongoDB est démarré
docker ps | grep mongo

# Redémarrer MongoDB avec Docker
docker restart benichou-mongodb

# Tester la connexion
cd backend
npm run test:connection
```

### Erreur de port occupé
```bash
# Changer le port dans .env
PORT=3001

# Ou tuer le processus utilisant le port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

### Problèmes de dépendances
```bash
# Nettoyer et réinstaller
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Déploiement

### Prérequis Production
1. Serveur Node.js (PM2 recommandé)
2. MongoDB (Atlas recommandé pour la production)
3. Certificat SSL pour HTTPS
4. Nom de domaine

### Variables d'environnement Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/benichou_prod
JWT_SECRET=your-super-secure-secret-key-here
PORT=3000
```

## 📞 Support

- **Repository** : [GitHub](https://github.com/Kroxii/Benichou)
- **Issues** : [Signaler un problème](https://github.com/Kroxii/Benichou/issues)

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.
