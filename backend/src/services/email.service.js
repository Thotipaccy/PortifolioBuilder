import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log(`📧 Email Service: User ${process.env.EMAIL_USER ? 'LOADED' : 'MISSING'}, Pass ${process.env.EMAIL_PASS ? 'LOADED' : 'MISSING'}`);

export const sendContactEmail = async (to, fromEmail, name, message) => {
  try {
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${fromEmail}\n\nMessage:\n${message}`,
      replyTo: fromEmail
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw error;
  }
};
