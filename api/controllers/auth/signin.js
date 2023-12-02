import User from '../../models/user.model.js';
import bcryptjs from 'bcryptjs';
import errorHandler from '../../utils/error.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env',
});

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email:email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign(
      { id: validUser._id }, 
      process.env.JWT_SECRET_KEY, 
      { expiresIn: '1h' },
      );
    
    const { password: userPassword, ...userWithoutPassword } = validUser._doc;

    res
      .cookie(
        'access_token',
        token,
        { httpOnly: true },
        )
      .status(200)
      .json(userWithoutPassword);

  } catch (error) {
    next(error);
  }
}

export default signin;