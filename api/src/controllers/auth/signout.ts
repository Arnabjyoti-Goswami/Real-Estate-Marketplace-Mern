import asyncHandler from '@src/utils/asyncWrapper';

const signout = asyncHandler(async (req, res, _) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(200).json({
    success: true,
    message: 'Signed out successfully!',
  });
});

export default signout;
