const nodemailer = require('nodemailer');

/**
 * Sends an email using NodeMailer
 * @param {string} email - Recipient email
 * @param {string} otp - The OTP code to send
 */
const sendEmailOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Verify connection configuration
    try {
        await transporter.verify();
        console.log('Nodemailer: Server is ready to take our messages');
    } catch (vError) {
        console.error('Nodemailer Verify Error:', vError);
        throw new Error('Could not establish connection to Gmail. Please check your App Password and Email variables.');
    }

    const mailOptions = {
        from: `"ZenStore Auth" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Key - ZenStore',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #0f172a; text-align: center;">ZenStore Identification Protocol</h2>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #0f172a;">${otp}</span>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully: ' + info.response);
        return info;
    } catch (error) {
        console.error('NodeMailer sendMail Error:', error);
        throw error;
    }
};

module.exports = sendEmailOTP;
