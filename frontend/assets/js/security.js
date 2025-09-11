/**
 * 🔒 MODULE DE SÉCURITÉ - PROTECTION CONTRE LES INJECTIONS
 * Protection complète contre XSS, injection HTML, injection CSS et autres attaques
 */

(function(window) {
  'use strict';

  const Security = {
    
    /**
     * 🛡️ SANITISATION DES CHAÎNES DE CARACTÈRES
     */
    sanitizeText: function(text) {
      if (typeof text !== 'string') {
        return '';
      }
      
      // Nettoyer les caractères dangereux
      return text
        .replace(/[<>'"&]/g, function(match) {
          const htmlEntities = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
          };
          return htmlEntities[match];
        })
        .replace(/javascript:/gi, '') // Supprimer javascript:
        .replace(/data:/gi, '') // Supprimer data:
        .replace(/vbscript:/gi, '') // Supprimer vbscript:
        .replace(/on\w+\s*=/gi, '') // Supprimer les événements onclick, onload, etc.
        .trim();
    },

    /**
     * 🛡️ SANITISATION STRICTE POUR HTML
     */
    sanitizeHTML: function(html) {
      if (typeof html !== 'string') {
        return '';
      }

      // Liste des balises autorisées (très restrictive)
      const allowedTags = ['b', 'i', 'em', 'strong', 'span'];
      const allowedAttributes = [];

      // Supprimer toutes les balises non autorisées
      let cleaned = html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, function(match, tagName) {
        if (allowedTags.includes(tagName.toLowerCase())) {
          return `<${tagName.toLowerCase()}>`;
        }
        return '';
      });

      // Supprimer les scripts et styles
      cleaned = cleaned
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
        .replace(/<object[^>]*>[\s\S]*?<\/object>/gi, '')
        .replace(/<embed[^>]*>/gi, '')
        .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');

      return this.sanitizeText(cleaned);
    },

    /**
     * 🛡️ VALIDATION DES EMAILS
     */
    validateEmail: function(email) {
      if (typeof email !== 'string') {
        return false;
      }
      
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return emailRegex.test(email) && email.length <= 254;
    },

    /**
     * 🛡️ VALIDATION DES MOTS DE PASSE
     */
    validatePassword: function(password) {
      if (typeof password !== 'string') {
        return { valid: false, errors: ['Le mot de passe doit être une chaîne de caractères'] };
      }

      const errors = [];
      
      if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères');
      }
      
      if (password.length > 128) {
        errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
      }
      
      if (!/[a-z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
      }
      
      if (!/\d/.test(password)) {
        errors.push('Le mot de passe doit contenir au moins un chiffre');
      }
      
      // Vérifier les caractères interdits
      if (/[<>'"&]/.test(password)) {
        errors.push('Le mot de passe contient des caractères interdits');
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    },

    /**
     * 🛡️ VALIDATION DES NOMS D'UTILISATEUR
     */
    validateUsername: function(username) {
      if (typeof username !== 'string') {
        return { valid: false, errors: ['Le nom d\'utilisateur doit être une chaîne de caractères'] };
      }

      const errors = [];
      
      if (username.length < 3) {
        errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      }
      
      if (username.length > 50) {
        errors.push('Le nom d\'utilisateur ne peut pas dépasser 50 caractères');
      }
      
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores');
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    },

    /**
     * 🛡️ VALIDATION DES NOMS/PRÉNOMS
     */
    validateName: function(name) {
      if (typeof name !== 'string') {
        return { valid: false, errors: ['Le nom doit être une chaîne de caractères'] };
      }

      const errors = [];
      
      if (name.length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
      }
      
      if (name.length > 50) {
        errors.push('Le nom ne peut pas dépasser 50 caractères');
      }
      
      // Autoriser uniquement les lettres, espaces, apostrophes et tirets
      if (!/^[a-zA-ZÀ-ÿ\s'\-]+$/.test(name)) {
        errors.push('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets');
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    },

    /**
     * 🛡️ PROTECTION CONTRE LES INJECTIONS SQL (pour les requêtes côté client)
     */
    sanitizeSQLInput: function(input) {
      if (typeof input !== 'string') {
        return '';
      }
      
      return input
        .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
          switch (char) {
            case "\0": return "\\0";
            case "\x08": return "\\b";
            case "\x09": return "\\t";
            case "\x1a": return "\\z";
            case "\n": return "\\n";
            case "\r": return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%": return "\\" + char;
            default: return char;
          }
        })
        .replace(/;|\-\-|\/\*|\*\/|xp_|sp_/gi, ''); // Supprimer les commandes SQL communes
    },

    /**
     * 🛡️ VALIDATION DES PRIX
     */
    validatePrice: function(price) {
      const numPrice = parseFloat(price);
      return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99;
    },

    /**
     * 🛡️ VALIDATION DES QUANTITÉS
     */
    validateQuantity: function(quantity) {
      const numQuantity = parseInt(quantity);
      return !isNaN(numQuantity) && numQuantity >= 0 && numQuantity <= 9999;
    },

    /**
     * 🛡️ SÉCURISATION DES DONNÉES DE FORMULAIRE
     */
    secureFormData: function(formData) {
      const securedData = {};
      
      for (const [key, value] of Object.entries(formData)) {
        // Nettoyer la clé
        const cleanKey = this.sanitizeText(key);
        
        // Nettoyer la valeur selon le type
        let cleanValue;
        if (typeof value === 'string') {
          cleanValue = this.sanitizeText(value);
        } else if (typeof value === 'number') {
          cleanValue = isNaN(value) ? 0 : value;
        } else if (typeof value === 'boolean') {
          cleanValue = Boolean(value);
        } else {
          cleanValue = '';
        }
        
        securedData[cleanKey] = cleanValue;
      }
      
      return securedData;
    },

    /**
     * 🛡️ CRÉATION SÉCURISÉE D'ÉLÉMENTS DOM
     */
    createSecureElement: function(tagName, textContent, attributes = {}) {
      // Vérifier que le nom de balise est autorisé
      const allowedTags = ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'input', 'label', 'img', 'a', 'li', 'ul', 'ol'];
      if (!allowedTags.includes(tagName.toLowerCase())) {
        throw new Error('Balise HTML non autorisée: ' + tagName);
      }

      const element = document.createElement(tagName);
      
      // Définir le texte de manière sécurisée
      if (textContent) {
        element.textContent = this.sanitizeText(textContent);
      }
      
      // Définir les attributs de manière sécurisée
      const allowedAttributes = ['class', 'id', 'href', 'src', 'alt', 'title', 'data-price', 'data-name', 'data-description'];
      for (const [attr, value] of Object.entries(attributes)) {
        if (allowedAttributes.includes(attr.toLowerCase())) {
          element.setAttribute(attr, this.sanitizeText(value));
        }
      }
      
      return element;
    },

    /**
     * 🛡️ PROTECTION CONTRE LES ATTAQUES CSRF
     */
    generateCSRFToken: function() {
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * 🛡️ STOCKAGE SÉCURISÉ DANS LE LOCALSTORAGE
     */
    secureStorage: {
      set: function(key, value) {
        try {
          const secureKey = Security.sanitizeText(key);
          const secureValue = Security.sanitizeText(JSON.stringify(value));
          localStorage.setItem(secureKey, secureValue);
          return true;
        } catch (error) {
          console.error('Erreur de stockage sécurisé:', error);
          return false;
        }
      },
      
      get: function(key) {
        try {
          const secureKey = Security.sanitizeText(key);
          const value = localStorage.getItem(secureKey);
          return value ? JSON.parse(value) : null;
        } catch (error) {
          console.error('Erreur de récupération sécurisée:', error);
          return null;
        }
      },
      
      remove: function(key) {
        try {
          const secureKey = Security.sanitizeText(key);
          localStorage.removeItem(secureKey);
          return true;
        } catch (error) {
          console.error('Erreur de suppression sécurisée:', error);
          return false;
        }
      }
    },

    /**
     * 🛡️ PROTECTION CONTRE LE CLICKJACKING
     */
    preventClickjacking: function() {
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    },

    /**
     * 🛡️ INITIALISATION DES PROTECTIONS
     */
    init: function() {
      // Protection contre le clickjacking
      this.preventClickjacking();
      
      // Masquer les erreurs de console en production
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = console.warn = console.error = function() {};
      }
      
      // Protection contre l'ouverture d'onglets malveillants
      window.addEventListener('beforeunload', function() {
        window.opener = null;
      });
      
      console.log('🔒 Module de sécurité initialisé');
    }
  };

  // Exposer le module Security globalement
  window.Security = Security;
  
  // Initialiser automatiquement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Security.init();
    });
  } else {
    Security.init();
  }

})(window);
