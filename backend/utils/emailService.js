const nodemailer = require('nodemailer');

/**
 * Sends an email using NodeMailer
 * @param {string} email - Recipient email
 * @param {string} otp - The OTP code to send
 */
const sendEmailOTP = async (email, otp) => {
    // Configure transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"ZenStore Auth" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Key - ZenStore',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #0f172a; text-align: center;">ZenStore Identification Protocol</h2>
                <p style="color: #64748b; font-size: 16px; text-align: center;">Use the following cryptographic key to authorize your session:</p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #0f172a;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">This key will expire in 5 minutes. If you did not request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                <p style="color: #cbd5e1; font-size: 10px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">End-to-End Encrypted Session • ZenStore Core v4</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('NodeMailer Error:', error);
        throw new Error('Failed to send OTP email via NodeMailer');
    }
};

module.exports = sendEmailOTP;
