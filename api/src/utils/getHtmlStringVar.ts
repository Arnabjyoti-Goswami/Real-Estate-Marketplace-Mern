import { join }  from 'path';
import { readFile } from 'fs/promises';

const getHtmlStringVar = async () => {
  const scriptDir = __dirname;

  const filePath = join(scriptDir, '..', 'views', 'forgotPassword.html');

  try {
    const html = await readFile(filePath, 'utf8');
    return html;
  } catch (error) {
    console.log('Error reading HTML file: ', error);
  }
};

export default getHtmlStringVar;