import type { MouseEventHandler, ReactNode } from "react";

type TextCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export function TextCard({ children, className, onClick }: TextCardProps) {
  const base =
    "relative w-full rounded-3xl bg-white px-8 py-6 shadow-[0_24px_45px_rgba(15,23,42,0.15)]";

  const classes = className ? `${base} ${className}` : base;

  return (
    <div
      className={classes}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
