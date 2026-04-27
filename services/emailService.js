// ============================================
// Service d'envoi d'emails
// ============================================
// À intégrer dans routes/auth.js

const nodemailer = require('nodemailer');

// Configuration du transporteur d'emails
// À personnaliser selon votre fournisseur d'email
const createMailTransporter = () => {
  // Option 1: Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Mot de passe d'application Gmail
      }
    });
  }

  // Option 2: Service SMTP générique (ex: Brevo, Mailgun, etc.)
  if (process.env.EMAIL_SERVICE === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });
  }

  // Option 3: Service (SendGrid, Mailgun, etc.)
  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      }
    });
  }

  return null;
};

// Fonction pour envoyer l'email d'invitation
const sendInvitationEmail = async (email, token, frontendUrl) => {
  const transporter = createMailTransporter();

  if (!transporter) {
    console.warn("⚠️  Aucun service d'email configuré. Email non envoyé.");
    console.log(`📧 L'utilisateur devrait recevoir ce lien:\n${frontendUrl}/activate?token=${token}`);
    return false;
  }

  const activationUrl = `${frontendUrl}/activate?token=${token}`;
  
  const htmlContent = `
    <h2>Bienvenue sur CASiBIO!</h2>
    <p>Vous avez été invité(e) à rejoindre notre plateforme.</p>
    <p>Cliquez sur le lien ci-dessous pour créer votre compte:</p>
    <a href="${activationUrl}" style="
      display: inline-block;
      padding: 12px 30px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    ">
      Créer mon compte
    </a>
    <p>Ou copiez ce lien dans votre navigateur:</p>
    <p><code>${activationUrl}</code></p>
    <p><strong>Attention:</strong> Ce lien expire dans 48 heures.</p>
    <hr>
    <p style="color: #999; font-size: 12px;">
      Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.
    </p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Invitation CASiBIO - Créez votre compte',
      html: htmlContent,
      text: `Cliquez sur ce lien pour créer votre compte:\n${activationUrl}\n\nCe lien expire dans 48 heures.`
    });

    console.log(`✅ Email d'invitation envoyé à ${email}`);
    return true;
  } catch (err) {
    console.error(`❌ Erreur lors de l'envoi de l'email à ${email}:`, err.message);
    return false;
  }
};

module.exports = { sendInvitationEmail, createMailTransporter };
