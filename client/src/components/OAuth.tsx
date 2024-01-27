import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { signInSuccess } from '@/redux/user/userSlice';

import { app } from '@/firebase/firebaseConfig';
import { postApi } from '@/apiCalls/fetchHook';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      if (!result.user.displayName) {
        console.log(
          "Couldn't sign in with google, user has no displayName property"
        );
        return;
      }
      if (!result.user.email) {
        console.log("Couldn't sign in with google, user has no email property");
        return;
      }
      if (!result.user.photoURL) {
        console.log(
          "Couldn't sign in with google, user has no photoUrl property"
        );
        return;
      }

      const url = '/api/auth/google' as const;
      const data = await postApi(url, {
        username: result.user.displayName,
        email: result.user.email,
        pfp: result.user.photoURL,
      });

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log("Couldn't sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-80'
    >
      continue with google
    </button>
  );
};

export default OAuth;
