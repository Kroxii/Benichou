![Status](https://img.shields.io/badge/Frontend-✅%20Complet-success   └── 📂 database/           # Gestion de base de données
       └── 📂 seeders/        # Scripts de données initiales
           ├── 📄 categoriesSeeder.js
           ├── 📄 productsSeeder.js
           └── 📄 usersSeeder.jss](https://img.shields.io/badge/Backend-🏗️%20Structure%20créée-warning)
![Version](https://img.shields.io/badge/Version-Frontend%20v1.0-blue)
![Last Update](https://img.shields.io/badge/Dernière%20mise%20à%20jour-Août%202025-lightgrey)

## � Table des Matières

1. [📁 Structure du Projet](#-structure-du-projet-mise-à-jour---août-2025)
2. [🎯 État Actuel du Projet](#-état-actuel-du-projet)
3. [🚀 Technologies Utilisées](#-technologies-utilisées)
4. [📝 Fonctionnalités et Progression](#-fonctionnalités-et-progression)
5. [🛠️ Installation et Développement](#️-installation-et-développement)
6. [📊 Modèle de Données](#-modèle-de-données-migrations-créées)
7. [🔄 Prochaines Étapes](#-prochaines-étapes-de-développement)
8. [🤝 Contribution et Standards](#-contribution-et-standards)
9. [📈 Métriques du Projet](#-métriques-du-projet)

## �📁 Structure du Projet (Mise à jour - Août 2025)

Ce projet est organisé avec une séparation claire entre le Front End et le Back End pour faciliter le développement, la maintenance et le déploiement.

```
Benichou/
├── 📂 frontend/                 # Interface utilisateur (Front End) ✅ IMPLÉMENTÉ
│   ├── 📄 index.html           # Page principale du site
│   ├── � README.md            # Documentation frontend
│   └── �📂 assets/              # Ressources statiques
│       ├── 📂 css/             # Fichiers de style
│       │   ├── 📄 style.css    # Styles personnalisés (1000+ lignes)
│       │   └── 📂 vendor/      # CSS de bibliothèques tierces
│       │       ├── 📄 normalize.css
│       │       └── 📄 vendor.css
│       ├── 📂 js/              # Scripts JavaScript
│       │   └── 📄 script.js    # Script principal avec Swiper.js
│       └── 📂 images/          # Images et ressources visuelles
│           ├── 📄 benichou.png # Logo principal
│           ├── � left.png     # Icône navigation gauche
│           └── 📄 right.png    # Icône navigation droite
│
├── 📂 backend/                 # Logique serveur (Back End) 🏗️ STRUCTURE CRÉÉE
│   ├── � package.json        # Configuration Node.js (vide)
│   ├── � server.js           # Serveur principal (vide)
│   ├── � README.md           # Documentation backend
│   ├── 📂 api/                # Points d'entrée API REST
│   │   ├── � index.js        # Point d'entrée API
│   │   └── 📄 routes.js       # Définition des routes
│   ├── 📂 controllers/        # Contrôleurs de logique métier
│   │   ├── 📄 orderController.js
│   │   ├── 📄 productController.js
│   │   └── 📄 userController.js
│   ├── 📂 models/             # Modèles de données
│   │   ├── � Category.js
│   │   ├── 📄 Order.js
│   │   ├── 📄 Product.js
│   │   └── 📄 User.js
│   ├── �📂 services/           # Services et logique métier
│   │   ├── 📄 authService.js
│   │   ├── � emailService.js
│   │   └── 📄 paymentService.js
│   ├── �📂 middleware/         # Middleware (auth, validation, etc.)
│   │   ├── 📄 auth.js
│   │   ├── 📄 cors.js
│   │   └── 📄 validation.js
│   ├── 📂 config/             # Configuration de l'application
│   │   ├── 📄 database.js
│   │   ├── 📄 environment.js
│   │   └── 📄 jwt.js
│   └── 📂 database/           # Gestion de base de données
│       ├── 📂 migrations/     # Scripts de migration
│       │   ├── � 001_create_users_table.js
│       │   ├── 📄 002_create_categories_table.js
│       │   ├── � 003_create_products_table.js
│       │   └── 📄 004_create_orders_table.js
│       └── 📂 seeders/        # Données de test/initialisation
│           ├── � categoriesSeeder.js
│           ├── 📄 productsSeeder.js
│           └── 📄 usersSeeder.js
│
├── 📄 README.md               # Ce fichier - Documentation principale
├── 📄 .gitignore             # Configuration Git
└── 📂 .git/                  # Dépôt Git
```

## 🎯 État Actuel du Projet

### ✅ Frontend - COMPLÈTEMENT IMPLÉMENTÉ
- **Interface utilisateur** : Site web moderne et responsive
- **Design System** : Bootstrap 5 + CSS personnalisé (1000+ lignes optimisées)
- **Navigation** : Carousels Swiper.js avec images personnalisées
- **Fonctionnalités** :
  - 🛒 Système de panier interactif
  - 🃏 Catalogue TCG par catégories (Pokemon, Yu-Gi-Oh!, Magic, etc.)
  - 📱 Design responsive (mobile, tablette, desktop)
  - 🎨 Animations CSS fluides et modernes
  - 🖼️ Images de navigation personnalisées (left.png, right.png)
  - 🔍 Barre de recherche
  - 📰 Section blog/actualités

### 🏗️ Backend - STRUCTURE CRÉÉE, IMPLÉMENTATION À COMPLÉTER
- **Architecture** : Structure MVC complète mise en place
- **Base de données** : Migrations et seeders préparés
- **API** : Points d'entrée définis mais non implémentés
- **Sécurité** : Middleware d'authentification et validation préparés
- **À implémenter** :
  - Configuration Node.js/Express
  - Connexion base de données
  - Logique métier des contrôleurs
  - API REST fonctionnelle
  - Système d'authentification JWT

## 🚀 Technologies Utilisées

### Frontend ✅ ACTUEL
- **HTML5** : Structure sémantique moderne
- **CSS3** : Variables CSS, Grid, Flexbox, animations
- **JavaScript (ES6+)** : Vanilla JS + Swiper.js pour les carousels
- **Bootstrap 5.3.2** : Framework CSS responsive (via CDN)
- **Swiper.js 11** : Carousels et sliders tactiles (via CDN)
- **jQuery 3.7.1** : Manipulation DOM (via CDN)
- **Iconify** : Système d'icônes moderne (via CDN)
- **Google Fonts** : Nunito & Open Sans

### Backend 🏗️ PRÉVU
- **Runtime** : Node.js avec Express.js (à configurer)
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **API Documentation** : Swagger/OpenAPI
- **Validation** : Middleware de validation des données
- **Sécurité** : CORS, authentification, autorisation
- **ODM** : Mongoose (MongoDB)

## 📝 Fonctionnalités et Progression

### ✅ Frontend - COMPLÈTES (100%)
- [x] **Page d'accueil** avec hero banner et carousels
- [x] **Navigation responsive** avec menu mobile off-canvas
- [x] **Catalogue TCG complet** :
  - [x] Catégories : Pokemon, Yu-Gi-Oh!, Magic, Lorcana, Altered, Riftbound
  - [x] Types : Boosters, Decks, Accessoires
  - [x] Carousels produits avec navigation personnalisée
- [x] **Système de panier avancé** :
  - [x] Ajout/suppression d'articles
  - [x] Calcul automatique du total
  - [x] Persistance visuelle
  - [x] Fonction "Vider le panier"
  - [x] Interface off-canvas moderne
- [x] **Design et UX** :
  - [x] Design responsive (mobile-first)
  - [x] Animations CSS fluides
  - [x] Variables CSS pour cohérence des couleurs
  - [x] Images de navigation personnalisées
  - [x] Effets hover et transitions
- [x] **Sections additionnelles** :
  - [x] Footer avec liens sociaux
  - [x] Newsletter signup
  - [x] Barre de recherche fonctionnelle

### 🔄 Backend - EN COURS (30%)
- [x] **Structure MVC** complète mise en place
- [x] **Architecture fichiers** organisée et documentée
- [x] **Migrations de base de données** :
  - [x] Table users (001)
  - [x] Table categories (002)  
  - [x] Table products (003)
  - [x] Table orders (004)
- [x] **Seeders préparés** :
  - [x] Categories seeder
  - [x] Products seeder
  - [x] Users seeder
- [ ] **À implémenter** :
  - [ ] Configuration package.json et dépendances
  - [ ] Serveur Express.js fonctionnel
  - [ ] Connexion base de données
  - [ ] Implémentation des contrôleurs
  - [ ] API REST endpoints
  - [ ] Système d'authentification JWT
  - [ ] Tests unitaires et d'intégration

## 🛠️ Installation et Développement

### Prérequis
- **Frontend** : Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- **Backend** : Node.js 16+ et npm (pour le développement futur)
- **Git** : Pour le versioning et la collaboration

### Frontend ✅ PRÊT À L'EMPLOI
```bash
# Cloner le projet
git clone https://github.com/Kroxii/Benichou.git
cd Benichou/frontend

# Option 1 : Ouvrir directement dans un navigateur
open index.html  # macOS
start index.html # Windows
firefox index.html # Linux

# Option 2 : Serveur local pour le développement (recommandé)
# Python
python -m http.server 8000

# Node.js (si installé)
npx serve .

# PHP (si installé)
php -S localhost:8000

# Puis ouvrir http://localhost:8000
```

**Fonctionnalités testées :**
- ✅ Design responsive sur tous les appareils
- ✅ Carousels Swiper.js fonctionnels
- ✅ Système de panier interactif
- ✅ Navigation et animations CSS

### Backend 🚧 À CONFIGURER
```bash
# Configuration initiale requise
cd backend
npm init -y  # Initialiser package.json
npm install express cors dotenv bcryptjs jsonwebtoken

# Créer le fichier .env
echo "PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret" > .env

# Lancer le serveur (une fois configuré)
npm start
```

**Prochaines étapes :**
1. Configuration package.json avec les dépendances
2. Implémentation du serveur Express dans server.js
3. Configuration de la base de données
4. Développement des contrôleurs et API
5. Tests d'intégration Frontend <-> Backend

### 🔧 Troubleshooting Frontend
**Problèmes fréquents et solutions :**

- **Images ne s'affichent pas** : Vérifier que vous utilisez un serveur local (pas file://)
- **Carousels ne fonctionnent pas** : Vérifier la connexion internet (CDN Swiper.js)
- **Responsive cassé** : Vérifier la viewport meta tag dans index.html
- **JavaScript erreurs** : Ouvrir les DevTools (F12) pour voir les erreurs console

**Support navigateurs :**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📊 Modèle de Données (Migrations Créées)

### 🗃️ Tables de Base de Données
- **Users** (001_create_users_table.js)
  - Informations personnelles et authentification
  - Adresses de livraison et facturation
  - Historique des préférences
  
- **Categories** (002_create_categories_table.js)
  - Pokemon, Yu-Gi-Oh!, Magic, Lorcana, etc.
  - Hiérarchie et métadonnées
  
- **Products** (003_create_products_table.js)
  - Cartes TCG, boosters, decks, accessoires
  - Prix, stock, descriptions, images
  - Relations avec catégories
  
- **Orders** (004_create_orders_table.js)
  - Commandes et historique d'achat
  - États de commande et paiements
  - Relations avec users et products

### 🌱 Données d'Initialisation (Seeders)
- **Categories** : Jeu de données complet pour toutes les catégories TCG
- **Products** : Catalogue de produits de démarrage
- **Users** : Comptes de test pour le développement

## 🔄 Prochaines Étapes de Développement

### Phase 1 : Backend Core (Priorité Haute)
1. **Configuration Node.js** (package.json, dépendances)
2. **Serveur Express** (routes de base, middleware)
3. **Base de données** (connexion, exécution des migrations)
4. **API Produits** (CRUD basique pour le catalogue)

### Phase 2 : Intégration Frontend-Backend
1. **API Panier** (synchronisation avec le frontend)
2. **Authentification** (JWT, login/register)
3. **Gestion des commandes** (workflow complet)

### Phase 3 : Fonctionnalités Avancées
1. **Paiement en ligne** (Stripe, PayPal)
2. **Interface d'administration** (gestion catalogue)
3. **Optimisations** (cache, CDN, performance)

## 🤝 Contribution et Standards

### Structure de Développement
- **Frontend** : Code prêt en production, optimisé et testé
- **Backend** : Architecture MVC établie, implémentation en cours
- **Documentation** : READMEs détaillés pour chaque partie

### Standards de Code
- **CSS** : Variables CSS, nomenclature BEM, responsive-first
- **JavaScript** : ES6+, code modulaire, commentaires explicatifs
- **Git** : Commits atomiques, messages descriptifs

### Pour Contribuer
1. **Frontend** : Améliorations UX, optimisations CSS, nouvelles fonctionnalités
2. **Backend** : Implémentation des contrôleurs, API REST, tests
3. **Full-Stack** : Intégration, performance, sécurité

---

## � Dépannage et Résolution de Problèmes

### 🔍 Problèmes Frontend
- **CSS non chargé** : Vérifiez les chemins relatifs dans `index.html`
- **Carrousel non fonctionnel** : Assurez-vous que Swiper.js est chargé correctement
- **Images manquantes** : Vérifiez le dossier `assets/images/` et les chemins
- **Responsive cassé** : Testez Bootstrap CDN et les media queries
- **Fonts non affichées** : Contrôlez la connexion Google Fonts

### 🔍 Problèmes Backend (Futurs)
- **Port déjà utilisé** : Modifiez `PORT` dans `.env`
- **Erreur de base de données** : Vérifiez la configuration dans `config/database.js`
- **JWT invalide** : Régénérez la `JWT_SECRET` dans `.env`
- **CORS bloqué** : Configurez les domaines autorisés dans `middleware/cors.js`

### 🛠️ Commandes Utiles
```bash
# Frontend - Serveur local simple
python -m http.server 8000
# ou
npx live-server

# Backend - Une fois implémenté
npm install --force
DEBUG=* npm start
npm run test:db

# Validation code
npx stylelint assets/css/style.css
npx html-validate index.html
```

### 📞 Support
- **Issues GitHub** : Signalez les bugs
- **Documentation** : README toujours à jour
- **Tests** : Validez sur différents navigateurs

---

## �📈 Métriques du Projet

**Frontend :** 
- 📄 1 page HTML complète et moderne
- 🎨 1000+ lignes de CSS optimisé et sans bugs
- ⚡ JavaScript moderne avec Swiper.js
- 🖼️ 3 images personnalisées intégrées
- 📱 100% responsive et accessible

**Backend :**
- 🏗️ Structure MVC complète (16 fichiers organisés)
- 🗃️ 4 migrations de base de données
- 🌱 3 seeders pour l'initialisation
- 📋 Architecture prête pour l'implémentation

---

**Version actuelle** : Frontend v2.0 - Site TCG complet avec navigation personnalisée  
**Prochaine version** : Backend v1.0 - API REST et base de données fonctionnelles  
**Date de mise à jour** : Août 2025

---

<div align="center">

### 🎯 CardMaster - E-commerce TCG

[![Frontend](https://img.shields.io/badge/Frontend-Production%20Ready-success?style=for-the-badge)](/)
[![Backend](https://img.shields.io/badge/Backend-In%20Development-orange?style=for-the-badge)](/)

**Développé avec ❤️ pour la communauté TCG**

*Un projet moderne alliant passion du jeu et excellence technique*

</div>
