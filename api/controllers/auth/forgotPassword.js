import jwt from 'jsonwebtoken';
import errorHandler from '../../utils/error.js';
import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env'
});

import { transporter, mailOptions } from '../../utils/emailService.js';

const forgotPassword = async (req, res, next) => {
  const { emailId, emailHtml, stringToReplace } = req.body;

  const token = generateTemporaryPassword(12);

  mailOptions.to = emailId;
  mailOptions.subject = 'Reset forgotten password';
  mailOptions.html = insertTokenIntoEmailHtml(emailHtml, token);

  try {
    transporter.sendMail(
      mailOptions, 
      (error, info) => {
        if (error) {
          return next(errorHandler(500, 'Error sending email'));
        }

        res
          .status(200)
          .json({
            success: true,
            message: 'Email sent successfully, response: ' + info.response,
          });
      });

  } catch (error) {
    next(error);
  }
};

export default forgotPassword;