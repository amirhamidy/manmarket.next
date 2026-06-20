/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.manmarket.ir",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/assets/PDF/:path*",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          { key: "Content-Disposition", value: "inline" },
        ],
      },
    ];
  },
};

export default nextConfig;
