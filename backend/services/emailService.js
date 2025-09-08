// Service d'email simplifié pour le développement
const emailService = {
  // Envoyer un email de confirmation de commande
  sendOrderConfirmation: async (userEmail, order) => {
    console.log(`📧 Email de confirmation envoyé à ${userEmail} pour la commande ${order.orderNumber}`);
    return { success: true, message: 'Email de confirmation envoyé' };
  },

  // Envoyer un email de bienvenue
  sendWelcomeEmail: async (userEmail, firstName) => {
    console.log(`📧 Email de bienvenue envoyé à ${userEmail} (${firstName})`);
    return { success: true, message: 'Email de bienvenue envoyé' };
  },

  // Envoyer un email de réinitialisation de mot de passe
  sendPasswordResetEmail: async (userEmail, resetToken) => {
    console.log(`📧 Email de réinitialisation envoyé à ${userEmail}`);
    console.log(`🔗 Token de réinitialisation: ${resetToken}`);
    return { success: true, message: 'Email de réinitialisation envoyé' };
  },

  // Envoyer une notification de changement de statut de commande
  sendOrderStatusUpdate: async (userEmail, order, newStatus) => {
    console.log(`📧 Notification de statut envoyée à ${userEmail} - Commande ${order.orderNumber}: ${newStatus}`);
    return { success: true, message: 'Notification de statut envoyée' };
  }
};

module.exports = emailService;
