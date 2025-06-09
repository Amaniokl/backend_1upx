import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.from=process.env.FROM_EMAIL]
 */
export async function sendEmail({ to, subject, html, from = process.env.FROM_EMAIL }) {
  const msg = {
    to,
    from,
    subject,
    html
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return { success: true, response };
  } catch (error) {
    console.error('❌ SendGrid error:', error.response?.body || error.message);
    return { success: false, error };
  }
}
