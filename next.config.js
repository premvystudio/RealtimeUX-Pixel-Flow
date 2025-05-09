/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  typescript: {
    // ⚠️ This should be removed once the AnyCable integration issues are fixed
    ignoreBuildErrors: true,
  },
  // ⚠️ This should be enabled for production builds once issues are fixed
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Optimize package imports for authentication libraries
    optimizePackageImports: ['@clerk/nextjs'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
      },
    ],
  },
  // Server Actions are enabled in Next.js 14
};

module.exports = nextConfig;
