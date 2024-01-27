import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import type { Dispatch as TDispatch, SetStateAction as TSetState } from 'react';

import { app } from '@/firebase/firebaseConfig';
import getFileNameWithTime from '@/utils/getFileNameWithTime';

type StoreImageProps =
  | {
      type: 'multiple';
      file: File;
      setter: TDispatch<TSetState<string>>;
    }
  | {
      type: 'single';
      file: File;
      setter: TDispatch<TSetState<number>>;
    };
const storeImage = async ({ type, file, setter }: StoreImageProps) => {
  return new Promise<string>((resolve, reject) => {
    const storage = getStorage(app);
    const filename = getFileNameWithTime(file.name);
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (type === 'multiple') {
          setter(`Uploading image (${filename}): ${progress.toFixed(2)}% done`);
        } else {
          setter(Number(progress.toFixed(2)));
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export default storeImage;
