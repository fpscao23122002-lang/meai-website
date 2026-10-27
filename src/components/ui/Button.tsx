import { Link } from "@/components/ui/Link";
import { buttonClass, type Size, type Variant } from "./buttonClass";

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  download?: boolean;
  external?: boolean;
};

export function ButtonLink({ href, variant, size, className, children, download, external }: ButtonLinkProps) {
  const cls = buttonClass(variant, size, className);
  if (download || external) {
    return (
      <a
        href={href}
        className={cls}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
