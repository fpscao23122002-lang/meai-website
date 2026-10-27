import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

const DEFAULT_TITLE = "MeAI Studio - Xưởng Sản Xuất Video AI & Tự Động Hóa Reels Đa Tài Khoản";

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** Cập nhật title, description, canonical và robots cho từng trang (SPA) */
export function usePageMeta({
  title,
  description = siteConfig.description,
  path = "/",
  noindex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | MeAI Studio` : DEFAULT_TITLE;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", `${siteConfig.url}${path}`);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, follow" : "index, follow");
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `${siteConfig.url}${path}`;
  }, [title, description, path, noindex]);
}
