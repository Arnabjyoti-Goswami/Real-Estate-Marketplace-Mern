import { useState, useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import TimeoutElement from '@/components/TimeoutElement';
import { ForgotPasswordSchema } from '@/zod-schemas/apiSchemas';

interface ForgotPasswordProps {
  emailId: string;
}

const ForgotPassword = ({ emailId }: ForgotPasswordProps) => {
  const [showSendEmailOption, setShowSendEmailOption] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    const timeInSeconds = 3;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setShowSendEmailOption(true);

    timeoutRef.current = setTimeout(() => {
      setShowSendEmailOption(false);
    }, timeInSeconds * 1000);
  };

  const { mutate, isPending, isError, isSuccess, error } = useMutation({
    mutationFn: async (email: string) => {
      if (!email) throw new Error('You must provide your email id!');

      const url = '/api/auth/forgot-password' as const;

      const data = axios
        .post(url, email)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if ('message' in error) throw new Error(error.message);
        });

      const parse = ForgotPasswordSchema.parse(data);

      return parse;
    },
  });

  if (isPending) setShowSendEmailOption(false);
  if (isSuccess) setSuccessMsg('Email sent successfully! Check your inbox.');
  if (isError) setErrorMsg(error.message);

  return (
    <div
      className='flex flex-col items-center gap-1
      my-2'
    >
      <button
        className='text-slate-700
        hover:underline cursor-pointer
        hover:text-Blue'
        onClick={handleClick}
      >
        Forgot Password?
      </button>
      {showSendEmailOption && (
        <span
          className='text-slate-600
          hover:underline hover:text-Blue cursor-pointer'
          onClick={() => mutate(emailId)}
        >
          Receive an email with a link to reset your password.
        </span>
      )}

      {successMsg && <span className='text-green-600'>{successMsg}</span>}
      {isPending && <span className='text-slate-700'>Sending email...</span>}

      <TimeoutElement<string>
        tagName='span'
        classNames='text-red-600'
        valueState={errorMsg}
        valueStateValueToMatch={''}
        valueStateMatchWhenNotEmpty={true}
        setValueState={setErrorMsg}
        valueStateDefaultValue={''}
        text={errorMsg}
      />
    </div>
  );
};

export default ForgotPassword;
