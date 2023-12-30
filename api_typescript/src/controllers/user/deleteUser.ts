import bcryptjs from 'bcryptjs';
import User from '@models/userModel';
import errorHandler from '@utils/errorHandler';
import asyncHandler from '@utils/asyncWrapper';

type reqBody = {
  userId: string,
  oldPassword: string,
}

const deleteUser = asyncHandler(async (req, res, next) => {
  const { oldPassword, userId } : reqBody = req.body;

  if (userId !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));

  if (!oldPassword) return next(errorHandler(401, 'You must provide your old password!'));

  const user = await User.findById(req.params.id);

  if (user) {
    const validPassword = bcryptjs.compareSync(oldPassword, user.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong password!'));
  }

  await User.findByIdAndDelete(req.params.id);

  res.clearCookie('access_token');

  res.status(200).json({
    message: 'User deleted successfully!' 
  });
  
});

export default deleteUser;