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
}
