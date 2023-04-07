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
      },
      {
        protocol: 'https',
        hostname: 'dailymuse.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**'
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          }
        ],
      },
    ]
  }
}

module.exports = nextConfig
