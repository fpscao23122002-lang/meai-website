import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Chèn URL website vào index.html và sinh robots.txt + sitemap.xml lúc build */
function seoFiles(siteUrl: string): Plugin {
  const routes = ["/", "/docs", "/tai-ve", "/prompt-mau", "/dieu-khoan", "/bao-mat"];
  return {
    name: "meai-seo-files",
    transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /app/\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      const urls = routes
        .map(
          (r) =>
            `  <url><loc>${siteUrl}${r === "/" ? "" : r}</loc><changefreq>weekly</changefreq><priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`,
        )
        .join("\n");
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = (env.VITE_SITE_URL || "https://meai-website.pages.dev").replace(/\/$/, "");

  return {
    plugins: [react(), seoFiles(siteUrl)],
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
    build: {
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router", "react-router-dom"],
            motion: ["framer-motion"],
          },
        },
      },
    },
  };
});
