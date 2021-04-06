const { i18n } = require('./next-i18next.config');
const imageDomains = process.env.NEXT_PUBLIC_IMAGE_HOSTNAME.split(" ");

module.exports = {
  i18n,
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    domains: imageDomains,
    path: '/_next/image',
    loader: 'default',
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    API_URL: process.env.NEXT_PUBLIC_BACKEND_URL
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    API_URL: process.env.NEXT_PUBLIC_API_URL
  },
}
