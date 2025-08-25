# CardMaster - Boutique TCG

## 📁 Structure du Projet

Ce projet est organisé avec une séparation claire entre le Front End et le Back End pour faciliter le développement, la maintenance et le déploiement.

```
Benichou/
├── 📂 frontend/                 # Interface utilisateur (Front End)
│   ├── 📄 index.html           # Page principale du site
│   ├── 📂 assets/              # Ressources statiques
│   │   ├── 📂 css/             # Fichiers de style
│   │   │   ├── 📄 style.css    # Styles personnalisés
│   │   │   └── 📂 vendor/      # CSS de bibliothèques tierces
│   │   │       ├── 📄 vendor.css
│   │   │       ├── 📄 normalize.css
│   │   │       └── 📄 ajax-loader.gif
│   │   ├── 📂 js/              # Scripts JavaScript
│   │   │   ├── 📄 jquery-1.11.0.min.js
│   │   │   ├── 📄 modernizr.js
│   │   │   ├── 📄 plugins.js
│   │   │   └── 📄 script.js
│   │   ├── 📂 images/          # Images et ressources visuelles
│   │   │   ├── 📄 logo.png
│   │   │   ├── 📂 chocolat/    # Plugin lightbox
│   │   │   └── 📄 ...         # Toutes les images du site
│   │   └── 📂 fonts/          # Polices personnalisées
│   ├── 📂 pages/              # Pages HTML additionnelles
│   ├── 📂 components/         # Composants réutilisables
│   └── 📂 layouts/            # Templates et mises en page
│
├── 📂 backend/                 # Logique serveur (Back End) - À développer
│   ├── 📂 api/                # Points d'entrée API REST
│   ├── 📂 controllers/        # Contrôleurs de logique métier
│   ├── 📂 models/             # Modèles de données
│   ├── 📂 services/           # Services et logique métier
│   ├── 📂 middleware/         # Middleware (auth, validation, etc.)
│   ├── 📂 config/             # Configuration de l'application
│   └── 📂 database/           # Gestion de base de données
│       ├── 📂 migrations/     # Scripts de migration
│       └── 📂 seeders/        # Données de test/initialisation
│
├── 📂 shared/                 # Code partagé entre Front et Back
├── 📂 docs/                   # Documentation du projet
├── 📂 tests/                  # Tests automatisés
├── 📄 README.md              # Ce fichier
└── 📄 readme.txt             # Ancien fichier readme
```

## 🎯 Objectifs de l'Architecture

### Frontend
- **Pages statiques** : HTML, CSS, JavaScript pur pour les interfaces utilisateur
- **Responsive Design** : Compatible mobile, tablette et desktop
- **Expérience utilisateur** : Navigation fluide, animations CSS
- **Gestion du panier** : JavaScript pour les interactions en temps réel

### Backend (À développer)
- **API REST** : Endpoints pour la gestion des produits, commandes, utilisateurs
- **Base de données** : Stockage des cartes TCG, inventaire, commandes
- **Authentification** : Système de connexion utilisateur
- **Paiement** : Intégration avec des systèmes de paiement
- **Administration** : Interface pour gérer le catalogue

## 🚀 Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles et animations
- **JavaScript (Vanilla)** : Interactivité
- **Bootstrap 5** : Framework CSS responsive
- **Swiper.js** : Carrousels et sliders
- **jQuery** : Manipulation DOM (legacy)

### Backend (Technologies suggérées)
- **Node.js** avec Express.js
- **Base de données** : PostgreSQL ou MongoDB
- **Authentification** : JWT ou sessions
- **API Documentation** : Swagger/OpenAPI

## 📝 Fonctionnalités Actuelles

### ✅ Implémentées (Frontend)
- [x] Page d'accueil avec catalogue TCG
- [x] Navigation par catégories (Pokemon, Yu-Gi-Oh!, Magic, etc.)
- [x] Système de panier avec :
  - [x] Ajout d'articles
  - [x] Affichage du total
  - [x] Fonction "Vider le panier"
- [x] Design responsive
- [x] Blog/actualités TCG
- [x] Footer avec liens utiles

### 🔄 À développer (Backend)
- [ ] Base de données produits
- [ ] Système d'authentification
- [ ] API de gestion du panier
- [ ] Processus de commande
- [ ] Gestion des stocks
- [ ] Interface d'administration
- [ ] Système de paiement

## 🛠️ Installation et Développement

### Frontend
1. Ouvrir `frontend/index.html` dans un navigateur
2. Pour le développement, utiliser un serveur local (Live Server, etc.)

### Backend (À venir)
Instructions d'installation et de configuration à définir lors du développement.

## 📊 Structure des Données (Prévue)

### Produits TCG
- Nom, description, prix
- Catégorie (Pokemon, Yu-Gi-Oh!, Magic, etc.)
- Type (Booster, Deck, Accessoire)
- Stock disponible
- Images et métadonnées

### Utilisateurs
- Informations personnelles
- Historique des commandes
- Liste de souhaits
- Adresses de livraison

## 🤝 Contribution

Pour contribuer au projet :
1. Respecter la structure Front/Back End
2. Documenter les nouvelles fonctionnalités
3. Tester sur différents navigateurs (Frontend)
4. Utiliser des tests unitaires (Backend)

---

**Version actuelle** : Frontend v1.0 - Site TCG fonctionnel
**Prochaine étape** : Développement du Backend et API