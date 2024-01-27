import { useState } from 'react';
import type { ChangeEvent, ElementRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import PasswordInput from '@/components/PasswordInput';
import OAuth from '@/components/OAuth';
import TimeoutElement from '@/components/TimeoutElement';
import { postApi } from '@/apiCalls/fetchHook';
import { ForgotPasswordSchema } from '@/zod-schemas/apiSchemas';

const SignUp = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    username: '',
    email: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [focusField, setFocusField] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<ElementRef<'input'>>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const { mutate: mutateSignUpUser, isPending: loading } = useMutation({
    mutationFn: async () => {
      const url = '/api/auth/signup' as const;
      const postBody = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
      const data = await postApi(url, postBody);
      const parse = ForgotPasswordSchema.parse(data);
      return parse;
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
    onSuccess: () => {
      navigate('/sign-in');
    },
  });

  const handleSubmit = async (e: FormEvent<ElementRef<'form'>>) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])|(?=.*\d)/;
    if (
      formData.password.length < 8 ||
      !passwordRegex.test(formData.password)
    ) {
      setErrorMsg(
        'Password must be a minimum of 8 characters in length, and contain at least 1 special character or a number.'
      );
      return;
    }

    if (formData.confirmPassword !== formData.password) {
      setErrorMsg('Passwords are not matching!');
      return;
    }

    mutateSignUpUser();
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none'
          id='username'
          onChange={handleChange}
          required
          onClick={() => {
            setFocusField('');
          }}
        />
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
        <PasswordInput
          id='confirmPassword'
          placeholder='confirm password'
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
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-Blue'>Sign In</span>
        </Link>
      </div>

      <TimeoutElement
        tagName='p'
        classNames='text-red-500 mt-5'
        valueState={errorMsg}
        valueStateMatchWhenNotEmpty={true}
        setValueState={setErrorMsg}
        valueStateDefaultValue={''}
        text={errorMsg}
      />
    </div>
  );
};

export default SignUp;
