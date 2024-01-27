import { useState } from 'react';
import type { ChangeEvent, ElementRef, Dispatch, SetStateAction } from 'react';

import EyeIcon from '@/components/EyeIcon';

interface PasswordInputProps {
  id: string;
  placeholder: string;
  handleChange: (e: ChangeEvent<ElementRef<'input'>>) => void;
  focusField: string;
  setFocusField: Dispatch<SetStateAction<string>>;
}

const PasswordInput = ({
  id,
  placeholder,
  handleChange,
  focusField,
  setFocusField,
}: PasswordInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div
      className={`
      ${focusField === id ? 'bg-gray-100 border-slate-700' : 'bg-white'}
      flex items-center border p-3 rounded-lg
      `}
    >
      <input
        type={!passwordVisible ? 'password' : 'text'}
        placeholder={placeholder}
        id={id}
        className={`
        w-full
        focus:outline-none mr-[2px]
        ${focusField === id ? 'bg-gray-100' : 'bg-white'}
        `}
        required
        onChange={handleChange}
        onClick={() => {
          setFocusField(id);
        }}
      />
      <EyeIcon visible={passwordVisible} setVisible={setPasswordVisible} />
    </div>
  );
};

export default PasswordInput;
