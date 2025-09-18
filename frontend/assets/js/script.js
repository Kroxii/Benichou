/**
 * ===================================================================
 * BENICHOU TCG - SCRIPT UNIFIÉ
 * ===================================================================
 * Fusion de tous les gestionnaires JavaScript en un seul fichier
 * Comprend : UI, Authentification, Produits, Panier, Thème, Recherche
 * ===================================================================
 */

// ===================================================================
// 1. CONFIGURATION GLOBALE
// ===================================================================
window.CONFIG = {
  API_URL: 'http://localhost:3000/api',
  
  // Configuration de production - décommenter pour la prod
  // API_URL: 'https://api.benichou-tcg.com/api',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      PROFILE: '/auth/profile'
    },
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ORDERS: '/orders'
  }
};

// ===================================================================
// 2. GESTIONNAIRE DE SÉCURITÉ ET VALIDATION
// ===================================================================
window.Security = {
  // Clé de chiffrement dynamique basée sur la session
  getEncryptionKey: function() {
    return 'BenTCG2024_' + (window.sessionId || Date.now().toString(36));
  },

  // Chiffrement simple XOR pour les données sensibles
  encrypt: function(text) {
    if (!text) return '';
    const key = this.getEncryptionKey();
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  },

  decrypt: function(encryptedText) {
    if (!encryptedText) return '';
    try {
      const text = atob(encryptedText);
      const key = this.getEncryptionKey();
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch (e) {
      return '';
    }
  },

  // Stockage sécurisé
  secureStorage: {
    set: function(key, value) {
      try {
        const encryptedValue = Security.encrypt(JSON.stringify(value));
        localStorage.setItem('secure_' + key, encryptedValue);
      } catch (e) {
        console.warn('Erreur de stockage sécurisé:', e);
      }
    },

    get: function(key) {
      try {
        const encryptedValue = localStorage.getItem('secure_' + key);
        if (!encryptedValue) return null;
        const decryptedValue = Security.decrypt(encryptedValue);
        return JSON.parse(decryptedValue);
      } catch (e) {
        console.warn('Erreur de lecture sécurisée:', e);
        return null;
      }
    },

    remove: function(key) {
      localStorage.removeItem('secure_' + key);
    }
  },

  // Validation d'email
  validateEmail: function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validation de mot de passe
  validatePassword: function(password) {
    if (typeof password !== 'string') {
      return { valid: false, errors: ['Le mot de passe doit être une chaîne de caractères'] };
    }

    const errors = [];
    
    if (password.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
};

// ===================================================================
// 3. GESTIONNAIRE D'AUTHENTIFICATION
// ===================================================================
class AuthManager {
  constructor() {
    this.apiUrl = window.CONFIG?.API_URL || 'http://localhost:3000/api';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
    }

    // Reset password form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', (e) => this.handleResetPassword(e));
    }

    // Profile forms
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
      updateProfileForm.addEventListener('submit', (e) => this.updateProfile(e));
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', (e) => this.changePassword(e));
    }

    // Auto-verify email on verify page
    if (window.location.pathname.includes('verify-email.html')) {
      this.verifyEmailFromUrl();
    }

    // Load profile on profile page
    if (window.location.pathname.includes('profile.html')) {
      this.checkAuthAndLoadProfile();
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = 'index.html';
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Erreur de connexion au serveur</div>
      `;
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation côté client
    if (!Security.validateEmail(data.email)) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Format d'email invalide</div>
      `;
      return;
    }

    const passwordValidation = Security.validatePassword(data.password);
    if (!passwordValidation.valid) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ ${passwordValidation.errors.join('<br>')}</div>
      `;
      return;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      if (response.ok) {
        messageDiv.innerHTML = `
          <div class="success">
            ✅ ${result.message}
            <br><br>
            <a href="login.html" class="btn btn-primary">Se connecter maintenant</a>
          </div>
        `;
        document.getElementById('registerForm').reset();
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Erreur de connexion au serveur</div>
      `;
    }
  }

  async handleForgotPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      if (response.ok) {
        messageDiv.innerHTML = `
          <div class="success">
            ✅ ${result.message}
            <br><br>
            <strong>📧 Vérifiez votre boîte email</strong><br>
            Si un compte existe avec cette adresse, vous recevrez un lien de réinitialisation dans quelques minutes.
          </div>
        `;
        document.getElementById('forgotPasswordForm').reset();
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Erreur de connexion au serveur</div>
      `;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Envoyer le lien de réinitialisation';
    }
  }

  async handleResetPassword(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation côté client
    const passwordValidation = Security.validatePassword(data.password);
    if (!passwordValidation.valid) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ ${passwordValidation.errors.join('<br>')}</div>
      `;
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Token de réinitialisation manquant</div>
      `;
      return;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      if (response.ok) {
        messageDiv.innerHTML = `
          <div class="success">
            ✅ ${result.message}
            <br><br>
            <a href="login.html" class="btn btn-primary">Se connecter maintenant</a>
          </div>
        `;
        document.getElementById('resetPasswordForm').reset();
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Erreur de connexion au serveur</div>
      `;
    }
  }

  async verifyEmailFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Token de vérification manquant dans l'URL</div>
      `;
      return;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('message');
      
      if (response.ok) {
        messageDiv.innerHTML = `
          <div class="success">
            ✅ ${result.message}
            <br><br>
            <a href="login.html" class="btn btn-primary">Se connecter maintenant</a>
          </div>
        `;
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('message').innerHTML = `
        <div class="error">❌ Erreur de connexion au serveur</div>
      `;
    }
  }

  checkAuthAndLoadProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    this.loadProfile();
  }

  async loadProfile() {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        this.displayProfile(result.user);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
      }
    } catch (error) {
      console.error('Erreur:', error);
      document.getElementById('content').innerHTML = `
        <div class="error">Erreur de connexion au serveur</div>
      `;
    }
  }

  displayProfile(user) {
    const content = document.getElementById('content');
    if (!content) return;

    content.innerHTML = `
      <div class="user-info">
        <h2>Informations du compte</h2>
        <p><strong>Email:</strong> ${user.email} 
          <span class="status-badge ${user.isEmailVerified ? 'verified' : 'not-verified'}">
            ${user.isEmailVerified ? '✓ Vérifié' : '⚠ Non vérifié'}
          </span>
        </p>
        <p><strong>Nom d'utilisateur:</strong> ${user.username}</p>
        <p><strong>Nom complet:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Téléphone:</strong> ${user.phone || 'Non renseigné'}</p>
        <p><strong>Rôle:</strong> ${user.role}</p>
        <p><strong>Membre depuis:</strong> ${new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
      </div>
      
      <div class="section">
        <h3>📝 Modifier le profil</h3>
        <form id="updateProfileForm">
          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input type="text" id="firstName" name="firstName" value="${user.firstName}">
          </div>
          <div class="form-group">
            <label for="lastName">Nom</label>
            <input type="text" id="lastName" name="lastName" value="${user.lastName}">
          </div>
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input type="text" id="username" name="username" value="${user.username}">
          </div>
          <div class="form-group">
            <label for="phone">Téléphone</label>
            <input type="tel" id="phone" name="phone" value="${user.phone || ''}">
          </div>
          <button type="submit">Mettre à jour le profil</button>
        </form>
        <div id="updateMessage"></div>
      </div>
      
      <div class="section">
        <h3>🔒 Changer le mot de passe</h3>
        <form id="changePasswordForm">
          <div class="form-group">
            <label for="currentPassword">Mot de passe actuel</label>
            <input type="password" id="currentPassword" name="currentPassword" required>
          </div>
          <div class="form-group">
            <label for="newPassword">Nouveau mot de passe</label>
            <input type="password" id="newPassword" name="newPassword" required>
          </div>
          <button type="submit">Changer le mot de passe</button>
        </form>
        <div id="passwordMessage"></div>
      </div>
      
      <div class="section">
        <h3>⚠️ Zone de danger</h3>
        <p>Ces actions sont irréversibles.</p>
        <button class="danger-btn" onclick="authManager.deleteAccount()">Supprimer mon compte</button>
        <div id="deleteMessage"></div>
      </div>
    `;
    
    // Attacher spécifiquement les événements pour les nouveaux formulaires
    this.attachProfileFormEvents();
  }

  attachProfileFormEvents() {
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
      updateProfileForm.addEventListener('submit', (e) => this.updateProfile(e));
    }

    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', (e) => this.changePassword(e));
    }
  }

  async updateProfile(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('updateMessage');
      
      if (response.ok) {
        messageDiv.innerHTML = `<div class="success">✅ ${result.message}</div>`;
        localStorage.setItem('user', JSON.stringify(result.user));
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('updateMessage').innerHTML = `
        <div class="error">❌ Erreur de connexion</div>
      `;
    }
  }

  async changePassword(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      const messageDiv = document.getElementById('passwordMessage');
      
      if (response.ok) {
        messageDiv.innerHTML = `<div class="success">✅ ${result.message}</div>`;
        document.getElementById('changePasswordForm').reset();
      } else {
        messageDiv.innerHTML = `<div class="error">❌ ${result.error}</div>`;
      }
    } catch (error) {
      document.getElementById('passwordMessage').innerHTML = `
        <div class="error">❌ Erreur de connexion</div>
      `;
    }
  }

  async deleteAccount() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${this.apiUrl}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Votre compte a été supprimé avec succès.');
        this.logout();
      } else {
        document.getElementById('deleteMessage').innerHTML = `
          <div class="error">❌ ${result.error}</div>
        `;
      }
    } catch (error) {
      document.getElementById('deleteMessage').innerHTML = `
        <div class="error">❌ Erreur de connexion</div>
      `;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  }
}

// ===================================================================
// 4. GESTIONNAIRE DE THÈME (MODE SOMBRE/CLAIR)
// ===================================================================
class ThemeManager {
  constructor() {
    this.themeKey = 'user-theme-preference';
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupThemeToggle());
    } else {
      this.setupThemeToggle();
    }
  }

  setupThemeToggle() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.sunIcon = document.querySelector('.sun-icon');
    this.moonIcon = document.querySelector('.moon-icon');

    if (!this.themeToggle) return;

    this.loadSavedTheme();
    this.themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleTheme();
    });

    this.listenToSystemPreference();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.themeKey);
    
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    this.updateThemeIcons(theme);
    localStorage.setItem(this.themeKey, theme);
  }

  updateThemeIcons(theme) {
    if (!this.sunIcon || !this.moonIcon) return;
    
    if (theme === 'dark') {
      this.sunIcon.style.display = 'inline-block';
      this.moonIcon.style.display = 'none';
    } else {
      this.sunIcon.style.display = 'none';
      this.moonIcon.style.display = 'inline-block';
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  listenToSystemPreference() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.themeKey)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// ===================================================================
// 5. GESTIONNAIRE DE PANIER SÉCURISÉ
// ===================================================================
class SecureCartManager {
  constructor() {
    this.secureCart = [];
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeSecureCart());
    } else {
      this.initializeSecureCart();
    }
  }

  initializeSecureCart() {
    this.secureCart = Security.secureStorage.get('cardmaster_secure_cart') || [];
    this.exposeGlobalMethods();
    this.initCartButtons();
    this.initClearCartButton();
    this.updateCartDisplay();
  }

  exposeGlobalMethods() {
    window.addToCart = (productId, productName, productPrice) => {
      this.addToSecureCart(productId, productName, productPrice);
    };
    
    window.removeFromCart = (productId) => {
      this.removeFromSecureCart(productId);
    };
    
    window.clearCart = () => {
      this.clearSecureCart();
    };
  }

  addToSecureCart(productId, productName, productPrice) {
    const existingProduct = this.secureCart.find(item => item.id === productId);
    
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.secureCart.push({
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        quantity: 1,
        timestamp: Date.now()
      });
    }
    
    this.saveSecureCart();
    this.updateCartDisplay();
    this.showCartFeedback(productName);
  }

  removeFromSecureCart(productId) {
    this.secureCart = this.secureCart.filter(item => item.id !== productId);
    this.saveSecureCart();
    this.updateCartDisplay();
  }

  clearSecureCart() {
    this.secureCart = [];
    this.saveSecureCart();
    this.updateCartDisplay();
  }

  saveSecureCart() {
    Security.secureStorage.set('cardmaster_secure_cart', this.secureCart);
  }

  updateCartDisplay() {
    const cartCount = this.secureCart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = this.secureCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Mettre à jour le compteur du panier
    const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');
    cartCountElements.forEach(element => {
      element.textContent = cartCount;
      element.style.display = cartCount > 0 ? 'inline' : 'none';
    });
    
    // Mettre à jour le total
    const cartTotalElements = document.querySelectorAll('.cart-total, #cart-total');
    cartTotalElements.forEach(element => {
      element.textContent = cartTotal.toFixed(2) + ' €';
    });
    
    // Mettre à jour l'affichage détaillé du panier si présent
    this.updateCartModal();
  }

  updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    if (this.secureCart.length === 0) {
      cartItems.innerHTML = '<p class="text-center text-muted">Votre panier est vide</p>';
      return;
    }
    
    const cartHTML = this.secureCart.map(item => `
      <div class="cart-item d-flex justify-content-between align-items-center py-2 border-bottom">
        <div>
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted">Quantité: ${item.quantity}</small>
        </div>
        <div class="d-flex align-items-center">
          <span class="fw-bold me-2">${(item.price * item.quantity).toFixed(2)} €</span>
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">×</button>
        </div>
      </div>
    `).join('');
    
    cartItems.innerHTML = cartHTML;
  }

  initCartButtons() {
    // Observer pour les nouveaux boutons ajoutés dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            this.attachCartButtonEvents(node);
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Attacher aux boutons existants
    this.attachCartButtonEvents(document);
  }

  attachCartButtonEvents(container) {
    const cartButtons = container.querySelectorAll ? 
      container.querySelectorAll('.add-to-cart, [onclick*="addToCart"]') : [];
    
    cartButtons.forEach(button => {
      if (!button.hasAttribute('data-cart-attached')) {
        button.setAttribute('data-cart-attached', 'true');
        
        button.addEventListener('click', (e) => {
          const productId = button.getAttribute('data-product-id') || 
                          button.closest('[data-product-id]')?.getAttribute('data-product-id') || 
                          'product-' + Date.now();
          const productName = button.getAttribute('data-product-name') || 
                             button.closest('.product-card, .card')?.querySelector('.card-title, h5')?.textContent?.trim() || 
                             'Produit';
          const productPrice = button.getAttribute('data-product-price') || 
                              button.closest('.product-card, .card')?.querySelector('.fw-bold, .price')?.textContent?.replace(/[^\d.,]/g, '').replace(',', '.') || 
                              '0';
          
          this.addToSecureCart(productId, productName, productPrice);
        });
      }
    });
  }

  initClearCartButton() {
    const clearButton = document.getElementById('clear-cart');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir vider le panier ?')) {
          this.clearSecureCart();
        }
      });
    }
  }

  showCartFeedback(productName) {
    // Animation de feedback simple
    const existingFeedback = document.querySelector('.cart-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'cart-feedback position-fixed top-0 end-0 m-3 alert alert-success';
    feedback.style.zIndex = '9999';
    feedback.innerHTML = `✅ "${productName}" ajouté au panier`;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 3000);
  }
}

// ===================================================================
// 6. GESTIONNAIRE DE RECHERCHE
// ===================================================================
class SearchManager {
  constructor() {
    this.searchInput = null;
    this.searchResults = null;
    this.debounceTimer = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupSearch());
    } else {
      this.setupSearch();
    }
  }

  setupSearch() {
    this.searchInput = document.querySelector('#search-input, .search-input, input[type="search"]');
    
    if (!this.searchInput) return;

    // Créer le conteneur de résultats s'il n'existe pas
    this.createSearchResults();
    
    // Événements de recherche
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
    this.searchInput.addEventListener('focus', () => this.showSearchResults());
    this.searchInput.addEventListener('blur', () => {
      setTimeout(() => this.hideSearchResults(), 150);
    });
    
    // Fermer lors du clic ailleurs
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.hideSearchResults();
      }
    });
  }

  createSearchResults() {
    const existingResults = document.getElementById('search-results');
    if (existingResults) {
      this.searchResults = existingResults;
      return;
    }

    this.searchResults = document.createElement('div');
    this.searchResults.id = 'search-results';
    this.searchResults.className = 'search-results position-absolute bg-white border rounded shadow-lg d-none';
    this.searchResults.style.cssText = `
      top: 100%;
      left: 0;
      right: 0;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
    `;
    
    // Insérer après l'input de recherche
    const searchContainer = this.searchInput.closest('.search-container') || 
                           this.searchInput.parentElement;
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(this.searchResults);
  }

  handleSearch(e) {
    const query = e.target.value.trim();
    
    // Debounce pour éviter trop de requêtes
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        this.performSearch(query);
      } else {
        this.hideSearchResults();
      }
    }, 300);
  }

  performSearch(query) {
    // Simulation de recherche - à remplacer par une vraie API
    const mockResults = [
      { id: 1, name: 'Booster Pokemon', category: 'Pokemon', price: '4.99' },
      { id: 2, name: 'Deck Yu-Gi-Oh!', category: 'Yu-Gi-Oh!', price: '12.99' },
      { id: 3, name: 'Magic Booster', category: 'Magic', price: '15.99' },
      { id: 4, name: 'Protège-cartes', category: 'Accessoires', price: '3.99' }
    ].filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    this.displaySearchResults(mockResults, query);
  }

  displaySearchResults(results, query) {
    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="p-3 text-center text-muted">
          Aucun résultat pour "${query}"
        </div>
      `;
    } else {
      const resultsHTML = results.map(item => `
        <div class="search-result p-2 border-bottom" style="cursor: pointer;" 
             onmousedown="searchManager.selectResult('${item.id}', '${item.name}')">
          <div class="d-flex justify-content-between">
            <div>
              <strong>${this.highlightQuery(item.name, query)}</strong>
              <br>
              <small class="text-muted">${item.category}</small>
            </div>
            <span class="text-primary fw-bold">${item.price} €</span>
          </div>
        </div>
      `).join('');
      
      this.searchResults.innerHTML = resultsHTML;
    }
    
    this.showSearchResults();
  }

  highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  selectResult(productId, productName) {
    this.searchInput.value = productName;
    this.hideSearchResults();
    // Ici, vous pourriez rediriger vers la page du produit
    // console.log('Produit sélectionné:', productId, productName); // Debug uniquement
  }

  showSearchResults() {
    this.searchResults.classList.remove('d-none');
  }

  hideSearchResults() {
    this.searchResults.classList.add('d-none');
  }
}

// ===================================================================
// 7. GESTIONNAIRE DE PRODUITS
// ===================================================================
class ProductManager {
  constructor() {
    this.apiUrl = window.CONFIG?.API_URL || 'http://localhost:3000/api';
    this.products = [];
    this.categories = [];
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupProductManagement());
    } else {
      this.setupProductManagement();
    }
  }

  setupProductManagement() {
    this.loadProducts();
    this.loadCategories();
    this.setupProductFilters();
  }

  async loadProducts() {
    try {
      const response = await fetch(`${this.apiUrl}/products`);
      if (response.ok) {
        this.products = await response.json();
        this.displayProducts();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  }

  async loadCategories() {
    try {
      const response = await fetch(`${this.apiUrl}/categories`);
      if (response.ok) {
        this.categories = await response.json();
        this.displayCategories();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  }

  displayProducts() {
    const productContainer = document.querySelector('.products-grid, #products-container, .product-list');
    if (!productContainer || this.products.length === 0) return;

    const productsHTML = this.products.map(product => `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="product-card card h-100 border-0 shadow-sm" data-product-id="${product._id}">
          <div class="product-image">
            <img src="${product.images?.[0]?.url || '/assets/images/placeholder.jpg'}" 
                 class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted flex-grow-1">${product.description}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <span class="fw-bold text-primary fs-5">${product.price.toFixed(2)} €</span>
              <button class="btn btn-sm btn-primary add-to-cart" 
                      data-product-id="${product._id}"
                      data-product-name="${product.name}"
                      data-product-price="${product.price}">
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    productContainer.innerHTML = productsHTML;
  }

  displayCategories() {
    const categoryContainer = document.querySelector('.categories-grid, #categories-container');
    if (!categoryContainer || this.categories.length === 0) return;

    const categoriesHTML = this.categories.map(category => `
      <div class="col-md-4 mb-3">
        <a href="pages/${category.slug}.html" class="text-decoration-none">
          <div class="category-card card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title">${category.name}</h5>
              <p class="card-text text-muted">${category.description}</p>
            </div>
          </div>
        </a>
      </div>
    `).join('');

    categoryContainer.innerHTML = categoriesHTML;
  }

  setupProductFilters() {
    const filterButtons = document.querySelectorAll('.product-filter, [data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = button.getAttribute('data-filter');
        this.filterProducts(filter);
      });
    });
  }

  filterProducts(filter) {
    if (!filter || filter === 'all') {
      this.displayProducts();
      return;
    }

    const filteredProducts = this.products.filter(product => 
      product.category.slug === filter || 
      product.tags?.includes(filter)
    );

    // Utiliser temporairement les produits filtrés
    const originalProducts = this.products;
    this.products = filteredProducts;
    this.displayProducts();
    this.products = originalProducts;
  }
}

// ===================================================================
// 8. GESTIONNAIRE UI (SWIPER, CAROUSELS, ETC.)
// ===================================================================
(function($) {
  "use strict";

  var UIManager = {
    initChocolat: function() {
      if (typeof Chocolat !== 'undefined') {
        var imageLinks = document.querySelectorAll('.image-link');
        if (imageLinks.length > 0) {
          Chocolat(imageLinks, {
            imageSize: 'contain',
            loop: true,
          });
        }
      }
    },

    initSwiper: function() {
      if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return;
      }

      // Main swiper
      var mainSwiperEl = document.querySelector(".main-swiper");
      if (mainSwiperEl) {
        var swiper = new Swiper(".main-swiper", {
          speed: 500,
          loop: true,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
        });
      }

      // Category carousel
      var categorySwiperEl = document.querySelector(".category-carousel");
      if (categorySwiperEl) {
        var category_swiper = new Swiper(".category-carousel", {
          slidesPerView: 6,
          spaceBetween: 30,
          speed: 500,
          navigation: {
            nextEl: ".category-carousel-next",
            prevEl: ".category-carousel-prev",
          },
          breakpoints: {
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
            1500: { slidesPerView: 6 }
          }
        });
      }

      // Products carousel
      var productsSwiperEl = document.querySelector(".products-carousel");
      if (productsSwiperEl) {
        var products_swiper = new Swiper(".products-carousel", {
          slidesPerView: 5,
          spaceBetween: 30,
          speed: 500,
          navigation: {
            nextEl: ".products-carousel-next",
            prevEl: ".products-carousel-prev",
          },
          breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 3 },
            991: { slidesPerView: 4 },
            1500: { slidesPerView: 6 }
          }
        });
      }
    },

    initProductQty: function() {
      if (typeof $ !== 'undefined' && $('.product-qty').length > 0) {
        $('.product-qty').each(function(){
          var $el_product = $(this);
          
          $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val()) || 0;
            $el_product.find('#quantity').val(quantity + 1);
          });
          
          $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val()) || 0;
            if(quantity > 0){
              $el_product.find('#quantity').val(quantity - 1);
            }
          });
        });
      }
    },

    initJarallax: function() {
      if (typeof jarallax !== 'undefined') {
        var jarallaxElements = document.querySelectorAll(".jarallax");
        if (jarallaxElements.length > 0) {
          jarallax(jarallaxElements);
        }
        
        var jarallaxKeepImgElements = document.querySelectorAll(".jarallax-keep-img");
        if (jarallaxKeepImgElements.length > 0) {
          jarallax(jarallaxKeepImgElements, {
            keepImg: true,
          });
        }
      }
    },

    initAll: function() {
      try {
        this.initSwiper();
        this.initProductQty();
        this.initJarallax();
        this.initChocolat();
        // console.log('✅ All UI components initialized'); // Debug uniquement
      } catch (error) {
        console.error('❌ Error during UI initialization:', error);
      }
    }
  };

  // ===================================================================
  // 9. INITIALISATION GLOBALE
  // ===================================================================
  function initializeApp() {
    // Créer les instances globales des gestionnaires
    window.authManager = new AuthManager();
    window.themeManager = new ThemeManager();
    window.cartManager = new SecureCartManager();
    window.searchManager = new SearchManager();
    window.productManager = new ProductManager();
    
    // Initialiser les composants UI
    UIManager.initAll();
    
    // Fonction de déconnexion globale pour compatibilité
    window.logout = () => window.authManager.logout();
    
    // console.log('🚀 Benichou TCG - Application initialized successfully'); // Debug uniquement
  }

  // Initialisation avec jQuery si disponible, sinon vanilla JS
  if (typeof $ !== 'undefined') {
    $(document).ready(initializeApp);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
      initializeApp();
    }
  }

})(typeof jQuery !== 'undefined' ? jQuery : undefined);