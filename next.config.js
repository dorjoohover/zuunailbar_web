/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API: "http://localhost:5000/api/v1/",
  },
  images: {
    remotePatterns: [
      new URL("https://s3.qpay.mn/**"),
      new URL("https://qpay.mn/**"),
    ],
  },
};

module.exports = nextConfig;
