import { useState, useRef } from 'react';

import TimeoutElement from './TimeoutElement.jsx';

const ForgotPassword = ({ emailId }) => {
  const [showSendEmailOption, setShowSendEmailOption] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
      setError('');
      setShowSendEmailOption(false);
      setLoading(true);

      if (!emailId) {
        setError('You must provide your email id!');
        setLoading(false);
        return;
      }

      const res = await fetch(
        '/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailId,
          }),
        },
      );
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setError('');
      setLoading(false);
      setSuccessMsg('Email sent successfully! Check your inbox.');

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
  <div className='flex flex-col items-center gap-1
  my-2'>
    <button 
    className='text-slate-700
    hover:underline cursor-pointer
    hover:text-Blue'
    onClick={handleClick}
    >
      Forgot Password?
    </button>
    {showSendEmailOption && (
      <span className='text-slate-600
      hover:underline hover:text-Blue cursor-pointer'
      onClick={handleApiCall}>
        Receive an email with a link to reset your password.
      </span>
    )}
    {successMsg && (
      <span className='text-green-600'>
        {successMsg}
      </span>
    )}
    {loading && (
      <span className='text-slate-700'>
        Sending email...
      </span>
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