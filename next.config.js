/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Headers pentru controlul cache-ului
  async headers() {
    return [
      {
        // Pagina principală - fără cache
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        // Toate paginile - fără cache
        source: '/:path((?!_next|fonts|favicon).*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        // CSS și media - cache lung (au hash)
        source: '/_next/static/css/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // JS chunks - cache scurt
        source: '/_next/static/chunks/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
}

module.exports = nextConfig
