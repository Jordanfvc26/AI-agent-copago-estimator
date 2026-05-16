import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sql.js", "sqlite3", "sqlite"],
};

export default nextConfig;
