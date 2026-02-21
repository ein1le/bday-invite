import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type BannerPageProps = {
  banner: StaticImageData;
  alt: string;
  children?: ReactNode;
  closeHref: string;
};

export function BannerPage({
  banner,
  alt,
  children,
  closeHref,
}: BannerPageProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[72rem] w-[72rem] rounded-full bg-[#ffb3c3]" />
      </div>
      <div className="relative flex w-full max-w-sm flex-1 flex-col space-y-6">
        <Link
          href={closeHref}
          aria-label="Close"
          className="absolute right-0 top-0 z-10 text-sm font-semibold"
        >
          ×
        </Link>
        <div className="relative mt-4 flex w-full justify-center">
          <Image
            src={banner}
            alt={alt}
            className="w-full rounded-3xl object-cover"
            priority
          />
        </div>
        {children ? <div className="flex-1 min-h-0">{children}</div> : null}
      </div>
    </div>
  );
}
