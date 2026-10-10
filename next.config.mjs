/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  allowedDevOrigins: [
    '*.run.app',
    'ais-dev-aimx3sitrt7tqknmhljyor-788342168513.asia-southeast1.run.app',
    'ais-pre-aimx3sitrt7tqknmhljyor-788342168513.asia-southeast1.run.app',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
};

export default nextConfig;

