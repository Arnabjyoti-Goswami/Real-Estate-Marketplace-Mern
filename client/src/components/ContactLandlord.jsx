import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const ContactOptions = ({ listing }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const [error, setError] = useState('');
  const [landlord, setLandlord] = useState({});

  const fetchLandlordData = async () => {
    try {
      setError('');

      const url = `/api/user/${listing.userRef}`;
      const data = await useFetch(url);

      setLandlord(data);
      setError('');

    } catch (error) {
      setError(error.message);
    }
  }

  const bottomRef = useRef(null);

  const scrollTo = (ref) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    fetchLandlordData();
  }, []);

  useEffect(() => {
    scrollTo(bottomRef);
    // dependancy array of this useEffect is such that only after the element that the bottom ref is set to is rendered, we scroll to it
  }, [landlord.username]);

  return (
    <>
    {landlord.username && (
    <div className='flex flex-col gap-2'>
      <p>
        Contact {' '}
        <span className='font-semibold'>
          {landlord.username}
        </span>
        {' '} for {' '}
        <span className='font-semibold'>
          {listing.name.toLowerCase()}
        </span>
      </p>
      <textarea
      id='message'
      rows='2'
      onChange={handleChange}
      ref={bottomRef}
      placeholder='Enter your message here...'
      className='w-full border p-3 rounded-lg'
      />
      <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
      className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
        Send Message
      </Link>
    </div>
    )}
    {error && (
      <p className='text-center my-7 text-lg text-red-500'>
        {error}
      </p>
    )}
    </>
  );
};

const ContactLandlord = ({ listing }) => {
  const { currentUser } = useSelector(state => state.user);

  const [showContactOptions, setShowContactOptions] = useState(false);

  return (
    <>
    {(currentUser && (listing.userRef !== currentUser._id) && !showContactOptions) && (
      <button className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
      onClick={() => {
        setShowContactOptions(true);
      }}>
        Contact Landlord
      </button>
    )}
    {showContactOptions && (
      <ContactOptions listing={listing} />
    )}
    {showContactOptions && (
      <button className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
      onClick={() => setShowContactOptions(false)}>
        Hide Contact Details
      </button>
    )}
    </>
  );
};

export default ContactLandlord;