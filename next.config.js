/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "assets.coincap.io",
      "assets.coingecko.com",
      "coin-images.coingecko.com",
      "cryptologos.cc",
      "raw.githubusercontent.com",
      "cryptocoins-icons.github.io",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle undici package for server-side fetch
      config.externals.push({
        undici: "undici",
      });
    }

    // Add support for private class fields syntax
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["undici"],
  },
};

module.exports = nextConfig;
