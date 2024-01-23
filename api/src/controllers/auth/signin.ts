import User from '@models/userModel';
import bcryptjs from 'bcryptjs';
import errorHandler from '@utils/errorHandler';
import { sign } from 'jsonwebtoken';
import env from '@utils/validateEnv';
import asyncHandler from '@utils/asyncWrapper';
import getMsFromString from '@utils/getMsFromString';

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email:email });

  if (!validUser) return next(errorHandler(404, 'User not found!'));

  const validPassword = bcryptjs.compareSync(password, validUser.password);

  if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

  const token = sign(
    { id: validUser._id }, 
    env.JWT_SECRET_KEY, 
    { expiresIn: env.ACCESS_TOKEN_LIFE }
  );

  const refresh_token = sign(
    { id: validUser._id },
    env.JWT_SECRET_KEY_2,
    { expiresIn: env.REFRESH_TOKEN_LIFE }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: userPassword, ...userWithoutPassword } = validUser.toObject();

  res
    .cookie(
      'access_token',
      token,
      { 
        httpOnly: true,
        maxAge: getMsFromString(env.ACCESS_TOKEN_LIFE), 
      },
    )
    .cookie(
      'refresh_token',
      refresh_token,
      { 
        httpOnly: true,
        maxAge: getMsFromString(env.REFRESH_TOKEN_LIFE),
      },
    )
    .status(200)
    .json(userWithoutPassword);
});

export default signin;