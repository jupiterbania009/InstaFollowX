require('dotenv').config();
const { sendOTPEmail } = require('./utils/emailService');

async function testEmailService() {
    console.log('Testing email service...');
    console.log('Using email configuration:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not Set');

    try {
        const testOTP = '123456';
        const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
        
        console.log('\nSending test email to:', testEmail);
        const result = await sendOTPEmail(testEmail, testOTP);
        
        if (result) {
            console.log('\n✅ Email sent successfully!');
            console.log('Please check your inbox (and spam folder) for the test email.');
        } else {
            console.log('\n❌ Failed to send email.');
            console.log('Please check your email configuration in .env file.');
        }
    } catch (error) {
        console.error('\n❌ Error testing email service:', error.message);
        if (error.code === 'EAUTH') {
            console.log('\nAuthentication failed. Please check:');
            console.log('1. Your EMAIL_USER is correct');
            console.log('2. Your EMAIL_PASSWORD is the correct App Password');
            console.log('3. 2-Step Verification is enabled on your Google Account');
        }
    }
}

testEmailService(); 