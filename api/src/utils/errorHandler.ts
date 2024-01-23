import CustomError from '@utils/customError';

const customError = (
  statusCode: number, 
  message: string
): CustomError => {
  const error: CustomError = new Error(message) as CustomError;
  error.statusCode = statusCode;
  return error;
};

export default customError;