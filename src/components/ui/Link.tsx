import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { startProgrammaticScroll } from "@/lib/scrollState";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Cuộn mượt tới section theo id (bù chiều cao thanh menu) */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  startProgrammaticScroll(id);
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/**
 * Link nội bộ dùng React Router; link ngoài (http, mailto, tel) dùng thẻ <a> thường.
 * Link tới section (#id hoặc /#id) trên cùng trang luôn cuộn tới nơi, kể cả khi URL đã có sẵn #id đó.
 */
export function Link({ href, children, onClick, ...rest }: LinkProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    // Link web bên ngoài (VD: Telegram hỗ trợ) mở tab mới để không rời khỏi site
    const external = /^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
      <a href={href} onClick={onClick} {...external} {...rest}>
        {children}
      </a>
    );
  }

  const hashMatch = href.match(/^(\/?[^#]*)#(.+)$/);
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !hashMatch || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const targetPath = hashMatch[1] || pathname;
    if (targetPath !== pathname) return; // khác trang: để router chuyển trang, ScrollManager cuộn sau
    e.preventDefault();
    const id = hashMatch[2];
    // state.internal: báo ScrollManager không cuộn lần nữa (Link đã tự cuộn)
    if (`#${id}` !== window.location.hash) navigate({ pathname, hash: id }, { preventScrollReset: true, state: { internal: true } });
    scrollToId(id);
  };

  return (
    <RouterLink to={href} onClick={handle} {...rest}>
      {children}
    </RouterLink>
  );
}

export default Link;
