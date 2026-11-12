import { Resend } from 'resend';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

interface ContactEmailParams {
  name: string;
  email: string;
  message: string;
}

export class EmailService {
  private static resendClient = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

  static async sendContactNotification(params: ContactEmailParams): Promise<boolean> {
    const { name, email, message } = params;

    const subject = `📬 New Portfolio Message from ${name}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-top: 0;">New Contact Form Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <div style="margin-top: 15px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #4f46e5;">
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 25px;">
          Sent from Anum's Portfolio Backend (Numi Companion API).
        </p>
      </div>
    `;

    if (this.resendClient) {
      try {
        await this.resendClient.emails.send({
          from: env.FROM_EMAIL || 'portfolio@anum.dev',
          to: env.CONTACT_NOTIFICATION_EMAIL,
          subject,
          html,
          replyTo: email,
        });
        logger.info({ to: env.CONTACT_NOTIFICATION_EMAIL, sender: email }, 'Contact email notification sent via Resend');
        return true;
      } catch (error) {
        logger.error({ error, sender: email }, 'Failed to send contact notification email via Resend');
        return false;
      }
    } else {
      logger.info(
        { sender: email, name },
        '[MOCK/FALLBACK EMAIL] RESEND_API_KEY not configured. Contact notification logged successfully.'
      );
      return true;
    }
  }
}
