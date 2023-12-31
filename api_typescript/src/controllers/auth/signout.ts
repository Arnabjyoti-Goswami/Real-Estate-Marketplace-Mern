import { Request, Response, NextFunction } from 'express';

const signout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json({
      message: 'Signed out successfully!'
    });
  }
  catch (error) {
    next(error);
  }
};

export default signout;