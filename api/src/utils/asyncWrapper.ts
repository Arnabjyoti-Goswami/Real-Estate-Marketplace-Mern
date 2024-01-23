import { 
  Request, 
  Response, 
  NextFunction 
} from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | NextFunction>;

const asyncHandler = (controller: AsyncController) => {
  return async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export type { AsyncController };
export default asyncHandler;