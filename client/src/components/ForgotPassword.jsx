import { useState, useRef } from 'react';

import TimeoutElement from './TimeoutElement.jsx';

const ForgotPassword = ({ emailId }) => {
  const [showSendEmailOption, setShowSendEmailOption] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = () => {
    const timeInSeconds = 3;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowSendEmailOption(true);

    timeoutRef.current = setTimeout(() => {
      setShowSendEmailOption(false);
    }, timeInSeconds * 1000);
  }

  const [error, setError] = useState('');

  const handleApiCall = async () => {
    try {
      const res = await fetch(
        '/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailId,
            emailHtml,
          }),
        },
      );
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
      }

    } catch (error) {
      setError(error.message);
    }
  };

  return (
  <div className='flex flex-col items-center gap-1
  my-2'>
    <button 
    className='text-slate-700
    hover:underline cursor-pointer
    hover:text-blue'
    onClick={handleClick}
    >
      Forgot Password?
    </button>
    {showSendEmailOption && (
    <Link to='/forgot-password'>
      <span className='text-slate-600
      hover:underline hover:text-blue cursor-pointer'
      onClick={handleApiCall}>
        Receive an email with a link to reset your password.
      </span>
    </Link>
    )} 
    <TimeoutElement 
    tagName='span'
    classNames='text-red-600'
    valueState={error}
    valueStateValueToMatch={''}
    valueStateMatchWhenNotEmpty={true}
    setValueState={setError}
    valueStateDefaultValue={''}
    text={error}
    />
  </div>
  );
};

export default ForgotPassword;