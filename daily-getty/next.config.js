/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
      protocol: 'https',
      hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      port: '',
      pathname: '/private/**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/homefeed',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
