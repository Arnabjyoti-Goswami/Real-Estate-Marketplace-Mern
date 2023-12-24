import bcryptjs from 'bcryptjs';
import User from '../../models/user.model.js';

const deleteUser = async (req, res, next) => {
  if (req.userId !== req.params.id) return next(errorHandler(401, 'You can only delete your own account!'));

  let { oldPassword } = req.body;
  if (!oldPassword) return next(errorHandler(401, 'You must provide your old password!'));
  const user = await User.findById(req.params.id);
  const validPassword = bcryptjs.compareSync(oldPassword, user.password);
  if (!validPassword) return next(errorHandler(401, 'Wrong password!'));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json({
      message: 'User deleted successfully!' 
    });
  } catch (error) {
    next(error);
  }
};

export default deleteUser;