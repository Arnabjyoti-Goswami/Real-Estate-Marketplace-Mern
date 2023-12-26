import User from '../../models/user.model.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({
  path: '../../.env'
});

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const { NUM_SALT: saltRounds } = process.env;
  const hashedPassword = bcryptjs.hashSync(password, Number(saltRounds));

  const newUser = new User({ 
    username, 
    email, 
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({
      message: 'User created successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export default signup;