# 🎴 Benichou TCG - Boutique de Cartes à Collectionner

> **Plateforme complète de vente en ligne spécialisée dans les TCG (Trading Card Games)**  
> Stack : Node.js + Express + MongoDB + Frontend responsive

---

## 🏗️ Architecture Simplifiée

### 📂 **Backend** (API REST - Node.js)
```
backend/
├── 📁 api/           # Routes et configuration Express
├── 📁 controllers/   # Logique métier (users, products, orders)
├── 📁 models/        # Schémas MongoDB (User, Product, Category, Order)
├── 📁 services/      # Services (auth, email, payment)
├── 📁 middleware/    # Sécurité, validation, CORS
├── 📁 config/        # Base de données, JWT, environnement
├── 📁 database/      # Seeders et données initiales
└── 📄 server.js      # Point d'entrée (port 3001)
```

### 📂 **Frontend** (Interface utilisateur)
```
frontend/
├── 📄 index.html         # Page d'accueil
├── 📁 pages/             # Catalogues TCG (Pokemon, Yu-Gi-Oh!, Magic...)
├── 📁 assets/css/        # Styles (Bootstrap + custom)
├── 📁 assets/js/         # Scripts interactifs
├── 📁 assets/images/     # Visuels et logos
├── 📄 login.html         # Authentification
└── 📄 register.html      # Inscription
```

---

## 🔧 **Stack Technique**

| **Backend** | **Frontend** |
|-------------|--------------|
| Node.js 18+ | HTML5 + CSS3 |
| Express.js | Bootstrap 5.3 |
| MongoDB Atlas | JavaScript ES6+ |
| JWT Auth | Swiper.js |
| Nodemailer | Responsive Design |

---

## 📡 **API Endpoints Essentiels**

```http
# 🔐 Authentification
POST   /api/auth/register     # Inscription
POST   /api/auth/login        # Connexion  
GET    /api/auth/profile      # Profil utilisateur

# 📦 Produits TCG
GET    /api/products          # Liste des produits
GET    /api/products/:id      # Détail produit
GET    /api/categories        # Catégories TCG

# 🛒 Commandes
POST   /api/orders            # Nouvelle commande
GET    /api/orders            # Historique utilisateur
```

---

## ✨ **Fonctionnalités**

### ✅ **Implémentées**
- 🔐 Système d'authentification JWT complet
- 📧 Validation par email avec Nodemailer  
- 👤 Gestion utilisateurs (inscription, connexion, profil)
- 🔑 Réinitialisation de mot de passe
- 📱 Interface responsive avec Bootstrap
- 🎴 Catalogues par jeu TCG (Pokemon, Yu-Gi-Oh!, Magic...)
- 🗄️ Base de données MongoDB avec seeders

### 🔄 **En Développement**
- 🛒 Système de commandes complet
- 💳 Intégration paiement (Stripe/PayPal)
- 📦 Gestion des stocks produits
- 👨‍💼 Panel administrateur

---

## 🛠️ **Scripts de Développement**

```bash
# Backend
npm start              # Démarrer le serveur
npm run dev            # Mode développement avec nodemon
npm run seed           # Initialiser les données de test

# Frontend  
npx http-server -p 3000           # Serveur statique
npx live-server --port=3000       # Avec rechargement automatique
```

---

## 📖 **Documentation**

- **API Documentation** : `GET http://localhost:3000/api`
- **Health Check** : `GET http://localhost:3000/api/health`

### Exemple d'utilisation API :
```javascript
// Inscription utilisateur
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe'
  })
});
```

---

**Version** ![Version](https://img.shields.io/badge/Version-%20v0.4.2-red)
**Statut** : En développement actif  
**Stack** : Node.js + Express + MongoDB + Bootstrap | **Port** : Backend 3001, Frontend 3000
