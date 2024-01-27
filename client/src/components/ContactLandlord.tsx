import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, RefObject, ElementRef } from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { getApi } from '@/apiCalls/fetchHook';
import type { TUser, TListing } from '@/zod-schemas/apiSchemas';
import { UserSchema } from '@/zod-schemas/apiSchemas';
import { RootState } from '@/redux/store';

interface ContactOptionsProps {
  listing: TListing;
}

const ContactOptions = ({ listing }: ContactOptionsProps) => {
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<ElementRef<'textarea'>>) => {
    setMessage(e.target.value);
  };

  const fetchLandlord = async () => {
    const url = `/api/user/${listing.userRef}` as const;
    const landlordData = await getApi(url);
    const parse = UserSchema.parse(landlordData);
    return parse;
  };

  const { data, error } = useQuery({
    queryFn: () => fetchLandlord(),
    queryKey: ['landlordData'],
  });

  const landlord = data as TUser;

  const bottomRef = useRef<ElementRef<'textarea'>>(null);

  const scrollTo = (ref: RefObject<ElementRef<'textarea'>>) => {
    if (!ref.current) return;
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollTo(bottomRef);
    // dependancy array of this useEffect is such that only after the element that the bottom ref is set to is rendered, we scroll to it
  }, [landlord.username]);

  return (
    <>
      {landlord.username && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            id='message'
            rows={2}
            onChange={handleChange}
            ref={bottomRef}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          />
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message
          </Link>
        </div>
      )}
      {error && (
        <p className='text-center my-7 text-lg text-red-500'>{error.message}</p>
      )}
    </>
  );
};

const ContactLandlord = ({ listing }: ContactOptionsProps) => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [showContactOptions, setShowContactOptions] = useState(false);

  return (
    <>
      {currentUser &&
        listing.userRef !== currentUser._id &&
        !showContactOptions && (
          <button
            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
            onClick={() => {
              setShowContactOptions(true);
            }}
          >
            Contact Landlord
          </button>
        )}
      {showContactOptions && <ContactOptions listing={listing} />}
      {showContactOptions && (
        <button
          className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
          onClick={() => setShowContactOptions(false)}
        >
          Hide Contact Details
        </button>
      )}
    </>
  );
};

export default ContactLandlord;
