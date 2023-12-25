import nodemailer from 'nodemailer';

import dotenv from 'dotenv';
dotenv.config({
  path: '../.env'
});

const { EMAIL_SENDER_ID: senderGmail, senderGmailPassword } = process.env;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: senderGmail,
    pass: senderGmailPassword,
  }
});

const mailOptions = {
  from: senderGmail,
};

export { transporter, mailOptions };