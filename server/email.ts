import { MailService } from '@sendgrid/mail';

const mailService = new MailService();

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(params: ContactEmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('📧 SENDGRID_API_KEY not configured - contact form will not send emails');
    return false;
  }

  try {
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    const emailContent = {
      to: 'wizqo2024@gmail.com',
      from: 'noreply@wizqo.com', // This should be a verified sender domain
      subject: `Contact Form: ${params.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Contact Form Message</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${params.name}</p>
            <p><strong>Email:</strong> ${params.email}</p>
            <p><strong>Subject:</strong> ${params.subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #334155; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.5;">${params.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p>This message was sent from the Wizqo contact form at wizqo.com</p>
            <p>Reply directly to this email to respond to: ${params.email}</p>
          </div>
        </div>
      `,
      replyTo: params.email
    };

    await mailService.send(emailContent);
    console.log('📧 Contact email sent successfully to wizqo2024@gmail.com');
    return true;
  } catch (error) {
    console.error('📧 SendGrid email error:', error);
    return false;
  }
}