import type { ReactNode } from "react";

type CircleCardPageProps = {
  children: ReactNode;
  footer?: ReactNode;
  withCard?: boolean;
};

export function CircleCardPage({
  children,
  footer,
  withCard = true,
}: CircleCardPageProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[72rem] w-[72rem] rounded-full bg-[#ffc2ca]" />
      </div>
      {withCard ? (
        <div className="relative w-full max-w-md rounded-3xl bg-white px-8 py-6 shadow-[0_24px_45px_rgba(15,23,42,0.15)]">
          {children}
        </div>
      ) : (
        <div className="relative w-full max-w-md">{children}</div>
      )}
      {footer ? (
        <div className="relative mt-6 w-full max-w-md">{footer}</div>
      ) : null}
    </div>
  );
}
