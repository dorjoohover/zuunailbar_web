/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    // admin/artist-тай ижил зарчим: build үеийн `API` env (docker-compose-ийн
    // build arg, эсвэл dev дээр `API=http://localhost:5050/api/v1/ npm run dev`)
    // -г уншина. Утга өгөөгүй бол production API руу fallback хийнэ.
    API: process.env.API || "https://api.zunailbar.mn/api/v1/",
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
