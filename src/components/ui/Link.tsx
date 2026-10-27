import type { AnchorHTMLAttributes } from "react";
import { Link as RouterLink } from "react-router-dom";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Link nội bộ dùng React Router; link ngoài (http, mailto, tel) dùng thẻ <a> thường */
export function Link({ href, children, ...rest }: LinkProps) {
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  );
}

export default Link;
