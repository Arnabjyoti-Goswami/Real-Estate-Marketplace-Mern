import User from '@models/userModel';
import bcryptjs from 'bcryptjs';
import env from '@utils/validateEnv';
import asyncHandler from '@src/utils/asyncWrapper';

type reqBody = {
  username: string;
  email: string;
  password: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password }: reqBody = req.body;

  const hashedPassword = bcryptjs.hashSync(password, env.NUM_SALT);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({
    success: true,
    message: 'User created successfully!',
  });
});

export default signup;
