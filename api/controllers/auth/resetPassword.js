import jwt from 'jsonwebtoken';
import errorHandler from '../../utils/error.js';
import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env'
});
import User from '../../models/user.model.js';
import bcryptjs from 'bcryptjs';

const resetPassword = async (req, res, next) => {
  const { JWT_RESET_PASSWORD_SECRET_KEY: secretKey } = process.env;

  const { newPassword, token } = req.body;

  const data = jwt.verify(
    token, 
    secretKey, 
    (err, data) => {
      if (err?.message === 'jwt expired') return next(errorHandler(401, 'Link expired! Request a new one.'));
      if (err) return next(errorHandler(403, 'Forbidden! ' + err.message));
      return data;
    }
  );
  const emailId = data.emailId;

  try {
    const user = await User.findOne({email: emailId});
    if (!user) return next(errorHandler(404, 'User not found!'));

    const { NUM_SALT: saltRounds } = process.env;
    const hashedPassword = bcryptjs.hashSync(newPassword, Number(saltRounds));

    const updatedUser = await User.findOneAndUpdate(
      { email: emailId },
      { password: hashedPassword },
      { new: true}, 
    );

    // console.log(updatedUser);

    res
      .status(200)
      .json({
        success: true,
        message: 'Password updated successfully!',
      });

  } catch (error) {
    next(error);
  }
};

export default resetPassword;