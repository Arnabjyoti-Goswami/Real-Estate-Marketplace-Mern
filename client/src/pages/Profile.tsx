import { useState, useEffect, useRef } from 'react';
import type {
  ChangeEvent,
  Dispatch,
  ElementRef,
  FormEvent,
  SetStateAction,
} from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { updateUserSuccess, deleteUserSuccess } from '@/redux/user/userSlice';
import type { RootState } from '@/redux/store';

import type { TUser } from '@/zod-schemas/apiSchemas';
import { UserSchema, ForgotPasswordSchema } from '@/zod-schemas/apiSchemas';
import { getApi, postApi } from '@/apiCalls/fetchHook';

import TimeoutElement from '@/components/TimeoutElement';
import PasswordInput from '@/components/PasswordInput';
import ForgotPassword from '@/components/ForgotPassword';
import UserListings from '@/components/UserListings';
import storeImage from '@/firebase/storeImage';

interface FileUploadMessageProps {
  percent: number;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  setPercent: Dispatch<SetStateAction<number>>;
}

const FileUploadMessage = ({
  percent,
  error,
  setError,
  setPercent,
}: FileUploadMessageProps) => {
  let message = null;

  if (error) {
    message = (
      <TimeoutElement<string>
        tagName='span'
        classNames='text-red-700'
        valueState={error}
        setValueState={setError}
        valueStateDefaultValue={''}
        valueStateMatchWhenNotEmpty={true}
        text={error}
      />
    );
  } else if (percent > 0 && percent < 100) {
    message = <span className='text-slate-700'>{`Uploading ${percent}%`}</span>;
  } else if (percent === 100) {
    message = (
      <TimeoutElement<number>
        tagName='span'
        classNames='text-green-700'
        valueState={percent}
        valueStateValueToMatch={100}
        setValueState={setPercent}
        valueStateDefaultValue={0}
        text='Image successfully uploaded!'
      />
    );
  }

  return <p className='text-center'>{message}</p>;
};

const Profile = () => {
  const dispatch = useDispatch();

  const { currentUser: user } = useSelector((state: RootState) => state.user);
  const currentUser = user as TUser;

  const fileRef = useRef<ElementRef<'input'>>(null);

  const [focusField, setFocusField] = useState('');
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    oldPassword: '',
    password: '',
    confirmPassword: '',
    avatar: currentUser.avatar,
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [file, setFile] = useState<File>();
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadErrorMsg, setFileUploadErrorMsg] = useState('');

  const handleChange = (e: ChangeEvent<ElementRef<'input'>>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // console.log(e.target.id, ':', e.target.value);
  };

  const checkNoChanges = () => {
    const noPasswordChange =
      formData.password === formData.oldPassword &&
      formData.confirmPassword === formData.oldPassword;
    const noNewPassword =
      formData.password === '' && formData.confirmPassword === '';
    const passwordUnchanged = noPasswordChange || noNewPassword;
    if (
      formData.username === currentUser.username &&
      formData.email === currentUser.email &&
      formData.avatar === currentUser.avatar &&
      passwordUnchanged
    ) {
      return true;
    }
    return false;
  };

  const passwordValidation = () => {
    let result = true;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-])|(?=.*\d)/;
    if (
      formData.password.length < 8 ||
      !passwordRegex.test(formData.password)
    ) {
      setErrorMsg(
        'Password must be a minimum of 8 characters in length, and contain at least 1 special character or a number.'
      );
      result = false;
    }

    if (formData.confirmPassword !== formData.password) {
      setErrorMsg('Passwords are not matching!');
      result = false;
    }

    return result;
  };

  const {
    mutate: mutateUpdateUser,
    data: updatedUser,
    isPending: isLoadingUpdateUser,
  } = useMutation({
    mutationFn: async (userId: string) => {
      const url = `/api/user/update/${userId}` as const;
      const postBody = {
        username: formData.username,
        email: formData.email,
        oldPassword: formData.oldPassword,
        password: formData.password,
        avatar: formData.avatar,
      };
      const data = await postApi(url, postBody);
      const parse = UserSchema.parse(data);
      return parse;
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = async (e: FormEvent<ElementRef<'form'>>) => {
    e.preventDefault();

    const noChanges = checkNoChanges();
    if (noChanges) {
      setErrorMsg("Can't Update! No changes are made.");
      return;
    }

    if (formData.password) {
      const passwordsValidated = passwordValidation();
      if (!passwordsValidated) {
        return;
      }
    } else {
      return;
    }

    mutateUpdateUser(currentUser._id);
    dispatch(updateUserSuccess(updatedUser));
    setSuccessMsg('Profile updated successfully!');
  };

  // Firebase storage rules:
  /*
  rules_version = '2';

  // Craft rules based on data in your Firestore database
  // allow write: if firestore.get(
  //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read;
        allow write: if 
        request.resource.size < 2 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*')
      }
    }
  }
  */

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    storeImage({
      type: 'single',
      file: file,
      setter: setFileUploadPercentage,
    })
      .then((downloadUrl) => {
        setFormData({ ...formData, avatar: downloadUrl });
      })
      .catch((error) => {
        setFileUploadErrorMsg(error.message);
      });
  };

  const handleFileChange = (e: ChangeEvent<ElementRef<'input'>>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    // These checks are also present in the firebase storage rules, so they are not really required. But doing them here too is more efficient as it doesn't waste time fully uploading the file to the storage and then checking if it satisfies the storage's rules.
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadErrorMsg('File must be less than 2mb!');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFileUploadErrorMsg('File must be an image!');
      return;
    }
    setFile(file);
  };

  const { mutate: mutateUserDelete } = useMutation({
    mutationFn: async (userId: string) => {
      const url = `/api/user/delete/${userId}` as const;
      const postData = { oldPassword: formData.oldPassword };
      await postApi(url, postData);
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
    onSuccess: () => {
      dispatch(deleteUserSuccess());
      setSuccessMsg('Account deleted successfully!');
    },
  });

  const { mutate: mutateUserSignout } = useMutation({
    mutationFn: async () => {
      const url = '/api/auth/signout' as const;
      const data = await getApi(url);
      const parse = ForgotPasswordSchema.parse(data);
      return parse;
    },
    onSuccess: () => {
      dispatch(deleteUserSuccess());
      setSuccessMsg('Signed out successfully!');
    },
  });

  const handleDeleteAccount = async () => {
    mutateUserDelete(currentUser._id);
  };

  const handleSignOut = async () => {
    mutateUserSignout();
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>

      <form
        className='flex flex-col gap-4
        mb-2'
        onSubmit={handleSubmit}
      >
        <input
          accept='image/*'
          type='file'
          ref={fileRef}
          hidden
          onChange={handleFileChange}
        />
        <img
          onClick={() => {
            fileRef.current && fileRef.current.click();
          }}
          src={formData.avatar}
          id='avatar'
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center'
        />
        <FileUploadMessage
          error={fileUploadErrorMsg}
          setError={setFileUploadErrorMsg}
          percent={fileUploadPercentage}
          setPercent={setFileUploadPercentage}
        />
        <input
          type='text'
          value={formData.username}
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
          value={formData.email}
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
          id='oldPassword'
          placeholder='old password'
          focusField={focusField}
          setFocusField={setFocusField}
          handleChange={handleChange}
        />
        <PasswordInput
          id='password'
          placeholder='new password'
          focusField={focusField}
          setFocusField={setFocusField}
          handleChange={handleChange}
        />
        <PasswordInput
          id='confirmPassword'
          placeholder='confirm new password'
          focusField={focusField}
          setFocusField={setFocusField}
          handleChange={handleChange}
        />
        <button
          disabled={isLoadingUpdateUser}
          type='submit'
          className='bg-slate-700 text-white p-3 rounded-lg uppercase 
          hover:opacity-95
          disabled:placeholder-opacity-80'
        >
          {isLoadingUpdateUser ? 'Loading...' : 'Update'}
        </button>
        <button
          type='button'
          className='bg-green-700 p-3 rounded-lg 
          uppercase text-center text-white
          hover:opacity-90'
        >
          <Link to='/create-listing'>Create Listing</Link>
        </button>
      </form>

      <ForgotPassword emailId={formData.email} />

      <div className='flex justify-between mt-3 font-medium'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <TimeoutElement<string>
        tagName='p'
        classNames='text-red-700 mt-5'
        valueState={errorMsg}
        setValueState={setErrorMsg}
        valueStateDefaultValue={''}
        valueStateMatchWhenNotEmpty={true}
        text={errorMsg}
      />

      <TimeoutElement<string>
        tagName='p'
        classNames='text-green-700 mt-5'
        valueState={successMsg}
        valueStateMatchWhenNotEmpty={true}
        setValueState={setSuccessMsg}
        valueStateDefaultValue={''}
        text={successMsg}
      />

      <UserListings />
    </div>
  );
};

export default Profile;
