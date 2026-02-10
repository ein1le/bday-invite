"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25 }}
        className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fde7ff,_#f8fafc)] px-4 py-10 text-slate-900"
      >
        <div className="w-full max-w-xl rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-md">
          {children}
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
