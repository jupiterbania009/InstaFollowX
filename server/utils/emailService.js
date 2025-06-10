const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASSWORD?.trim()
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        // Log email configuration (without password)
        console.log('Attempting to send email using:', {
            host: 'smtp.gmail.com',
            port: 587,
            user: process.env.EMAIL_USER
        });

        // Verify transporter configuration
        await transporter.verify();
        
        const mailOptions = {
            from: `"InstaFollowX" <${process.env.EMAIL_USER}>`,
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

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        return false;
    }
};

module.exports = { sendOTPEmail }; 
