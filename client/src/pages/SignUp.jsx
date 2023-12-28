import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput.jsx';
import OAuth from '../components/OAuth';
import TimeoutElement from '../components/TimeoutElement.jsx';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState('');

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
      return;
    }

    if(formData.confirmPassword !== formData.password) {
      setError('Passwords are not matching!');
      setLoading(false);
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
    }
  };

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
          setFocusField('');
        } }/>
        <input type='email' 
        placeholder='email' 
        className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none' 
        id='email' 
        onChange={handleChange}
        required
        onClick={ () => {
          setFocusField('');
        } }/>
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
          <span className='text-Blue'>
            Sign In
          </span>
        </Link>
      </div>

      <TimeoutElement 
        tagName='p'
        classNames='text-red-500 mt-5'
        valueState={error}
        valueStateMatchWhenNotEmpty={true}
        setValueState={setError}
        valueStateDefaultValue={''}
        text={error}
      />
    </div>
  );
}

export default SignUp;