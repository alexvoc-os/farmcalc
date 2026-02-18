/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Headers pentru controlul cache-ului
  async headers() {
    return [
      {
        // Pentru pagini HTML - nu cache-ui agresiv
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Pentru fișierele statice cu hash - cache lung
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
