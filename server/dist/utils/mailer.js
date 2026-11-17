"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEnquiryEmail = sendEnquiryEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEnquiryEmail(enquiry) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || 'liftnreach@gmail.com';
    const pass = process.env.SMTP_PASS;
    const to = process.env.NOTIFICATION_EMAIL || 'liftnreach@gmail.com';
    if (!pass) {
        console.log('[Email Simulation] SMTP_PASS not set. Notification for enquiry received:');
        console.log({ to, ...enquiry });
        return;
    }
    try {
        const transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user, pass }
        });
        const mailOptions = {
            from: `"Lift and Reach Website" <${user}>`,
            to,
            replyTo: enquiry.email,
            subject: `[New Website Enquiry] ${enquiry.subject}`,
            text: `
New enquiry received on Lift and Reach Equipments website:

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone || 'N/A'}
Subject: ${enquiry.subject}
${enquiry.productName ? `Product: ${enquiry.productName} (${enquiry.productCode || 'N/A'})` : ''}

Message:
${enquiry.message}
      `,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background: #2F5FA8; color: #fff; padding: 20px;">
            <h2 style="margin: 0;">New Enquiry Received</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Lift and Reach Equipments - Web Portal</p>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 140px; color: #555;">Full Name:</td><td style="padding: 8px 0;">${enquiry.name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px 0;">${enquiry.phone || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td><td style="padding: 8px 0;">${enquiry.subject}</td></tr>
              ${enquiry.productName ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Product:</td><td style="padding: 8px 0;"><strong>${enquiry.productName}</strong> ${enquiry.productCode ? `(${enquiry.productCode})` : ''}</td></tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #f8f9fa; border-left: 4px solid #2F5FA8; border-radius: 4px;">
              <h4 style="margin: 0 0 8px 0; color: #333;">Message:</h4>
              <p style="margin: 0; white-space: pre-wrap; color: #444;">${enquiry.message}</p>
            </div>
          </div>
          <div style="background: #f1f3f5; padding: 12px 24px; font-size: 12px; color: #777; text-align: center;">
            This email was generated from the quote / contact form at liftandreach.in
          </div>
        </div>
      `
        };
        await transporter.sendMail(mailOptions);
        console.log(`[Email Sent] Notification dispatched to ${to}`);
    }
    catch (error) {
        console.error('[Email Error] Failed to send email notification:', error);
    }
}
