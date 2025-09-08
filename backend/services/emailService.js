const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // Configuration pour le développement (utilise Ethereal Email)
    // En production, remplacez par votre fournisseur SMTP réel
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Configuration pour le développement
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'verysecret'
        }
      });
    }
  }

  async sendEmail(to, subject, htmlContent, textContent = '') {
    try {
      const mailOptions = {
        from: process.env.FROM_EMAIL || '"Benichou TCG" <noreply@benichou-tcg.com>',
        to,
        subject,
        text: textContent,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Email envoyé avec succès');
        console.log('   Destinataire:', to);
        console.log('   Sujet:', subject);
        console.log('   Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendEmailVerification(email, firstName, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎮 Bienvenue chez Benichou TCG !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${firstName}</strong>,</p>
              
              <p>Merci de vous être inscrit sur Benichou TCG ! Nous sommes ravis de vous accueillir dans notre communauté de passionnés de cartes à collectionner.</p>
              
              <p>Pour finaliser votre inscription et activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
              
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">✉️ Vérifier mon email</a>
              </p>
              
              <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              
              <p><strong>⚠️ Important :</strong> Ce lien est valable pendant 24 heures.</p>
              
              <p>Si vous n'avez pas créé de compte sur notre site, vous pouvez ignorer cet email.</p>
              
              <p>À bientôt sur Benichou TCG !<br>
              L'équipe Benichou TCG</p>
            </div>
            <div class="footer">
              <p>© 2024 Benichou TCG - Votre boutique de cartes à collectionner</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
      Bonjour ${firstName},
      
      Merci de vous être inscrit sur Benichou TCG !
      
      Pour finaliser votre inscription, veuillez cliquer sur ce lien :
      ${verificationUrl}
      
      Ce lien est valable pendant 24 heures.
      
      L'équipe Benichou TCG
    `;

    return await this.sendEmail(
      email,
      '🎮 Confirmez votre inscription sur Benichou TCG',
      htmlContent,
      textContent
    );
  }

  async sendWelcomeEmail(email, firstName) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Votre compte est activé !</h1>
            </div>
            <div class="content">
              <p>Félicitations <strong>${firstName}</strong> !</p>
              
              <p>Votre compte Benichou TCG est maintenant activé et vous pouvez profiter de toutes nos fonctionnalités :</p>
              
              <ul>
                <li>🛒 Parcourir notre catalogue de cartes</li>
                <li>� Passer des commandes en toute sécurité</li>
                <li>📦 Suivre vos commandes</li>
                <li>⭐ Gérer vos favoris</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">🏪 Découvrir la boutique</a>
              </p>
              
              <p>Merci de faire confiance à Benichou TCG !</p>
              
              <p>L'équipe Benichou TCG</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(
      email,
      '🎉 Bienvenue sur Benichou TCG - Votre compte est activé !',
      htmlContent
    );
  }

  async sendPasswordResetEmail(email, firstName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Réinitialisation de mot de passe</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${firstName}</strong>,</p>
              
              <p>Vous avez demandé la réinitialisation de votre mot de passe sur Benichou TCG.</p>
              
              <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">🔐 Réinitialiser mon mot de passe</a>
              </p>
              
              <p><strong>⚠️ Important :</strong> Ce lien est valable pendant 1 heure.</p>
              
              <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email. Votre mot de passe restera inchangé.</p>
              
              <p>L'équipe Benichou TCG</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(
      email,
      '🔒 Réinitialisation de votre mot de passe - Benichou TCG',
      htmlContent
    );
  }

  async sendOrderConfirmation(email, firstName, order) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Commande confirmée !</h1>
            </div>
            <div class="content">
              <p>Bonjour <strong>${firstName}</strong>,</p>
              
              <p>Votre commande <strong>#${order.orderNumber}</strong> a été confirmée avec succès !</p>
              
              <p><strong>Total :</strong> ${order.total}€</p>
              
              <p>Nous préparons votre commande et vous recevrez bientôt un email de suivi.</p>
              
              <p>Merci pour votre confiance !</p>
              
              <p>L'équipe Benichou TCG</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return await this.sendEmail(
      email,
      `✅ Confirmation de votre commande #${order.orderNumber} - Benichou TCG`,
      htmlContent
    );
  }
}

module.exports = new EmailService();
