import { verify } from 'jsonwebtoken';
import errorHandler from '@utils/errorHandler';
import env from '@utils/validateEnv';
import User from '@models/userModel';
import bcryptjs from 'bcryptjs';
import asyncHandler from '@utils/asyncWrapper';

type reqBody = {
  newPassword: string,
  token: string,
};

type Decoded = {
  emailId: string;
  iat: number;
  exp: number;
};

const resetPassword = asyncHandler(async (req, res, next) => {
  const { newPassword, token } : reqBody = req.body;

  let decoded;

  try {
    decoded = verify(token, env.JWT_RESET_PASSWORD_SECRET_KEY);
  }
  catch (error : unknown) {
    if (error instanceof Error) {
      if (error.message === 'jwt expired') return next(errorHandler(401, 'Link expired! Request a new one.'));
      else return next(errorHandler(403, 'Forbidden! ' + error.message));
    }
  }

  const emailId = (decoded as Decoded).emailId;
  
  const user = await User.findOne({email: emailId});
  if (!user) return next(errorHandler(404, 'User not found!'));

  const { NUM_SALT: saltRounds } = process.env;
  const hashedPassword = bcryptjs.hashSync(newPassword, Number(saltRounds));

  await User.findOneAndUpdate(
    { email: emailId },
    { password: hashedPassword },
    { new: true}, 
  );

  res
    .status(200)
    .json({
      success: true,
      message: 'Password updated successfully!',
    });
});

export default resetPassword;