import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';

import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async (e) => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          pfp: result.user.photoURL,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      console.log("Couldn't sign in with google", error);
    }
  };
  return (
    <button onClick={handleGoogleClick}
    type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-80'>
      continue with google
    </button>
  );
};

export default OAuth;