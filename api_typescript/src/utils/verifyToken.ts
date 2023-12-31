import errorHandler from '@utils/errorHandler';
import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import env from '@utils/validateEnv';
import asyncHandler from '@utils/asyncWrapper';
import getMsFromString from '@utils/getMsFromString';

type Decoded = {
  id: string;
  iat: number;
  exp: number;
};

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return verifyRefreshToken(req, res, next);

  verify(
    token, 
    env.JWT_SECRET_KEY,
    (
      err: VerifyErrors | null, 
      decoded?: object | string
    ) => {
      if (err) return verifyRefreshToken(req, res, next);
      if (!decoded) return verifyRefreshToken(req, res, next);
      req.body.userId = (decoded as Decoded).id;
      next();
    }
  );
});

const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refresh_token;

  if (!token) return next(errorHandler(401, 'Unauthorized!'));

  verify(
    token, 
    env.JWT_SECRET_KEY_2,
    (
      err: VerifyErrors | null, 
      decoded?: object | string
    ) => {
      if (err) return next(errorHandler(401, 'Unauthorized!'));
      if (!decoded) return next(errorHandler(401, 'Unauthorized!'));

      const access_token = sign(
        { id: (decoded as Decoded).id },
        env.JWT_SECRET_KEY,
        { expiresIn: env.ACCESS_TOKEN_LIFE }
      );

      res
        .cookie(
          'access_token', 
          access_token, 
          {
            httpOnly: true,
            maxAge: getMsFromString(env.ACCESS_TOKEN_LIFE),
          }
        )
        .status(200)
        .json({
          success: true,
          message: 'Access token refreshed!',
        });

      return next();

    }
  );
});

export default verifyToken;