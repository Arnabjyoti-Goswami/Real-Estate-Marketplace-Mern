import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import getFileNameWithTime from '../utils/getFileNameWithTime.js';

import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';
import { app } from '../firebase.js';

const FileUploadMessage = ({ percent, error, setPercent }) => {
  const [successTimeout, setSuccessTimeout] = useState(null);

  const setNewSuccessTimeout = () => {
    if (successTimeout) {
      clearTimeout(successTimeout);
    }
    const timeout = setTimeout(() => {
      setPercent(0);
    }, 3000);
    setSuccessTimeout(timeout);
  };

  useEffect(() => {
    if (percent === 100) {
      setNewSuccessTimeout();
    }
  }, [percent]);

  let message = null;
  if (typeof error === 'object' && error) {
    message = 
    <span className='text-red-700'>
      File must be less than 2mb and an image!
    </span>;
  } else if (typeof error === 'string' && error) {
    message = 
    <span className='text-red-700'>
      {error}
    </span>;
  } else if (percent > 0 && percent < 100) {
    message = 
    <span className='text-slate-700'>
      {`Uploading ${percent}%`}
    </span>;
  } else if (percent === 100) {
    message = 
    <span className='text-green-700'>
      Image successfully uploaded!
    </span>;
  }

  return (
    <p className='text-center'>
      {message}
    </p>
  );
};

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email,
    oldPassword: '',
    password: '',
    confirmPassword: '',
    avatar: currentUser.avatar,
  });

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

      const res = await fetch('/api/auth/update', {
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

  const fileRef = useRef(null);

  const [file, setFile ] = useState(undefined);

  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);

  const [fileUploadErrorTimeout, setFileUploadErrorTimeout] = useState(null);
  const setNewFileUploadErrorTimeout = () => {
    if (fileUploadErrorTimeout) {
      clearTimeout(fileUploadErrorTimeout);
    }
    setFileUploadErrorTimeout(
      setTimeout(() => {
        setFileUploadError(null);
      }, 3000)
    );
  };
  useEffect(() => {
    return () => {
      if (fileUploadErrorTimeout) {
        clearTimeout(fileUploadErrorTimeout);
      }
    };
  }, [fileUploadErrorTimeout]);

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

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error);
        setNewFileUploadErrorTimeout();
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

  console.log('File', file);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // These checks are also present in the firebase storage rules, so they are not really required. But doing them here too is more efficient as it doesn't waste time fully uploading the file to the storage and then checking if it satisfies the storage's rules.
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError('File must be less than 2mb!');
      setNewFileUploadErrorTimeout();
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFileUploadError('File must be an image!');
      setNewFileUploadErrorTimeout();
      return;
    }
    setFile(file);
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Profile
      </h1>

      <form className='flex flex-col gap-4' 
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
          setFocusPassword(false);
          setFocusPassword(false);
          setFocusConfirmPassword(false);
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