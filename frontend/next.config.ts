/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // Allows auto-fetched course previews
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Allows fallback playlist graphic assets
      },
    ],
  },
};

module.exports = nextConfig;