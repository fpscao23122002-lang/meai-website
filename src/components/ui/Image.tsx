import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Ảnh phủ kín khung cha (cha cần `relative`) */
  fill?: boolean;
  /** Ảnh quan trọng phía trên màn hình đầu: tải ngay, ưu tiên cao */
  priority?: boolean;
};

export function Image({ src, alt, width, height, fill, priority, className, ...rest }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      {...rest}
    />
  );
}

export default Image;
