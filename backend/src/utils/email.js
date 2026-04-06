import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.GOOGLE_HOST,
    port: process.env.GOOGLE_PORT,
    secure: true,
    auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASSWORD,
    },
});

export const sendVerificationEmail = async (toEmail,subject,htmlContent, token) => {
    const verifyUrl = `${process.env.BASE_URL}/api/v1/users/verify-mail?token=${token}&email=${encodeURIComponent(toEmail)}`;

    let mailOptions = undefined;

    if (subject === "Verify your email" && token) {
        mailOptions = {
            from: `"Your App" <${process.env.GOOGLE_MAIL}>`,
            to: toEmail,
            subject: subject,
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #1a1a1a;">Verify your email address</h2>
            <p style="color: #555;">Click the button below to verify your email. This link expires in <strong>24 hours</strong>.</p>
            <a href="${verifyUrl}"
              style="display: inline-block; margin: 24px 0; padding: 12px 28px; background-color: #4F46E5;
                     color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Verify Email
            </a>
            <p style="color: #999; font-size: 12px;">Or copy this link into your browser:</p>
            <p style="color: #4F46E5; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
            <p style="color: #bbb; font-size: 11px;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `,
        };
    } else {
        mailOptions = {
            from: `"videoSharingApp" <${process.env.GOOGLE_MAIL}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent,
        };
    }
    

    await transporter.sendMail(mailOptions).catch((err) => console.error(err));
};