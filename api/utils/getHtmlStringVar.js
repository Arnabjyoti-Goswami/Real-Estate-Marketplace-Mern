import { join, dirname }  from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const getHtmlStringVar = async () => {
  const scriptName = fileURLToPath(import.meta.url);
  const scriptDir = dirname(scriptName);

  const filePath = join(scriptDir, '..', 'views', 'forgotPassword.html');

  try {
    const html = await readFile(filePath, 'utf8');
    return html;
  } catch (error) {
    console.log('Error reading HTML file: ', error);
  }
};

export default getHtmlStringVar;