const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create the Transpoter Object
    const transpoter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2) Define Email Options Object
    const mailOptions = {
        from: 'Hamza Mughal <aahilhamza@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html 
    }
    // 3) Actually Sending the email
    await transpoter.sendMail(mailOptions);
}

module.exports = sendEmail;