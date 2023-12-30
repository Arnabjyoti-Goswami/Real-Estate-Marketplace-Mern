import User from '@models/userModel';
import bcryptjs from 'bcryptjs';
import errorHandler from '@utils/errorHandler';
import jwt from 'jsonwebtoken';
import env from '@utils/validateEnv';
import asyncHandler from '@src/utils/asyncWrapper';

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email:email });

  if (!validUser) return next(errorHandler(404, 'User not found!'));

  const validPassword = bcryptjs.compareSync(password, validUser.password);

  if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

  const token = jwt.sign(
    { id: validUser._id }, 
    env.JWT_SECRET_KEY, 
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: userPassword, ...userWithoutPassword } = validUser.toObject();

  res
    .cookie(
      'access_token',
      token,
      { httpOnly: true },
      )
    .status(200)
    .json(userWithoutPassword);
});

export default signin;