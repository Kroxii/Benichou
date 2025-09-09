const nodemailer = require('nodemailer');
require('dotenv').config();

const emailService = {
  // Configuration du transporteur avec gestion d'erreurs robuste
  createTransporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Options de performance et retry
      maxConnections: 5,
      maxMessages: 10,
      rateLimit: 14, // 14 messages par seconde max
      connectionTimeout: 60000, // 60 secondes
      greetingTimeout: 30000, // 30 secondes
      socketTimeout: 60000, // 60 secondes
    });
  },

  // Envoi d'email avec gestion d'erreurs améliorée
  async sendEmail(to, subject, html) {
    try {
      // Validation des paramètres
      if (!to || !subject || !html) {
        throw new Error('Paramètres email manquants (to, subject, html)');
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        throw new Error('Adresse email destinataire invalide');
      }

      const transporter = this.createTransporter();
      
      // Vérification de la connexion SMTP
      try {
        await transporter.verify();
      } catch (verifyError) {
        console.error('❌ Échec de vérification SMTP:', verifyError.message);
        throw new Error('Impossible de se connecter au serveur SMTP');
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email envoyé avec succès à ${to}`);
      return { 
        success: true, 
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error.message);
      
      // Mapping des erreurs SMTP vers des messages utilisateur
      const errorMap = {
        'EAUTH': 'Authentification SMTP échouée - Vérifiez les identifiants dans .env',
        'ECONNECTION': 'Impossible de se connecter au serveur SMTP - Vérifiez host/port',
        'EMESSAGE': 'Format de message email invalide',
        'EENVELOPE': 'Adresse email destinataire invalide',
        'ETIMEDOUT': 'Timeout de connexion SMTP - Serveur indisponible',
        'EDNS': 'Erreur de résolution DNS - Vérifiez l\'host SMTP',
        'ENOTFOUND': 'Serveur SMTP introuvable'
      };
      
      const userMessage = errorMap[error.code] || `Erreur email: ${error.message}`;
      
      return { 
        success: false, 
        error: userMessage,
        code: error.code || 'UNKNOWN',
        timestamp: new Date().toISOString()
      };
    }
  },

  // Email de vérification avec template amélioré
  async sendEmailVerification(email, firstName, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email.html?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>🎴 Benichou TCG</h1>
          <h2>Vérification de votre compte</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p>Bonjour <strong>${firstName}</strong>,</p>
          
          <p>Bienvenue chez Benichou TCG ! Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              ✅ Vérifier mon compte
            </a>
          </div>
          
          <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⏰ Important :</strong> Ce lien expire dans 24 heures.</p>
          </div>
          
          <p>Une fois votre compte activé, vous pourrez :</p>
          <ul>
            <li>🛒 Passer des commandes</li>
            <li>📦 Suivre vos livraisons</li>
            <li>💳 Gérer vos moyens de paiement</li>
            <li>🎁 Accéder aux offres exclusives</li>
          </ul>
          
          <hr style="border: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6c757d;">
            Vous recevez cet email car vous avez créé un compte sur Benichou TCG.<br>
            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(email, '🎴 Vérification de votre compte Benichou TCG', html);
  },

  // Email de réinitialisation de mot de passe
  async sendPasswordResetEmail(email, firstName, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; text-align: center;">
          <h1>🎴 Benichou TCG</h1>
          <h2>Réinitialisation de mot de passe</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <p>Bonjour <strong>${firstName}</strong>,</p>
          
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              🔒 Réinitialiser mon mot de passe
            </a>
          </div>
          
          <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Important :</strong> Ce lien expire dans 1 heure pour votre sécurité.</p>
          </div>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;">
              <strong>🛡️ Conseils de sécurité :</strong><br>
              • Choisissez un mot de passe fort (8+ caractères)<br>
              • Utilisez majuscules, minuscules et chiffres<br>
              • Ne partagez jamais votre mot de passe
            </p>
          </div>
          
          <hr style="border: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #6c757d;">
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email ou contactez-nous.<br>
            Votre mot de passe actuel reste inchangé tant que vous ne cliquez pas sur le lien.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail(email, '🔒 Réinitialisation de votre mot de passe Benichou TCG', html);
  }
};

module.exports = emailService;