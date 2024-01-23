import { mkdir, copyFile } from 'fs/promises';
import { join, dirname }  from 'path';

const scriptDir = __dirname;
const srcFolder = join(scriptDir, '..');
const apiFolder = join(srcFolder, '..');
const rootDir = join(apiFolder, '..');

const sourcePath = join(rootDir, 'react-email-dev', 'html_emails', 'forgotPassword.html');
const destinationPath = join(srcFolder, 'views', 'forgotPassword.html');

const copyFileToDestination = async (
  sourcePath: string, 
  destinationPath: string,
) => {
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