import User from '../../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import dotenv from 'dotenv';
dotenv.config({
  path: '../..',
});

const googleSignin = async (req, res, next) => {
  let { username, email, pfp } = req.body;

  username = username.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { _id: user._id }, 
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
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        avatar: pfp,
      });

      await newUser.save();

      const token = jwt.sign(
        { _id: newUser._id }, 
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