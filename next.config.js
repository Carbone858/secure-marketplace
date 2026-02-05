// next.config.js
const withNextIntl = require('next-intl/plugin')('./src/i18n.ts');

module.exports = withNextIntl({
  // Optional: Configure locale handling here if middleware fails
});
