import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);

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
          oldPassword: formData.oldPassword,
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

  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [focusOldPassword, setFocusOldPassword] = useState(false);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Profile
      </h1>

      <form className='flex flex-col gap-4' 
      onSubmit={handleSubmit}>
        <img src={currentUser.avatar}
        alt='profile'
        className='rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center' />
        <input type='text'
        value={currentUser.username} 
        placeholder='username' 
        className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none' 
        id='username' 
        onChange={handleChange}
        required
        onClick={ () => {
          setFocusPassword(false);
          setFocusPassword(false);
          setFocusConfirmPassword(false);
        } }/>
        <input type='email'
        value={currentUser.email}
        placeholder='email' 
        className='border p-3 rounded-lg
        focus:bg-gray-100 focus:border-slate-700 focus:outline-none' 
        id='email' 
        onChange={handleChange}
        required
        onClick={ () => {
          setFocusOldPassword(false);
          setFocusPassword(false);
          setFocusConfirmPassword(false);
        } }/>
        
        <div className={`
         ${focusOldPassword ? 'bg-gray-100 border-slate-700' : ''}
         flex items-center border p-3 rounded-lg
         `}>
          <input
          type={!oldPasswordVisible ? 'password' : 'text'}
          placeholder='old password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${focusOldPassword ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusOldPassword(true);
            setFocusPassword(false);
            setFocusConfirmPassword(false);
          } }
          id='oldPassword' 
          onChange={handleChange}
          required/>
          {
          oldPasswordVisible ? (
            <EyeOutlined onClick={() => {
              setOldPasswordVisible(false)
            }}/>
          ) : (
            <EyeInvisibleOutlined onClick={() => {
              setOldPasswordVisible(true)
            }}/>
          )
          }
        </div>
        <div className={`
         ${focusPassword ? 'bg-gray-100 border-slate-700' : ''}
         flex items-center border p-3 rounded-lg
         `}>
          <input
          type={!passwordVisible ? 'password' : 'text'}  
          placeholder='new password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${focusPassword ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusOldPassword(false);
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
          placeholder='confirm new password' 
          className={`
          w-full
          focus:outline-none mr-[2px]
          ${focusConfirmPassword ? 'bg-gray-100' : ''}
          `}
          onClick={ () => {
            setFocusOldPassword(false);
            setFocusPassword(false);
            setFocusConfirmPassword(true);
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
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>

      <div className='flex justify-between mt-5 font-medium'>
        <span className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span className='text-red-700 cursor-pointer'>
          Sign out
        </span>
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

export default Profile;