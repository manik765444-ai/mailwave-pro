// app.js
const express = require('express');
const emailService = require('./emailService');

const app = express();
app.use(express.json());

app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;
        const result = await emailService.sendEmail(to, subject, text, html);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // or 'STARTTLS'
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async sendEmail(to, subject, text, html) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USERNAME,
                to,
                subject,
                text,
                html,
            };
            const result = await this.transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EmailService();

// .env
// EMAIL_USERNAME=your-email@gmail.com
// EMAIL_PASSWORD=your-password