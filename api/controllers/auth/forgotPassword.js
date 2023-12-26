import jwt from 'jsonwebtoken';
import errorHandler from '../../utils/error.js';
import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env'
});
import User from '../../models/user.model.js';

import getTransporter from '../../utils/emailService.js';
import getHtmlStringVar from '../../utils/getHtmlStringVar.js';

const insertTokenIntoEmailHtml = (html, emailId) => {
  const { JWT_RESET_PASSWORD_SECRET_KEY: secretKey } = process.env;

  const token = jwt.sign(
    { emailId: emailId },
    secretKey,
    { expiresIn: '10m' },
  );

  const tokenInUrlFormat = encodeURIComponent(token);

  const { FRONTEND_URL: baseUrl } = process.env;
  const redirectUrl = baseUrl + '/reset-password' + '?token=' + tokenInUrlFormat;

  // dummy string that was added in:  react-email-dev/emails/forgotPassword.jsx
  const dummyString = 'https://www.google.com';
  const emailHtmlWithToken = html.replace(dummyString, redirectUrl);

  return emailHtmlWithToken;
};

const forgotPassword = async (req, res, next) => {
  const { emailId } = req.body;

  try {
    const user = await User.findOne({email:emailId});
    if (!user) return next(errorHandler(404, 'User not found!'));

    const { transporter, mailOptions } = await getTransporter();

    mailOptions.to = emailId;
    mailOptions.subject = 'Reset forgotten password';

    const emailHtml = await getHtmlStringVar();

    mailOptions.html = insertTokenIntoEmailHtml(emailHtml, emailId);

    transporter.sendMail(
      mailOptions, 
      (error, info) => {
        if (error) {
          return next(errorHandler(500, 'Error sending email: ' + error.message));
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