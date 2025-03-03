import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return { success: false, error };
  }
}

// Templates d'emails
export const emailTemplates = {
  // Email de confirmation de réservation
  reservationConfirmation: (name: string, date: string, startTime: string, endTime: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #3b82f6;">Confirmation de réservation - Wakesurf Léman</h2>
      <p>Bonjour ${name},</p>
      <p>Votre réservation a été confirmée avec succès !</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Heure de début:</strong> ${startTime}</p>
        <p><strong>Heure de fin:</strong> ${endTime}</p>
      </div>
      <p>Nous vous attendons au bord du lac Léman pour votre session de wakesurf.</p>
      <p>En cas d'annulation due aux conditions météorologiques, vous serez notifié(e) par email et vos heures seront recréditées sur votre code promo.</p>
      <p>À bientôt sur l'eau !</p>
      <p>L'équipe Wakesurf Léman</p>
    </div>
  `,

  // Email d'annulation de réservation
  reservationCancellation: (name: string, date: string, reason: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #ef4444;">Annulation de réservation - Wakesurf Léman</h2>
      <p>Bonjour ${name},</p>
      <p>Nous sommes désolés de vous informer que votre réservation du ${date} a été annulée.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Raison:</strong> ${reason}</p>
      </div>
      <p>Vos heures ont été recréditées sur votre code promo.</p>
      <p>N'hésitez pas à effectuer une nouvelle réservation dès que possible.</p>
      <p>Nous vous prions de nous excuser pour ce désagrément.</p>
      <p>L'équipe Wakesurf Léman</p>
    </div>
  `,

  // Email d'envoi de code promo
  promoCodeEmail: (name: string, code: string, hours: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #10b981;">Votre code promo - Wakesurf Léman</h2>
      <p>Bonjour ${name},</p>
      <p>Merci pour votre achat ! Voici votre code promo pour réserver vos sessions de wakesurf :</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</p>
        <p><strong>Heures disponibles:</strong> ${hours}</p>
      </div>
      <p>Pour utiliser ce code, connectez-vous à votre compte sur notre site et entrez-le lors de votre réservation.</p>
      <p>À bientôt sur l'eau !</p>
      <p>L'équipe Wakesurf Léman</p>
    </div>
  `,
}; 