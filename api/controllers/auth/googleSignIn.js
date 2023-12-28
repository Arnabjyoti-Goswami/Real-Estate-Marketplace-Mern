import User from '../../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env',
});

const googleSignin = async (req, res, next) => {
  let { username, email, pfp } = req.body;

  username = username.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);

  try {
    const user = await User.findOne({ email });

    // if user exists then send access_token, if doesn't exist then first create user then send access_token 
    if (user) {
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET_KEY, 
      );

      const { password: userPassword, ...userWithoutPassword } = user._doc;

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
      
      const { NUM_SALT: saltRounds } = process.env;
      const hashedPassword = bcryptjs.hashSync(generatedPassword, Number(saltRounds));

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar: pfp,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id }, 
        process.env.JWT_SECRET_KEY, 
      );

      const { password: userPassword, ...userWithoutPassword } = newUser._doc;

      res
        .cookie(
          'access_token',
          token,
          { httpOnly: true },
          )
        .status(200)
        .json(userWithoutPassword);

    }
  } catch (error) {
    next(error);
  }
};

export default googleSignin;