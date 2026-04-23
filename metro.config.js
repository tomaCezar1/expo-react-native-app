const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

const path = require('path');
const config = getDefaultConfig(__dirname);

// Add alias for '@' to match tsconfig.json
config.resolver = config.resolver || {};
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@': path.resolve(__dirname, 'src'),
};

module.exports = withNativewind(config);
