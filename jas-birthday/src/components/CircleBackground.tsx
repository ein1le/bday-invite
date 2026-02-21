import type { ReactNode } from "react";

type CircleBackgroundProps = {
  children: ReactNode;
};

export function CircleBackground({ children }: CircleBackgroundProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[72rem] w-[72rem] rounded-full bg-[#ffc2ca]" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  );
}

