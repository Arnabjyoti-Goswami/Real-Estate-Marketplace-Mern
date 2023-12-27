import User from '../../models/user.model.js';
import errorHandler from '../../utils/error.js';

const getUser = async (req, res, next) => {
  const { id: userId } = req.params;

  try {
    const user = await User.findById(userId);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...userWithoutPassword } = user._doc;

    res
      .status(200)
      .json(userWithoutPassword);

  } catch (error) {
    next(error);
  }
};

export default getUser;