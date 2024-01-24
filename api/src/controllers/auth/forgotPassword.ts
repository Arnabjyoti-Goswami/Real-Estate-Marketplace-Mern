import jwt from 'jsonwebtoken';
import errorHandler from '@utils/errorHandler';
import env from '@utils/validateEnv';
import User from '@models/userModel';
import asyncHandler from '@src/utils/asyncWrapper';
import getTransporter from '@utils/emailService';
import getHtmlStringVar from '@utils/getHtmlStringVar';

const insertTokenIntoEmailHtml = (html: string, emailId: string) => {
  const token = jwt.sign(
    { emailId: emailId },
    env.JWT_RESET_PASSWORD_SECRET_KEY,
    { expiresIn: '10m' }
  );

  const tokenInUrlFormat = encodeURIComponent(token);

  const redirectUrl =
    env.FRONTEND_URL + '/reset-password' + '?token=' + tokenInUrlFormat;

  // dummy string that was added in:  react-email-dev/emails/forgotPassword.jsx
  const dummyString = 'https://www.google.com';
  const emailHtmlWithToken = html.replace(dummyString, redirectUrl);

  return emailHtmlWithToken;
};

type reqBody = {
  emailId: string;
};

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { emailId }: reqBody = req.body;

  const user = await User.findOne({ email: emailId });
  if (!user) return next(errorHandler(404, 'User not found!'));

  const { transporter, mailOptions } = await getTransporter();

  mailOptions.to = emailId;
  mailOptions.subject = 'Reset forgotten password';

  const emailHtml = await getHtmlStringVar();

  mailOptions.html = insertTokenIntoEmailHtml(emailHtml as string, emailId);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(errorHandler(500, 'Error sending email: ' + error.message));
    }

    res.status(200).json({
      success: true,
      message: 'Email sent successfully, response: ' + info.response,
    });
  });
});

export default forgotPassword;
