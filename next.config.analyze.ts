const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
import nextConfig from './next.config';

export default withBundleAnalyzer(nextConfig);
