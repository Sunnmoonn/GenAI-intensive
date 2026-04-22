import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Playwright must not be bundled — keep it as a Node.js native import
  serverExternalPackages: ['playwright', 'playwright-core'],
};

export default nextConfig;
