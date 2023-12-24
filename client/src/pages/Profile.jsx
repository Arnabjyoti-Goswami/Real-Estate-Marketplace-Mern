import { useState, useEffect, useRef } from 'react';
import EyeIcon from '../components/EyeIcon.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserSuccess, deleteUserSuccess } from '../redux/user/userSlice.js';

import getFileNameWithTime from '../utils/getFileNameWithTime.js';

import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage';

import { app } from '../firebase.js';

import TimeoutElement from '../components/TimeoutElement.jsx';

import { Link, useNavigate } from 'react-router-dom';

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

const UserListings = () => {
  const { currentUser } = useSelector(state => state.user);

  const [showListingsError, setShowListingsError] = useState('');
  const [userListings, setUserListings] = useState([]);

  const handleShowListing = async () => {
    try {
      setShowListingsError('');
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  const navigate = useNavigate();
  const navigateToListing = (id) => {
    navigate(`/listing/${id}`);
  };

  const [showListings, setShowListings] = useState(false);

  return (
    <>
    <button className='text-green-700 
    w-[40%] mt-5 ml-[30%] py-3 px-5
    rounded-lg uppercase
    border border-slate-500
    hover:shadow-lg hover:shadow-slate-300 hover:bg-slate-100/40
    whitespace-nowrap font-medium mb-2'
    onClick={() => {
      handleShowListing();
      setShowListings((prev) => !prev);
    }}>
      {showListings ? 'Hide Listings' : 'Show Listings'}
    </button>
    {showListingsError && (
      <p className='text-red-700 mb-2'>
        {showListingsError}
      </p>
    )}
    {
    (showListings && userListings && userListings.length > 0) &&(
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>
          Your Listings
        </h1>
        {
        userListings.map( (listing, index) => (
          <div key={index}
          className='border rounded-xl p-2'>
            <p className='text-slate-700 text-center border-b-2 border-slate-300 mb-1'>
              <span className='font-semibold cursor-pointer
              hover:underline truncate'
              onClick={() => navigateToListing(listing._id)}>
                {listing.name}
              </span>
            </p>
            <div className='flex justify-between items-center'>
              <div className='rounded-lg overflow-hidden
              w-[300px] cursor-pointer 
              hover:scale-105 transition-transform duration-300 ease-in-out'>
                <img src={listing.imageUrls[0]} 
                alt='listing cover' 
                className='object-contain'
                onClick={() => navigateToListing(listing._id)}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <button className='text-red-700 uppercase
                border-2 border-red-500
                bg-red-300 bg-opacity-60
                hover:bg-opacity-30
                hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-md hover:shadow-red-300
                py-[1px] px-[4px] rounded-lg'>
                  Delete
                </button>
                <button className='text-yellow-300 uppercase
                border-2 border-yellow-500
                bg-yellow-200 bg-opacity-30
                hover:bg-opacity-10
                hover:scale-105 transition-transform duration-300 ease-in-out hover:shadow-md hover:shadow-yellow-300/40
                py-[1px] px-[4px] rounded-lg'>
                  Edit
                </button>
              </div>
            </div>
          </div>
        ) )
        }
      </div>
    )
    }
    </>
  );
};

const Profile = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(state => state.user);

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

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
        return;
      }
      // console.log(data);

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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
        }),
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
          setFocusOldPassword(false);
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
          <EyeIcon visible={oldPasswordVisible} setVisible={setOldPasswordVisible}/>
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
          />
          <EyeIcon visible={passwordVisible} setVisible={setPasswordVisible}/>
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
          />
          <EyeIcon visible={confirmPasswordVisible} setVisible={setConfirmPasswordVisible}/>
        </div>
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

      <div className='flex justify-between mt-5 font-medium'>
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