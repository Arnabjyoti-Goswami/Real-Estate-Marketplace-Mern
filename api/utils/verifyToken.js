import errorHandler from './error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({
  path: '..',
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, 'Unauthorized!'));

  jwt.verify(
    token, 
    process.env.JWT_SECRET_KEY, 
    (err, user) => {
      if (err) return next(errorHandler(403, 'Forbidden!'));
      req.user = user;
      next();
    }
  );
};

export default verifyToken;