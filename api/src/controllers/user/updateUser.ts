import bcryptjs from 'bcryptjs';
import errorHandler from '@utils/errorHandler';
import User from '@models/userModel';
import asyncHandler from '@utils/asyncWrapper';
import env from '@utils/validateEnv';

type reqBody = {
  userId: string,
  username: string,
  email: string,
  password: string,
  avatar: string,
  oldPassword: string,
}

type UpdateFields = {
  username?: string,
  email?: string,
  password?: string,
  avatar?: string,
}

const updateUser = asyncHandler(async(req, res, next) => {
  const { 
    userId,
    username,
    email,
    password,
    avatar,
    oldPassword,
  } : reqBody = req.body;

  if (userId !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));

  if (!oldPassword) return next(errorHandler(401, 'You must provide your old password!'));

  const user = await User.findById(userId);

  if (!user) return next(errorHandler(404, 'User not found!'));

  if (user) {
    const validPassword = bcryptjs.compareSync(oldPassword, user.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong password!'));
  }

  const updateFields: UpdateFields = {};

  // Only update the properties of the user that are not empty
  if (username) {
    updateFields.username = username;
  }
  if (email) {
    updateFields.email = email;
  }
  if (password) {
    updateFields.password = bcryptjs.hashSync(password, env.NUM_SALT);
  }
  if (avatar) {
    updateFields.avatar = avatar;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true },
  );

  if (!updatedUser) return next(errorHandler(404, 'User not found!'));
  else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...userWithoutPassword } = updatedUser.toObject();
    res.status(200).json(userWithoutPassword);
  }
});

export default updateUser;