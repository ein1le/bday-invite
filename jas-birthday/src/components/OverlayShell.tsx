"use client";

import type { ReactNode } from "react";

type OverlayShellProps = {
  children: ReactNode;
  onClose: () => void;
};

export function OverlayShell({ children, onClose }: OverlayShellProps) {
  return (
    <div className="relative w-full max-w-sm rounded-[2rem] bg-[#ffb7c7] px-4 py-5">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close overlay"
        className="absolute right-4 top-4 text-4xl font-extrabold leading-none"
      >
        ×
      </button>
      <div className="mt-6">{children}</div>
    </div>
  );
}
