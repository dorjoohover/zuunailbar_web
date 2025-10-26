/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [new URL('https://s3.qpay.mn/**'), new URL('https://qpay.mn/**')],
  },
};

module.exports = nextConfig;
