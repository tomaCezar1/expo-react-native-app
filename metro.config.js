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
  '@/assets': path.resolve(__dirname, 'assets'),
  '@/global.css': path.resolve(__dirname, 'global.css'),
};

module.exports = withNativewind(config);
