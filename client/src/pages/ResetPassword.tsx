import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';;
import EyeIcon from '../components/EyeIcon.jsx';

const ResetPassword = () => {
  const [token, setToken] = useState('');

  const getQueryParam = (param) =>  {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
  }

  useEffect(() => {
    const rawUrlToken = getQueryParam('token');
    const token = decodeURIComponent(rawUrlToken);
    setToken(token);
  }, []);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [focusField, setFocusField] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(false);

      const res = await fetch(
        '/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            newPassword: formData.password,
            token: token,
          }),
        }
      );

      const data = await res.json();

      if(data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      navigate('/sign-in');

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Reset Password
      </h1>
      <form className='flex flex-col gap-4' 
      onSubmit={handleSubmit}>
        <div className={`
         ${(focusField === 'password') ? 'bg-gray-100 border-slate-700' : ''}
         flex items-center border p-3 rounded-lg
         `}>
          <input
          type={!passwordVisible ? 'password' : 'text'}  
          placeholder='password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${(focusField === 'password') ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusField('password');
          } }
          id='password'
          onChange={handleChange}
          required/>
          <EyeIcon visible={passwordVisible} setVisible={setPasswordVisible}/>
        </div>
        <div className={`
         ${(focusField === 'confirmPassword') ? 'bg-gray-100 border-slate-700' : ''}
         flex items-center border p-3 rounded-lg
         `}>
          <input
          type={!confirmPasswordVisible ? 'password' : 'text'}  
          placeholder='confirm password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${(focusField === 'confirmPassword') ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusField('confirmPassword');
          } }
          id='confirmPassword'
          onChange={handleChange}
          required/>
          <EyeIcon visible={confirmPasswordVisible} setVisible={setConfirmPasswordVisible}/>
        </div>
        <button disable={loading.toString()} 
        type='submit'
        className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 
        disabled:placeholder-opacity-80'>
          {loading ? 'Loading...' : 'Reset Password'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Go back to</p>
        <Link to='/sign-in'>
          <span className='text-Blue'>
            Sign In
          </span>
        </Link>
      </div>

      {
      error && 
      <p className='text-red-500 mt-5'>
        {error}
      </p>
      }
    </div>
  );
};

export default ResetPassword;