import { useState, useEffect, ChangeEvent, ElementRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

import ForgotPassword from '../components/ForgotPassword.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { RootState } from '@/redux/store';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorTimeout, setErrorTimeout] = useState<null | NodeJS.Timeout>(null);
  const [focusField, setFocusField] = useState('');

  const { loading, error } = useSelector((state: RootState) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<ElementRef<'input'>>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // console.log(e.target.id, ':', e.target.value);
  };

  const handleSubmit = async (e: ChangeEvent<ElementRef<'form'>>) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setNewTimeout();
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
      setNewTimeout();
    }
  };

  const setNewTimeout = () => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    setErrorTimeout(
      setTimeout(() => {
        dispatch(signInFailure(''));
      }, 3000)
    );
  };

  useEffect(() => {
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [errorTimeout]);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none'
          id='email'
          onChange={handleChange}
          required
          onClick={() => {
            setFocusField('');
          }}
        />
        <PasswordInput
          id='password'
          placeholder='password'
          focusField={focusField}
          setFocusField={setFocusField}
          handleChange={handleChange}
        />
        <button
          disabled={loading}
          type='submit'
          className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 
        disabled:placeholder-opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <ForgotPassword emailId={formData.email} />
      <div className='flex gap-2 mt-3'>
        <p>Don&apos;t have an account?</p>
        <Link to='/sign-up'>
          <span className='text-Blue'>Sign Up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error.message}</p>}
    </div>
  );
};

export default SignIn;
