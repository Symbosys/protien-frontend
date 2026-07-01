import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Delete redundant src/app/favicon.ico if present to prevent Next.js compilation 500 error
const appFavicon = path.join(__dirname, 'src', 'app', 'favicon.ico');
if (fs.existsSync(appFavicon)) {
  try {
    fs.unlinkSync(appFavicon);
    console.log('Successfully deleted src/app/favicon.ico to prevent 500 compilation error.');
  } catch (err) {
    console.error('Error deleting duplicate favicon:', err);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
