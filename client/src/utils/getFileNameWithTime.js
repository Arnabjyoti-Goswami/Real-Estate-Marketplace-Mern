const getFileAndExtension = (filename) => {
  const lastDotIndex = filename.lastIndexOf('.');
  let file = '';
  let extension = '';
  if (lastDotIndex !== -1) {
    file = filename.substring(0, lastDotIndex);
    extension = filename.substring(lastDotIndex + 1);
  } else {
    file = filename;
  }
  return { file, extension };
};

const getFileNameWithTime = (filename) => {
  const { file, extension } = getFileAndExtension(filename);

  const timestamp = new Date().getTime();
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const newFileName = file + ' ' + formattedDate + '.' + extension;

  return newFileName;
};

export default getFileNameWithTime;