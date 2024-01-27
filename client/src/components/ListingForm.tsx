import { useState } from 'react';
import type { ChangeEvent, ElementRef, FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery } from '@tanstack/react-query';

import storeImage from '@/firebase/storeImage';
import deleteFileFromFirebase from '@/firebase/deleteFile';

import { getApi, postApi } from '@/apiCalls/fetchHook';
import { ListingSchema, TPostBodyListing } from '@/zod-schemas/apiSchemas';

type ListingFormProps =
  | {
      type: 'create';
      idRouteParam: null;
    }
  | {
      type: 'update';
      idRouteParam: string;
    };

const ListingForm = ({
  type = 'create',
  idRouteParam = null,
}: ListingFormProps) => {
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileUploadProgressText, setFileUploadProgressText] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<TPostBodyListing>({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const fetchListingData = async () => {
    const url = `/api/listing/get/${idRouteParam}` as const;
    const listingData = getApi(url);
    const parse = ListingSchema.parse(listingData);
    return parse;
  };

  const {
    data: listingFetchRes,
    error: listingFetchErr,
    isError: islistingFetchErr,
    isSuccess: isListingFetchSuccess,
  } = useQuery({
    queryFn: () => fetchListingData(),
    queryKey: ['updateListingDataFetch', idRouteParam],
    enabled: type === 'update',
  });

  if (islistingFetchErr) {
    setErrorMsg(listingFetchErr.message);
  }

  if (isListingFetchSuccess) {
    setFormData(listingFetchRes);
  }

  const handleChange = (
    e: ChangeEvent<ElementRef<'input'>> | ChangeEvent<ElementRef<'textarea'>>
  ) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: (e.target as HTMLInputElement).checked,
      });
    } else if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const validateFormData = () => {
    if (formData.imageUrls.length < 1) {
      setErrorMsg('You must upload at least one image');
      return false;
    }
    if (+formData.regularPrice < +formData.discountPrice) {
      setErrorMsg('Discounted price must be lower than regular price');
      return false;
    }
    return true;
  };

  const { data, mutate, isPending, isError, error } = useMutation({
    mutationFn: async (formData: TPostBodyListing) => {
      let url = '/api/listing/create';
      if (type === 'update') {
        url = `/api/listing/update/${idRouteParam}`;
      }

      const data = postApi(url, formData);

      const parse = ListingSchema.parse(data);
      return parse;
    },
  });

  if (isError) {
    setErrorMsg(error.message);
  }

  const handleSubmit = async (e: FormEvent<ElementRef<'form'>>) => {
    e.preventDefault();

    const validationSuccess = validateFormData();
    if (!validationSuccess) return;
    mutate(formData);
    if (data) {
      navigate(`/listing/${data._id}`);
    }
  };

  const handleFileChange = (e: ChangeEvent<ElementRef<'input'>>) => {
    const files = e.target.files;

    if (!files) return;

    const filesArray = Array.from(files);

    const validFiles: File[] = [];

    filesArray.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        setFileUploadError('Each file must be less than 2mb!');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFileUploadError('Each file must be an image!');
        return;
      }
      validFiles.push(file);
    });

    const remainingSpace = 6 - formData.imageUrls.length;

    if (!(filesArray.length >= 1 && filesArray.length <= remainingSpace)) {
      setFileUploadError('You can only upload 6 images per listing');
      setFiles([]);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setFileUploadError('');

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i], setFileUploadProgressText));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setFileUploadError('');
          setUploading(false);
        })
        .catch((error) => {
          setFileUploadError(error.message);
          setUploading(false);
        });
    } else {
      setFileUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const handleRemoveImage = (url: string, index: number) => {
    deleteFileFromFirebase(url)
      .then(() => {
        console.log(`File ${url} deleted successfully`);
      })
      .catch((error) => {
        console.log(`Error deleting file ${url}: ${error.message}`);
      });

    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        {type === 'update' ? 'Update Listing' : 'Create Listing'}
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div
          className='flex-1
        flex flex-col gap-4'
        >
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                checked={formData.type === 'sale'}
                onChange={handleChange}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                checked={formData.type === 'rent'}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='py-2 pl-2 border border-gray-300 rounded-lg'
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <p>Bedrooms</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='py-2 pl-2 border border-gray-300 rounded-lg'
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <p>Bathrooms</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='0'
                required
                className='py-2 pl-2 border border-gray-300 rounded-lg
                no-spinners'
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='discountPrice'
                  min='0'
                  required
                  className='py-2 pl-2 border border-gray-300 rounded-lg
                  no-spinners'
                  value={formData.discountPrice}
                  onChange={handleChange}
                />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  {formData.type === 'rent' && (
                    <span className='text-xs'>($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className='flex-1
          flex flex-col gap-4'
        >
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              type='file'
              id='images'
              accept='image/*'
              multiple
              className='p-3 border border-gray-300 rounded w-full'
              onChange={handleFileChange}
            />
            <button
              className='p-3 text-green-700 border border-green-700 rounded uppercase
              bg-green-200 hover:bg-green-300
              hover:shadow-lg hover:shadow-slate-300
              disabled:opacity-80'
              type='button'
              onClick={handleImageSubmit}
              disabled={uploading}
            >
              {uploading ? 'Uploading' : 'Upload'}
            </button>
          </div>
          {fileUploadError && (
            <p className='text-red-700 text-sm'>{fileUploadError}</p>
          )}
          {fileUploadProgressText && (
            <p className='text-sm text-green-500'>{fileUploadProgressText}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className='flex justify-between p-3 border items-center'
                key={index}
              >
                <img
                  src={url}
                  alt='listing iamge'
                  className='w-40 h-40 object-cover rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(url, index)}
                  className='p-3 text-red-700 rounded-lg uppercase 
                  hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={isPending || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg 
            uppercase hover:opacity-95 disabled:opacity-80'
            type='submit'
          >
            {isPending
              ? type === 'update'
                ? 'Updating'
                : 'Creating...'
              : type === 'update'
              ? 'Update Listing'
              : 'Create Listing'}
          </button>
          {errorMsg && <p className='text-red-700 text-sm'>{errorMsg}</p>}
        </div>
      </form>
    </main>
  );
};

export default ListingForm;
