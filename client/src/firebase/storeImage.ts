import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import type { Dispatch, SetStateAction } from 'react';

import { app } from '@/firebase/firebaseConfig';
import getFileNameWithTime from '@/utils/getFileNameWithTime';

const storeImage = async (
  file: File,
  setFileUploadProgressText: Dispatch<SetStateAction<string>>
) => {
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
        setFileUploadProgressText(
          `Uploading image (${filename}): ${progress.toFixed(2)}% done`
        );
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
