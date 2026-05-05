/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  outputFileTracingRoot: __dirname,
  basePath: "/infomap",
  trailingSlash: true,
  images: {
    domains: ["mapequation.org"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
