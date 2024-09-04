import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import logger from '../utils/logger';
import { mailConfig } from '../configs/mailConfig';
import { FRONTEND_URL } from '../configs/config';

const MailConfig = {
    service: mailConfig.host,
    auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass
    }
};

const transporter = nodemailer.createTransport(MailConfig);

export const sendEmail = async (receiver: string, subject: string, resetToken: string,name:string,template:string) => {
    try {
        //welcome.ejs
        const templatePath = path.resolve(__dirname, '..', 'templates', template);
        const data = await ejs.renderFile(templatePath, { name,url:`${FRONTEND_URL}login/${resetToken}` });
        logger.info(`Service: sendEmail - Email sent to ${receiver}, subject: ${subject},FRONTEND_URL:${FRONTEND_URL}`);
        const mailOptions = {
            from:MailConfig.auth.user,
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
        logger.error(`Error sending email: ${error}`);
    }
};

export const sendProjectAssignmentEmail = async (receiver: string, projectDetails: any, name: string) => {
    try {
        const templatePath = path.resolve(__dirname, '..', 'templates', 'assignedProject.ejs');
        const data = await ejs.renderFile(templatePath, {
            name,
            projectName: projectDetails.projectName,
            startDate: projectDetails.startDate.toDateString(),
            endDate: projectDetails.endDate ? projectDetails.endDate.toDateString() : 'N/A',
            status: projectDetails.status,
            category: projectDetails.category,
        });

        const mailOptions = {
            from: MailConfig.auth.user,
            to: receiver,
            subject: `Assigned to Project: ${projectDetails.projectName}`,
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
        logger.info('Assignment email sent: %s', info.messageId);
    } catch (error) {
        logger.error(`Error sending assignment email:${error}`, );
    }
};
