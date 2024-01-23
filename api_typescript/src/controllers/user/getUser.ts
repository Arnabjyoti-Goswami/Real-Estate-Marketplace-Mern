import User from '@models/userModel';
import errorHandler from '@utils/errorHandler';
import asyncHandler from '@src/utils/asyncWrapper';

const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) return next(errorHandler(404, 'User not found!'));

  const fetchedUser = user.toObject();

  const sendData = {
    _id: fetchedUser._id,
    username: fetchedUser.username,
    email: fetchedUser.email,
    avatar: fetchedUser.email,
    createdAt: fetchedUser.createdAt,
    updatedAt: fetchedUser.updatedAt,
  };

  res.status(200).json(sendData);
});

export default getUser;
