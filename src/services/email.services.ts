import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import logger from '../utils/logger';

const mailConfig = {
    service: 'gmail',
    auth: {
        user: 'avishkachanaka@gmail.com',
        pass: 'qfgg lrhe cvoc mksv'
    }
};

const transporter = nodemailer.createTransport(mailConfig);

export const sendEmail = async (receiver: string, subject: string, resetToken: string,name:string) => {
    try {
        const templatePath = path.resolve(__dirname, '..', 'templates', 'welcome.ejs');
        const data = await ejs.renderFile(templatePath, { name,url:`http://localhost:3000/login/${resetToken}` });

        const mailOptions = {
            from: 'avishkachanaka@gmail.com',
            to: receiver,
            subject: subject,
            html: data,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.resolve(__dirname, '..', 'public', 'images', 'logo.png'),
                    cid: 'logo' 
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info('Message sent: %s', info.messageId);
    } catch (error) {
        console.log("first error",error)
        logger.error('Error sending email:', error);
    }
};
