/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle for a tiny production Docker image.
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
