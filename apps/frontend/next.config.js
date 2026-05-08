/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from CloudFront for film thumbnails when we add them
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },
};

module.exports = nextConfig;
