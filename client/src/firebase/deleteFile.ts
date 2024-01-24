import { getStorage, ref, deleteObject } from 'firebase/storage';

import { app } from '@/firebase/firebaseConfig';

import getFilePathFromFirebaseUrl from '@/firebase/getFilePathFromFirebaseUrl';

const deleteFileFromFirebase = async (fileUrl: string) => {
  return new Promise<void>((resolve, reject) => {
    const storage = getStorage(app);
    const filename = getFilePathFromFirebaseUrl(fileUrl);
    const fileRef = ref(storage, filename);
    // Add 'allow delete;' to the Firebase Storage Rules
    deleteObject(fileRef)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default deleteFileFromFirebase;
