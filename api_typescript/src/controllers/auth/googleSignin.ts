import User from '@models/userModel';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import env from '@utils/validateEnv';
import asyncHandler from '@src/utils/asyncWrapper';

type reqBody = {
  username: string,
  email: string,
  pfp: string,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleSignin = asyncHandler(async (req, res, next) => {
  const { username, email, pfp }: reqBody = req.body;

  const db_username  = username.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);

  const user = await User.findOne({ email }).lean();

  // if user exists then send access_token, if doesn't exist then first create user then send access_token 
  if (user) {
    const token = jwt.sign(
      { id: user._id }, 
      env.JWT_SECRET_KEY, 
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    res
      .cookie(
        'access_token',
        token,
        { httpOnly: true },
        )
      .status(200)
      .json(userWithoutPassword);

  } else {
    // Generate 16 character password with numbers from 0-9 and characters from a-z
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, env.NUM_SALT);

    const newUser = new User({
      username: db_username,
      email,
      password: hashedPassword,
      avatar: pfp,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id }, 
      env.JWT_SECRET_KEY, 
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = newUser.toObject();

    res
      .cookie(
        'access_token',
        token,
        { httpOnly: true },
      )
      .status(200)
      .json(userWithoutPassword);

  }
});

export default googleSignin;