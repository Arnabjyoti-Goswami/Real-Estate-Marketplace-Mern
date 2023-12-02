import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // console.log(e.target.id, ':', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])|(?=.*\d)/;
    if (formData.password.length < 8 || !passwordRegex.test(formData.password)) {
      setError('Password must be a minimum of 8 characters in length, and contain at least 1 special character or a number.');
      setLoading(false);
      setNewTimeout();
      return;
    }

    if(formData.confirmPassword !== formData.password) {
      setError('Passwords are not matching!');
      setLoading(false);
      setNewTimeout();
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if(data.success === false)  {
        setError(data.message);
        setLoading(false);
        setNewTimeout();
        return;
      }
      // console.log(data);

      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } 
    catch (error) {
      setLoading(false);
      setError(error.message);
      setNewTimeout();
    }
  };

  const [errorTimeout, setErrorTimeout] = useState(null);

  const setNewTimeout = () => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    setErrorTimeout(
      setTimeout(() => {
        setError(null);
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

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign Up
      </h1>
      <form className='flex flex-col gap-4' 
      onSubmit={handleSubmit}>
        <input type='text' 
        placeholder='username' 
        className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none' 
        id='username' 
        onChange={handleChange}
        required
        onClick={ () => {
          setFocusPassword(false);
          setFocusConfirmPassword(false);
        } }/>
        <input type='email' 
        placeholder='email' 
        className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none' 
        id='email' 
        onChange={handleChange}
        required
        onClick={ () => {
          setFocusPassword(false);
          setFocusConfirmPassword(false);
        } }/>
        <div className={`
         ${focusPassword ? 'bg-gray-100 border-slate-700' : ''}
         flex items-center border p-3 rounded-lg
         `}>
          <input
          type={!passwordVisible ? 'password' : 'text'}  
          placeholder='password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${focusPassword ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusPassword(true);
            setFocusConfirmPassword(false);
          } }
          id='password' 
          onChange={handleChange}
          required/>
          {
          passwordVisible ? (
            <EyeOutlined onClick={() => {
              setPasswordVisible(false)
            }}/>
          ) : (
            <EyeInvisibleOutlined onClick={() => {
              setPasswordVisible(true)
            }}/>
          )
          }
        </div>
        <div className={`
         ${focusConfirmPassword ? 'bg-gray-100 border-slate-700' : ''}
         flex items-center border p-3 rounded-lg
         `}>
          <input
          type={!confirmPasswordVisible ? 'password' : 'text'}  
          placeholder='confirm password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${focusConfirmPassword ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusConfirmPassword(true);
            setFocusPassword(false);
          } }
          id='confirmPassword' 
          onChange={handleChange}
          required/>
          {
          confirmPasswordVisible ? (
            <EyeOutlined onClick={() => {
              setConfirmPasswordVisible(false);
            }}/>
          ) : (
            <EyeInvisibleOutlined onClick={() => {
              setConfirmPasswordVisible(true);
            }}/>
          )
          }
        </div>
        <button disable={loading.toString()} 
        type='submit'
        className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95 
        disabled:placeholder-opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue'>
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
}

export default SignUp;