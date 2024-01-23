import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { updateUserSuccess, deleteUserSuccess } from '../redux/user/userSlice.js';

import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';
import { app } from '../firebase.js';

import TimeoutElement from '../components/TimeoutElement.jsx';
import getFileNameWithTime from '../utils/getFileNameWithTime.js';
import PasswordInput from '../components/PasswordInput.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import UserListings from '../components/userListings.jsx';
import useFetch from '../hooks/useFetch.js';

const FileUploadMessage = ({ percent, error, setError, setPercent }) => {
  let message = null;
  if (typeof error === 'object' && error) {
    message = 
    <TimeoutElement
    tagName='span'
    classNames='text-red-700'
    valueState={error}
    setValueState={setError}
    valueStateDefaultValue={null}
    valueStateMatchWhenNotEmpty={true}
    text={'File must be less than 2mb and an image!'}
    />;
  } else if (typeof error === 'string' && error) {
    message = 
    <TimeoutElement
    tagName='span'
    classNames='text-red-700'
    valueState={error}
    setValueState={setError}
    valueStateDefaultValue={null}
    valueStateMatchWhenNotEmpty={true}
    text={error}
    />;
  } else if (percent > 0 && percent < 100) {
    message = 
    <span className='text-slate-700'>
      {`Uploading ${percent}%`}
    </span>;
  } else if (percent === 100) {
    message = 
    <TimeoutElement
    tagName='span'
    classNames='text-green-700'
    valueState={percent}
    valueStateValueToMatch={100}
    setValueState={setPercent}
    valueStateDefaultValue={0}
    text='Image successfully uploaded!'
    />
  }

  return (
    <p className='text-center'>
      {message}
    </p>
  );
};

const Profile = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(state => state.user);

  const [focusField, setFocusField] = useState('');
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    oldPassword: '',
    password: '',
    confirmPassword: '',
    avatar: currentUser.avatar,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileRef = useRef(null);
  const [file, setFile ] = useState(undefined);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // console.log(e.target.id, ':', e.target.value);
  };

  const checkNoChanges = () => {
    const noPasswordChange = formData.password === formData.oldPassword && formData.confirmPassword === formData.oldPassword;
    const noNewPassword = formData.password === '' && formData.confirmPassword === '';
    const passwordUnchanged = noPasswordChange || noNewPassword;
    if (formData.username === currentUser.username && formData.email === currentUser.email && formData.avatar === currentUser.avatar && passwordUnchanged) {
      return true;
    }
    return false;
  };

  const passwordValidation = () => {
    let result = true;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])|(?=.*\d)/;
    if (formData.password.length < 8 || !passwordRegex.test(formData.password)) {
      setError('Password must be a minimum of 8 characters in length, and contain at least 1 special character or a number.');
      setLoading(false);
      result = false;
    }

    if(formData.confirmPassword !== formData.password) {
      setError('Passwords are not matching!');
      setLoading(false);
      result = false;
    }

    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noChanges = checkNoChanges();
    if (noChanges) {
      setError("Can't Update! No changes are made.");
      return;
    }

    // If the user is changing the password, then perform checks on the new password. If checks failed, then return from this handleSubmit function.
    if (formData.password) {
      const passwordsValidated = passwordValidation();
      if (!passwordsValidated) {
        return;
      }
    }

    try {
      setLoading(true);

      const url = `/api/user/update/${currentUser._id}`;
      const fetchOptions = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          oldPassword: formData.oldPassword,
          password: formData.password,
          avatar: formData.avatar,
        }),
      };

      const data = await useFetch(url, fetchOptions);

      setLoading(false);
      setError(null);
      dispatch(updateUserSuccess(data));
      setSuccessMsg('Profile updated successfully!');
    }
    catch (error) {
      setLoading(false);
      setError(error.message);
    }
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

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = getFileNameWithTime(file.name);
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then( (downloadURL) => {
          setFormData({ 
            ...formData, 
            avatar: downloadURL 
          });
        });
      },
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // These checks are also present in the firebase storage rules, so they are not really required. But doing them here too is more efficient as it doesn't waste time fully uploading the file to the storage and then checking if it satisfies the storage's rules.
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError('File must be less than 2mb!');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFileUploadError('File must be an image!');
      return;
    }
    setFile(file);
  };

  const handleDeleteAccount = async (e) => {
    setLoading(true);

    try {
      const url = `/api/user/delete/${currentUser._id}`;
      const fetchOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
        }),
      };
      await useFetch(url, fetchOptions);

      setLoading(false);
      setError(null);
      dispatch(deleteUserSuccess());
      setSuccessMsg('Account deleted successfully!');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const handleSignOut = async (e) => {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if(data.success === false)  {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      dispatch(deleteUserSuccess());
      setSuccessMsg('Signed out successfully!');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Profile
      </h1>

      <form className='flex flex-col gap-4
      mb-2' 
      onSubmit={handleSubmit}>
        <input accept='image/*'
        type='file' 
        ref={fileRef} 
        hidden 
        onChange={handleFileChange}
        />
        <img onClick={ () => {
          fileRef.current.click();
        } }
        src={formData.avatar}
        id='avatar'
        alt='profile'
        className='rounded-full h-24 w-24 object-cover cursor-pointer mt-2 self-center' />
        <FileUploadMessage 
        error={fileUploadError}
        setError={setFileUploadError}
        percent={fileUploadPercentage}
        setPercent={setFileUploadPercentage}
        />
        <input type='text'
        value={formData.username} 
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
        value={formData.email}
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
        <button disable={loading.toString()} 
        type='submit'
        className='bg-slate-700 text-white p-3 rounded-lg uppercase 
        hover:opacity-95
        disabled:placeholder-opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
        <button type='button'
        className='bg-green-700 p-3 rounded-lg 
        uppercase text-center text-white
        hover:opacity-90'
        >
          <Link to='/create-listing'>
            Create Listing
          </Link>
        </button>
      </form>
      
      <ForgotPassword emailId={formData.email} />
      
      <div className='flex justify-between mt-3 font-medium'>
        <span onClick={handleDeleteAccount}
        className='text-red-700 cursor-pointer'>
          Delete account
        </span>
        <span onClick={handleSignOut}
        className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <TimeoutElement
      tagName='p'
      classNames='text-red-700 mt-5'
      valueState={error}
      setValueState={setError}
      valueStateDefaultValue={''}
      valueStateMatchWhenNotEmpty={true}
      text={error}
      />

      <TimeoutElement
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