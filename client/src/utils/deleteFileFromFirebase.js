import { getStorage, ref, deleteObject } from 'firebase/storage';
import { app } from '../firebase.js';
import getFilePathFromFirebaseUrl from './getFilePathFromFirebaseUrl.js';

const deleteFileFromFirebase = async (fileUrl) => {
  return new Promise((resolve, reject) => {
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