import { mkdir, copyFile } from 'fs/promises';
import { join, dirname }  from 'path';
import { fileURLToPath } from 'url';

const scriptName = fileURLToPath(import.meta.url);
const scriptDir = dirname(scriptName);
const rootDir = join(scriptDir, '..', '..');

const sourcePath = join(rootDir, 'react-email-dev', 'html_emails', 'forgotPassword.html');
const destinationPath = join(rootDir, 'api', 'views', 'forgotPassword.html');

const copyFileToDestination = async (sourcePath, destinationPath) => {
  try {
    // Create the destination directory if it doesn't exist
    const destinationDir = dirname(destinationPath);
    await mkdir(destinationDir, { recursive: true });
    
    await copyFile(sourcePath, destinationPath);
    console.log('File copied successfully!');

  } catch (error) {
    console.log('Error copying file:', error);
  }
}

copyFileToDestination(sourcePath, destinationPath);