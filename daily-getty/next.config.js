/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: {
    source: '/',
    destination: '/homefeed',
    permanent: true,
  }
}

module.exports = nextConfig
