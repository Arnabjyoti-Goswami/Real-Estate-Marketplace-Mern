const getFilePathFromFirebaseUrl = (url) => {
  const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/mern-estate-70c92.appspot.com/o/';
  const imageSpecificUrl = url.replace(baseUrl, '');
  const indexOfEndPath = imageSpecificUrl.indexOf('?');
  let imagePath = imageSpecificUrl.substring(0, indexOfEndPath);

  // for spaces in the filename
  while (imagePath.includes('%20')) {
    imagePath = imagePath.replace('%20', ' ');
  }
  
  // for the hour:minute:second in the filename end
  while (imagePath.includes('%3A')) {
    imagePath = imagePath.replace('%3A', ':')
  }

  // for commas in the filename
  while (imagePath.includes('%2C')) {
    imagePath = imagePath.replace('%2C', ',')
  }

  return imagePath;
};

export default getFilePathFromFirebaseUrl;