/** @type {import('next').NextConfig} */
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3001";

const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
