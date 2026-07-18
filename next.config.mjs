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

// Copy user uploaded terms-conditions banner
const sourceImg = 'C:\\Users\\Rashi\\.gemini\\antigravity\\brain\\116ff34c-fff7-458e-bb9b-46fb0f063121\\media__1783335779109.png';
const destImg = path.join(__dirname, 'public', 'terms-conditions.png');
if (fs.existsSync(sourceImg)) {
  try {
    fs.copyFileSync(sourceImg, destImg);
    console.log('Successfully copied terms-conditions.png banner to public folder.');
  } catch (err) {
    console.error('Error copying terms-conditions banner:', err);
  }
}

// Copy shipping-delivery banner
const shippingSourceImg = 'C:\\Users\\Rashi\\.gemini\\antigravity\\brain\\116ff34c-fff7-458e-bb9b-46fb0f063121\\media__1783336204972.png';
const shippingDestImg = path.join(__dirname, 'public', 'shipping-delivery.png');
if (fs.existsSync(shippingSourceImg)) {
  try {
    fs.copyFileSync(shippingSourceImg, shippingDestImg);
    console.log('Successfully copied shipping-delivery.png banner to public folder.');
  } catch (err) {
    console.error('Error copying shipping-delivery banner:', err);
  }
}

// Copy exchange-policy banner
const exchangeSourceImg = 'C:\\Users\\Rashi\\.gemini\\antigravity\\brain\\116ff34c-fff7-458e-bb9b-46fb0f063121\\media__1783336819576.png';
const exchangeDestImg = path.join(__dirname, 'public', 'exchange-policy.png');
if (fs.existsSync(exchangeSourceImg)) {
  try {
    fs.copyFileSync(exchangeSourceImg, exchangeDestImg);
    console.log('Successfully copied exchange-policy.png banner to public folder.');
  } catch (err) {
    console.error('Error copying exchange-policy banner:', err);
  }
}

// Copy footer logo
const logoSource = 'C:\\Users\\Rashi\\.gemini\\antigravity\\brain\\116ff34c-fff7-458e-bb9b-46fb0f063121\\media__1783337811308.jpg';
const logoDest = path.join(__dirname, 'public', 'logo.jpg');
if (fs.existsSync(logoSource)) {
  try {
    fs.copyFileSync(logoSource, logoDest);
    console.log('Successfully copied logo.jpg to public folder.');
  } catch (err) {
    console.error('Error copying logo:', err);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
