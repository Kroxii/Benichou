# Backend - CardMaster TCG

## 📄 Description

API et logique serveur pour la boutique en ligne CardMaster spécialisée dans la vente de cartes à collectionner (TCG).

## 🚧 État du Développement

**Status : À développer**

Le backend n'est pas encore implémenté. Cette section contiendra la logique serveur, l'API REST, la base de données et les services métier.

## 🏗️ Architecture Prévue

```
backend/
├── 📂 api/                    # Points d'entrée API REST
│   ├── 📂 routes/            # Définition des routes
│   ├── 📂 validators/        # Validation des données
│   └── 📂 docs/              # Documentation API (Swagger)
│
├── 📂 controllers/           # Contrôleurs de logique métier
│   ├── 📄 ProductController.js
│   ├── 📄 CartController.js
│   ├── 📄 UserController.js
│   └── 📄 OrderController.js
│
├── 📂 models/                # Modèles de données
│   ├── 📄 Product.js
│   ├── 📄 User.js
│   ├── 📄 Cart.js
│   └── 📄 Order.js
│
├── 📂 services/              # Services et logique métier
│   ├── 📄 ProductService.js
│   ├── 📄 PaymentService.js
│   ├── 📄 EmailService.js
│   └── 📄 InventoryService.js
│
├── 📂 middleware/            # Middleware
│   ├── 📄 auth.js           # Authentification
│   ├── 📄 validation.js     # Validation des données
│   ├── 📄 logging.js        # Logging des requêtes
│   └── 📄 cors.js           # Configuration CORS
│
├── 📂 config/                # Configuration
│   ├── 📄 database.js       # Configuration BDD
│   ├── 📄 server.js         # Configuration serveur
│   ├── 📄 auth.js           # Configuration auth
│   └── 📄 payment.js        # Configuration paiement
│
└── 📂 database/              # Gestion de base de données
    └── 📂 seeders/           # Scripts de données initiales
        ├── 📄 categories.js
        ├── 📄 products.js
        └── 📄 users.js
```

## 🎯 Fonctionnalités Prévues

### 🔐 Authentification & Autorisation
- [ ] Inscription/Connexion utilisateur
- [ ] JWT Token management
- [ ] Rôles utilisateur (client, admin)
- [ ] Mot de passe oublié
- [ ] Vérification email

### 🛍️ Gestion des Produits
- [ ] CRUD produits TCG
- [ ] Catégories et filtres
- [ ] Gestion du stock
- [ ] Images multiples par produit
- [ ] Recherche et tri

### 🛒 Panier & Commandes
- [ ] API panier persistant
- [ ] Processus de commande
- [ ] États de commande
- [ ] Historique des achats
- [ ] Facturation

### 💳 Paiement
- [ ] Intégration Stripe/PayPal
- [ ] Gestion des transactions
- [ ] Remboursements
- [ ] Webhooks de paiement

### 📊 Administration
- [ ] Dashboard admin
- [ ] Statistiques de vente
- [ ] Gestion des utilisateurs
- [ ] Gestion de l'inventaire

## 🔧 Technologies Suggérées

### Runtime & Framework
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **TypeScript** : Typage statique (optionnel)

### Base de Données
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM pour MongoDB

### Authentification
- **JWT** : JSON Web Tokens
- **bcrypt** : Hash des mots de passe
- **Passport.js** : Stratégies d'authentification

### Paiement
- **Stripe** : Processeur de paiement principal
- **PayPal** : Alternative de paiement

### Monitoring & Logging
- **Winston** : Logging
- **Morgan** : HTTP request logger
- **Helmet** : Sécurité HTTP

### Tests
- **Jest** : Framework de test
- **Supertest** : Tests d'API
- **Faker.js** : Génération de données test

### Déploiement
- **Docker** : Containerisation
- **PM2** : Process manager
- **Nginx** : Reverse proxy

## 📋 API Endpoints Prévus

### Authentification
```
POST /api/auth/register      # Inscription
POST /api/auth/login         # Connexion
POST /api/auth/logout        # Déconnexion
POST /api/auth/refresh       # Refresh token
POST /api/auth/forgot        # Mot de passe oublié
```

### Produits
```
GET    /api/products         # Liste des produits
GET    /api/products/:id     # Détail produit
POST   /api/products         # Créer produit (admin)
PUT    /api/products/:id     # Modifier produit (admin)
DELETE /api/products/:id     # Supprimer produit (admin)
```

### Panier
```
GET    /api/cart             # Récupérer panier
POST   /api/cart/items       # Ajouter au panier
PUT    /api/cart/items/:id   # Modifier quantité
DELETE /api/cart/items/:id   # Retirer du panier
DELETE /api/cart             # Vider panier
```

### Commandes
```
GET    /api/orders           # Historique commandes
POST   /api/orders           # Créer commande
GET    /api/orders/:id       # Détail commande
PUT    /api/orders/:id       # Modifier commande (admin)
```

### Utilisateurs
```
GET    /api/users/profile    # Profil utilisateur
PUT    /api/users/profile    # Modifier profil
GET    /api/users/:id        # Détail utilisateur (admin)
```

## 🗃️ Structure de Base de Données (MongoDB)

### Collections Principales

#### Users
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (enum: 'user', 'admin'),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Categories
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  slug: String (unique),
  isActive: Boolean,
  sortOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Products
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: ObjectId (ref: 'Category'),
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  sku: String (unique),
  isActive: Boolean,
  isFeatured: Boolean,
  tags: [String],
  attributes: Map,
  rating: {
    average: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  user: ObjectId (ref: 'User'),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  status: String (enum),
  shippingAddress: Object,
  billingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  paymentDate: Date,
  shippingMethod: String,
  shippingCost: Number,
  trackingNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Plan de Développement

### Phase 1 : Foundation (2-3 semaines)
- [ ] Setup projet Node.js + Express
- [ ] Configuration MongoDB + Mongoose
- [ ] Authentification JWT
- [ ] API basique produits
- [ ] Tests unitaires

### Phase 2 : Core Features (3-4 semaines)
- [ ] API panier complet
- [ ] Système de commandes
- [ ] Intégration paiement
- [ ] Interface admin basique
- [ ] Documentation API

### Phase 3 : Advanced Features (2-3 semaines)
- [ ] Gestion du stock
- [ ] Notifications email
- [ ] Analytics et reporting
- [ ] Optimisations performance
- [ ] Monitoring

### Phase 4 : Production (1-2 semaines)
- [ ] Déploiement et CI/CD
- [ ] Tests d'intégration
- [ ] Monitoring production
- [ ] Sauvegardes automatiques

## 📚 Ressources de Développement

### Documentation
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [JWT.io](https://jwt.io/)

### Bonnes Pratiques
- Architecture REST
- Validation des données
- Gestion des erreurs
- Logging et monitoring
- Tests automatisés
- Sécurité (OWASP)

---

**Status** : 🚧 En attente de développement
**Estimation** : 8-12 semaines de développement
**Priorité** : Moyenne (après validation du frontend)
```

## 🗃️ Structure de Base de Données

### Tables Principales

#### Users
```sql
id (UUID, PK)
email (VARCHAR, UNIQUE)
password_hash (VARCHAR)
first_name (VARCHAR)
last_name (VARCHAR)
role (ENUM: 'customer', 'admin')
email_verified (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### Products
```sql
id (UUID, PK)
name (VARCHAR)
description (TEXT)
price (DECIMAL)
category_id (UUID, FK)
type (ENUM: 'booster', 'deck', 'accessory')
stock_quantity (INTEGER)
sku (VARCHAR, UNIQUE)
images (JSON)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### Orders
```sql
id (UUID, PK)
user_id (UUID, FK)
total_amount (DECIMAL)
status (ENUM: 'pending', 'paid', 'shipped', 'delivered', 'cancelled')
payment_intent_id (VARCHAR)
shipping_address (JSON)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### Order_Items
```sql
id (UUID, PK)
order_id (UUID, FK)
product_id (UUID, FK)
quantity (INTEGER)
unit_price (DECIMAL)
```

## 🚀 Plan de Développement

### Phase 1 : Foundation (2-3 semaines)
- [ ] Setup projet Node.js + Express
- [ ] Configuration base de données
- [ ] Authentification JWT
- [ ] API basique produits
- [ ] Tests unitaires

### Phase 2 : Core Features (3-4 semaines)
- [ ] API panier complet
- [ ] Système de commandes
- [ ] Intégration paiement
- [ ] Interface admin basique
- [ ] Documentation API

### Phase 3 : Advanced Features (2-3 semaines)
- [ ] Gestion du stock
- [ ] Notifications email
- [ ] Analytics et reporting
- [ ] Optimisations performance
- [ ] Monitoring

### Phase 4 : Production (1-2 semaines)
- [ ] Déploiement et CI/CD
- [ ] Tests d'intégration
- [ ] Monitoring production
- [ ] Sauvegardes automatiques

## 📚 Ressources de Développement

### Documentation
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [JWT.io](https://jwt.io/)

### Bonnes Pratiques
- Architecture REST
- Validation des données
- Gestion des erreurs
- Logging et monitoring
- Tests automatisés
- Sécurité (OWASP)

---

**Status** : 🚧 En attente de développement
**Estimation** : 8-12 semaines de développement
**Priorité** : Moyenne (après validation du frontend)
