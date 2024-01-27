import { useState, useEffect } from 'react';
import type { ChangeEvent, ElementRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import EyeIcon from '@/components/EyeIcon';
import { postApi } from '@/apiCalls/fetchHook';
import { NoDataResSchema } from '@/zod-schemas/apiSchemas';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [focusField, setFocusField] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const rawUrlToken = queryParams.get('token');
    if (rawUrlToken) {
      const token = decodeURIComponent(rawUrlToken);
      setToken(token);
    }
  }, []);

  const handleChange = (e: ChangeEvent<ElementRef<'input'>>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const {
    mutate,
    isError,
    error,
    isPending: isLoading,
  } = useMutation({
    mutationFn: async () => {
      const url = '/api/auth/reset-password' as const;
      const postBody = {
        newPassword: formData.password,
        token: token,
      };
      const data = postApi(url, postBody);
      const parse = NoDataResSchema.parse(data);
      return parse;
    },
  });

  const handleSubmit = async (e: FormEvent<ElementRef<'form'>>) => {
    e.preventDefault();
    mutate();
    navigate('/sign-in');
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Reset Password
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div
          className={`
          ${focusField === 'password' ? 'bg-gray-100 border-slate-700' : ''}
          flex items-center border p-3 rounded-lg
          `}
        >
          <input
            type={!passwordVisible ? 'password' : 'text'}
            placeholder='password'
            className={`
            w-full
            focus:outline-none mr-[2px]
            ${focusField === 'password' ? 'bg-gray-100' : ''}
            `}
            onClick={() => {
              setFocusField('password');
            }}
            id='password'
            onChange={handleChange}
            required
          />
          <EyeIcon visible={passwordVisible} setVisible={setPasswordVisible} />
        </div>
        <div
          className={`
          ${
            focusField === 'confirmPassword'
              ? 'bg-gray-100 border-slate-700'
              : ''
          }
          flex items-center border p-3 rounded-lg
          `}
        >
          <input
            type={!confirmPasswordVisible ? 'password' : 'text'}
            placeholder='confirm password'
            className={`
            w-full
            focus:outline-none mr-[2px]
            ${focusField === 'confirmPassword' ? 'bg-gray-100' : ''}
            `}
            onClick={() => {
              setFocusField('confirmPassword');
            }}
            id='confirmPassword'
            onChange={handleChange}
            required
          />
          <EyeIcon
            visible={confirmPasswordVisible}
            setVisible={setConfirmPasswordVisible}
          />
        </div>
        <button
          disabled={isLoading}
          type='submit'
          className='bg-slate-700 text-white p-3 rounded-lg uppercase 
          hover:opacity-95 
          disabled:placeholder-opacity-80'
        >
          {isLoading ? 'Loading...' : 'Reset Password'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Go back to</p>
        <Link to='/sign-in'>
          <span className='text-Blue'>Sign In</span>
        </Link>
      </div>

      {isError && <p className='text-red-500 mt-5'>{error.message}</p>}
    </div>
  );
};

export default ResetPassword;
