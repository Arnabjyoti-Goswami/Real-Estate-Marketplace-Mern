import User from '@models/userModel';
import { sign } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import env from '@utils/validateEnv';
import asyncHandler from '@utils/asyncWrapper';
import getMsFromString from '@utils/getMsFromString';

type reqBody = {
  username: string;
  email: string;
  pfp: string;
};

const googleSignin = asyncHandler(async (req, res, _) => {
  const { username, email, pfp }: reqBody = req.body;

  const db_username =
    username.split(' ').join('').toLowerCase() +
    Math.random().toString(36).slice(-4);

  const user = await User.findOne({ email }).lean();

  // if user exists then send access_token, if doesn't exist then first create user then send access_token
  if (user) {
    const token = sign({ id: user._id }, env.JWT_SECRET_KEY, {
      expiresIn: env.ACCESS_TOKEN_LIFE,
    });

    const refresh_token = sign({ id: user._id }, env.JWT_SECRET_KEY_2, {
      expiresIn: env.REFRESH_TOKEN_LIFE,
    });

    const { password: _, ...userWithoutPassword } = user;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: getMsFromString(env.ACCESS_TOKEN_LIFE),
      })
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: getMsFromString(env.REFRESH_TOKEN_LIFE),
      })
      .status(200)
      .json(userWithoutPassword);
  } else {
    // Generate 16 character password with numbers from 0-9 and characters from a-z
    const generatedPassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, env.NUM_SALT);

    const newUser = new User({
      username: db_username,
      email,
      password: hashedPassword,
      avatar: pfp,
    });

    await newUser.save();

    const token = sign({ id: newUser._id }, env.JWT_SECRET_KEY, {
      expiresIn: env.ACCESS_TOKEN_LIFE,
    });

    const refresh_token = sign({ id: newUser._id }, env.JWT_SECRET_KEY_2, {
      expiresIn: env.REFRESH_TOKEN_LIFE,
    });

    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res
      .cookie('access_token', token, {
        httpOnly: true,
        maxAge: getMsFromString(env.ACCESS_TOKEN_LIFE),
      })
      .cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: getMsFromString(env.REFRESH_TOKEN_LIFE),
      })
      .status(200)
      .json(userWithoutPassword);
  }
});

export default googleSignin;
