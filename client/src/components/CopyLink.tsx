import { useState, useRef } from 'react';

import { FaShare } from 'react-icons/fa';

const CopyLink = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      <div
        className='fixed top-[13%] right-[3%] z-10 
        border rounded-full w-12 h-12 
        flex justify-center items-center 
        bg-slate-100 cursor-pointer'
        onClick={() => handleCopyClick()}
      >
        <FaShare className='text-slate-500' />
      </div>
      {copied && (
        <p
          className='fixed top-[23%] right-[3%] z-10 
          rounded-md bg-green-200 p-2 border border-green-700'
          style={{ boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)' }}
        >
          Link copied!
        </p>
      )}
    </>
  );
};

export default CopyLink;
