# Frontend - CardMaster TCG

## 📄 Description

Interface utilisateur de la boutique en ligne CardMaster spécialisée dans la vente de cartes à collectionner (TCG).

## 🏗️ Structure des Fichiers

```
frontend/
├── 📄 index.html              # Page principale
├── 📂 assets/                 # Ressources statiques
│   ├── 📂 css/               # Feuilles de style
│   │   ├── 📄 style.css      # Styles personnalisés du site
│   │   └── 📂 vendor/        # Bibliothèques CSS tierces
│   ├── 📂 js/                # Scripts JavaScript
│   ├── 📂 images/            # Images et médias
│   └── 📂 fonts/             # Polices personnalisées
├── 📂 pages/                 # Pages additionnelles (futures)
├── 📂 components/            # Composants réutilisables (futures)
└── 📂 layouts/               # Templates de mise en page (futures)
```

## ✨ Fonctionnalités

### 🛒 Système de Panier
- Affichage des articles ajoutés
- Calcul automatique du total
- Fonction "Vider le panier" avec confirmation
- Synchronisation entre panier et en-tête
- Animations fluides lors des interactions

### 🃏 Catalogue TCG
- Catégories : Pokemon, Yu-Gi-Oh!, Magic, Lorcana, Altered, etc.
- Produits par type : Boosters, Decks, Accessoires
- Navigation par onglets
- Images de produits et descriptions

### 📱 Design Responsive
- Compatible mobile, tablette et desktop
- Navigation adaptative
- Menus off-canvas pour mobile
- Carrousels tactiles

### 🎨 Interface Utilisateur
- Design moderne avec Bootstrap 5
- Animations CSS fluides
- Carrousels Swiper.js
- Effets hover et transitions

## 🔧 Technologies

- **HTML5** : Structure sémantique
- **CSS3** : Styles et animations, Flexbox, Grid
- **JavaScript ES6+** : Logique interactive
- **Bootstrap 5.3** : Framework CSS responsive
- **Swiper.js 9** : Carrousels et sliders
- **jQuery 1.11** : Manipulation DOM (legacy)

## 🚀 Lancement du Projet

### Méthode 1 : Ouverture directe
```bash
# Ouvrir directement dans le navigateur
open frontend/index.html
```

### Méthode 2 : Serveur local (recommandé)
```bash
# Avec Python 3
cd frontend
python -m http.server 3000

# Avec Node.js (si http-server est installé)
cd frontend
npx http-server -p 3000

# Avec PHP
cd frontend
php -S localhost:3000
```

Puis ouvrir : `http://localhost:3000`

## 📂 Organisation des Assets

### CSS
- `style.css` : Styles personnalisés du site TCG
- `vendor/vendor.css` : Styles des bibliothèques tierces
- `vendor/normalize.css` : Reset CSS

### JavaScript
- `script.js` : Scripts personnalisés du site
- `plugins.js` : Configuration des plugins
- `modernizr.js` : Détection des fonctionnalités navigateur
- `jquery-1.11.0.min.js` : Bibliothèque jQuery

### Images
- `logo.png` : Logo CardMaster
- `product-thumb-*` : Miniatures des produits
- `ad-image-*` : Images publicitaires
- `post-thumb-*` : Images des articles de blog
- `chocolat/` : Assets du plugin lightbox

## 🎯 Pages et Sections

### Page Principale (`index.html`)
1. **Header** : Navigation, recherche, panier
2. **Hero Banner** : Carrousel promotionnel
3. **Catégories** : Navigation par type de cartes
4. **Nouveaux Produits** : Dernières arrivées
5. **Produits Tendance** : Onglets par jeu (Pokemon, Yu-Gi-Oh!, Magic)
6. **Blog/Actualités** : Derniers articles TCG
7. **Footer** : Liens utiles et newsletter

### Futures Pages (à développer)
- `pages/products.html` : Catalogue complet
- `pages/product-detail.html` : Détail d'un produit
- `pages/cart.html` : Page panier complète
- `pages/checkout.html` : Processus de commande
- `pages/account.html` : Compte utilisateur
- `pages/about.html` : À propos

## 🛠️ Développement

### Conventions de Code
- **HTML** : Indentation 2 espaces, balises en minuscules
- **CSS** : BEM methodology, mobile-first
- **JavaScript** : ES6+, camelCase, documentation JSDoc

### Structure CSS
```css
/* 1. Reset et base */
/* 2. Typography */
/* 3. Layout */
/* 4. Components */
/* 5. Pages spécifiques */
/* 6. Utilities */
/* 7. Media queries */
```

### Organisation JavaScript
```javascript
// 1. Variables globales
// 2. Fonctions utilitaires
// 3. Gestionnaires d'événements
// 4. Initialisation
// 5. DOM ready
```

## 🐛 Débogage

### Console Browser
```javascript
// Debug du panier
console.log('Articles panier:', document.querySelectorAll('#cart-items li[data-item]'));

// Debug des totaux
console.log('Total panier:', document.getElementById('total-amount').textContent);
```

### Problèmes Courants
1. **Images non affichées** : Vérifier les chemins `assets/images/`
2. **CSS non appliqué** : Vérifier les chemins `assets/css/`
3. **JavaScript non fonctionnel** : Vérifier les chemins `assets/js/`

## 📈 Performance

### Optimisations Actuelles
- Images optimisées (format, taille)
- CSS minifié pour les vendors
- JavaScript non-bloquant

### Améliorations Futures
- Lazy loading des images
- Compression Gzip
- Cache browser
- Service Worker pour PWA
- WebP pour les images

## 🔮 Évolutions Prévues

### Court Terme
- [ ] Pages de détail produit
- [ ] Système de recherche avancé
- [ ] Wishlist utilisateur
- [ ] Comparateur de produits

### Moyen Terme
- [ ] Progressive Web App (PWA)
- [ ] Mode sombre/clair
- [ ] Multilingue (FR/EN)
- [ ] Accessibilité WCAG 2.1

### Long Terme
- [ ] Application mobile (React Native/Flutter)
- [ ] Réalité augmentée pour les cartes
- [ ] Chatbot d'assistance
- [ ] Personnalisation UI

---

**Dernière mise à jour** : Août 2025
**Version** : 1.0.0
**Maintenance** : Active
