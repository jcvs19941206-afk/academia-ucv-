import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default analyzer(withSentryConfig(nextConfig, {
  silent: true,
  org: "academia",
  project: "academia-app",
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
}));
