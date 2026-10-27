import { Link } from "@/components/ui/Link";
import { buttonClass, type Size, type Variant } from "./buttonClass";
import { Magnetic } from "@/components/fx/Magnetic";

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
  const full = className?.includes("w-full");
  const wrap = (el: React.ReactNode) =>
    variant === "ghost" ? el : <Magnetic className={full ? "w-full sm:w-auto" : undefined}>{el}</Magnetic>;
  if (download || external) {
    return wrap(
      <a
        href={href}
        className={cls}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>,
    );
  }
  return wrap(
    <Link href={href} className={cls}>
      {children}
    </Link>,
  );
}
