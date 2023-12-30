import User from '@models/userModel';
import errorHandler from '@utils/errorHandler';
import asyncHandler from '@src/utils/asyncWrapper';

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) return next(errorHandler(404, 'User not found!'));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...userWithoutPassword } = user.toObject();

  res
    .status(200)
    .json(userWithoutPassword);

});

export default getUser;