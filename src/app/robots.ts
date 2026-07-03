import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/courses", "/tasks", "/settings"],
    },
    sitemap: "https://academia.vercel.app/sitemap.xml",
  };
}
