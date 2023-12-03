import errorHandler from '../../utils/error.js';
import bcryptjs from 'bcryptjs';
import User from '../../models/user.model.js';

const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));

  let { username, email, password, avatar, oldPassword } = req.body;
  if (!oldPassword) return next(errorHandler(401, 'You must provide your old password!'));
  const user = await User.findById(req.params.id);
  const validPassword = bcryptjs.compareSync(oldPassword, user.password);
  if (!validPassword) return next(errorHandler(401, 'Wrong password!'));

  try {
    if(password) {
      password = bcryptjs.hashSync(password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set:{
          username,
          email,
          password,
          avatar,
        }
      },
      { new: true },
    );

    const { password: pass, ...userWithoutPassword } = updatedUser._doc;

    res.status(200).json(userWithoutPassword);

  } catch (error) {
    next(error);
  }
};

export default updateUser;