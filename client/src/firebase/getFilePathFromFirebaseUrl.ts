const getFilePathFromFirebaseUrl = (url: string) => {
  const baseUrl =
    'https://firebasestorage.googleapis.com/v0/b/mern-estate-70c92.appspot.com/o/';
  const imageSpecificUrl = url.replace(baseUrl, '');

  const decodedPath = decodeURIComponent(imageSpecificUrl);

  return decodedPath;
};

export default getFilePathFromFirebaseUrl;
