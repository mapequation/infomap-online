const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "/infomap",
  output: "export",
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ["mapequation.org"],
  },
  ...(!isProduction && {
    async redirects() {
      return [
        {
          source: "/",
          destination: "/infomap",
          permanent: false,
          basePath: false,
        },
      ];
    },
  }),
};

module.exports = nextConfig;
