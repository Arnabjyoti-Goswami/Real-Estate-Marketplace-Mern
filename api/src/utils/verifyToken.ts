import errorHandler from '@utils/errorHandler';
import { verify, VerifyErrors } from 'jsonwebtoken';
import env from '@utils/validateEnv';
import asyncHandler from '@utils/asyncWrapper';

type Decoded = {
  id: string;
  iat: number;
  exp: number;
};

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Access token unauthorized!'));

  verify(
    token, 
    env.JWT_SECRET_KEY,
    (
      err: VerifyErrors | null, 
      decoded?: object | string
    ) => {
      if (err) return next(errorHandler(401, 'Access token unauthorized!'));
      if (!decoded) return next(errorHandler(401, 'Access token unauthorized!'));
      req.body.userId = (decoded as Decoded).id;
      next();
    }
  );
});

export default verifyToken;