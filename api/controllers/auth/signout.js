const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token');
    return res.status(200).json({
      message: 'Signed out successfully!'
    });
  } catch (error) {
    next(error);
  }
};

export default signout;