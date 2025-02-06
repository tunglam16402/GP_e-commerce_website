const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Cho phép chứng chỉ tự ký
        },
    });

    const info = await transporter.sendMail({
        from: '"GP E-commerce shop 👻" <testmail@GPshop.email>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });

    return info;
});
module.exports = sendMail;
