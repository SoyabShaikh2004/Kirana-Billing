/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds to prevent build failures
    ignoreDuringBuilds: true,
  }
};

export default nextConfig; 