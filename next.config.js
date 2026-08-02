/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API: "https://api.zunailbar.mn/api/v1/",
    // API: "http://localhost:5000/api/v1/",
  },
  images: {
    remotePatterns: [
      new URL("https://s3.qpay.mn/**"),
      {
        protocol: 'https',
        hostname: 'qpay.mn',
        pathname: '/q/logo/**',
      },
    ],
  },
};

module.exports = nextConfig;
