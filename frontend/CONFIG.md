# Configuration Frontend - CardMaster

## 🔧 Chemins des Assets

Les chemins suivants sont utilisés dans `index.html` :

### CSS
- `assets/css/style.css` - Styles personnalisés
- `assets/css/vendor/vendor.css` - Bibliothèques CSS
- `assets/css/vendor/normalize.css` - Reset CSS

### JavaScript
- `assets/js/script.js` - Scripts personnalisés
- `assets/js/plugins.js` - Configuration plugins
- `assets/js/modernizr.js` - Détection navigateur
- `assets/js/jquery-1.11.0.min.js` - jQuery

### Images
- `assets/images/logo.png` - Logo principal
- `assets/images/product-thumb-*.png` - Miniatures produits
- `assets/images/background-pattern.jpg` - Image de fond

## 📱 Configuration Responsive

### Breakpoints Bootstrap 5
```css
/* Extra small devices (phones) */
@media (max-width: 575.98px) { }

/* Small devices (landscape phones) */
@media (min-width: 576px) and (max-width: 767.98px) { }

/* Medium devices (tablets) */
@media (min-width: 768px) and (max-width: 991.98px) { }

/* Large devices (desktops) */
@media (min-width: 992px) and (max-width: 1199.98px) { }

/* Extra large devices (large desktops) */
@media (min-width: 1200px) { }
```

## 🎨 Couleurs et Thème

### Couleurs Principales (TCG Theme)
```css
:root {
  --primary-color: #0d6efd;      /* Bootstrap primary blue */
  --secondary-color: #6c757d;    /* Bootstrap secondary gray */
  --success-color: #198754;      /* Bootstrap success green */
  --danger-color: #dc3545;       /* Bootstrap danger red */
  --warning-color: #ffc107;      /* Bootstrap warning yellow */
  --info-color: #0dcaf0;         /* Bootstrap info cyan */
  
  /* TCG specific colors */
  --pokemon-color: #ffde00;      /* Pokemon yellow */
  --yugioh-color: #9c27b0;       /* Yu-Gi-Oh purple */
  --magic-color: #ff9800;        /* Magic orange */
  --lorcana-color: #2196f3;      /* Lorcana blue */
}
```

## 🚀 Performance

### Images Optimisées
- Format : JPG/PNG optimisé
- Taille max : 1920px largeur
- Compression : 80-85% qualité
- Miniatures : 300x300px

### Scripts
- jQuery : Version minifiée
- Plugins : Scripts essentiels uniquement
- Custom JS : Non minifié pour développement

## 📦 CDN Utilisés

### Bootstrap 5.3.0-alpha3
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
```

### Swiper.js 9
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js"></script>
```

### Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
```

## 🔍 SEO Configuration

### Meta Tags de Base
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Boutique spécialisée en cartes à collectionner TCG">
<meta name="keywords" content="TCG, cartes à collectionner, Pokemon, Yu-Gi-Oh, Magic, Lorcana, Altered">
```

### Open Graph (à ajouter)
```html
<meta property="og:title" content="CardMaster - Boutique TCG">
<meta property="og:description" content="Boutique spécialisée en cartes à collectionner">
<meta property="og:image" content="assets/images/logo.png">
<meta property="og:url" content="https://cardmaster.example.com">
```

## 🛠️ Outils de Développement

### Serveur Local Recommandé
```bash
# Live Server (VS Code Extension)
# ou Python HTTP Server
python -m http.server 3000
```

### Validation HTML
- [W3C Markup Validator](https://validator.w3.org/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)

### Testing Cross-Browser
- Chrome/Chromium (dernière version)
- Firefox (dernière version)
- Safari (sur macOS)
- Edge (dernière version)

## 📋 Checklist de Déploiement

### Avant Mise en Production
- [ ] Validation HTML W3C
- [ ] Test responsive sur différents appareils
- [ ] Optimisation des images
- [ ] Vérification des liens
- [ ] Test de performance (PageSpeed)
- [ ] Accessibilité WCAG 2.1 AA
- [ ] Test cross-browser

### Optimisations Production
- [ ] Minification CSS/JS
- [ ] Compression images (WebP)
- [ ] Cache browser
- [ ] Gzip compression
- [ ] Service Worker pour PWA

---

**Version** : 1.0.0
**Dernière mise à jour** : Août 2025
