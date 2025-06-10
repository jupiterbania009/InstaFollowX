const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your InstaFollowX Login OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #8a2be2; text-align: center;">InstaFollowX Login Verification</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="text-align: center; margin-bottom: 20px;">Your OTP Code</h3>
                        <p style="font-size: 32px; text-align: center; letter-spacing: 5px; color: #4b0082; font-weight: bold;">
                            ${otp}
                        </p>
                    </div>
                    <p style="color: #6c757d; text-align: center;">
                        This OTP will expire in 5 minutes.<br>
                        If you didn't request this OTP, please ignore this email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

module.exports = { sendOTPEmail }; 