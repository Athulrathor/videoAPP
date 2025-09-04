import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendMail = async (to, subject, text,otp) => {
    const mailOptions = {
        from: process.env.MAILTRAP_AUTH_FROM,
        to: to,
        subject: subject,
        text: text,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f6f9fc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 20px;
            text-align: center;
        }
        .otp-container {
            background-color: #f8fafc;
            border: 2px dashed #e2e8f0;
            border-radius: 12px;
            padding: 30px 20px;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #2d3748;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        .otp-label {
            color: #718096;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .message {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.6;
            margin: 20px 0;
        }
        .warning {
            background-color: #fef5e7;
            border: 1px solid #f6e05e;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #744210;
            font-size: 14px;
        }
        .footer {
            background-color: #f7fafc;
            padding: 30px 20px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        @media only screen and (max-width: 600px) {
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${"VidTube"}</h1>
        </div>
        
        <div class="content">
            <h2 style="color: #2d3748; margin-bottom: 10px;">Verify Your Email Address</h2>
            <p class="message">
                We received a request to verify your email address. Use the verification code below to complete the process:
            </p>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div style="color: #718096; font-size: 12px;">This code expires in 10 minutes</div>
            </div>
            
            <p class="message">
                Enter this code in the ${"VidTube app verfication page"} app to verify your email address.
            </p>
            
            <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this verification, please ignore this email. Never share this code with anyone.
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent by ${"VidTube Cooperation"}</p>
            <p>If you have any questions, please contact our support team.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
                This is an automated message, please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>`,
    };

    const transport = nodemailer.createTransport({
        host: process.env.MAILTRAP_AUTH_HOST,
        port: process.env.MAILTRAP_AUTH_PORT,
        auth: {
            user: process.env.MAILTRAP_AUTH_USERNAME,
            pass: process.env.MAILTRAP_AUTH_PASSWORD,
        }
    });

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

    return transport;
}

export default sendMail;