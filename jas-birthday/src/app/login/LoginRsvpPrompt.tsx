"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { subtleFade } from "@/lib/animations";

export default function LoginRsvpPrompt() {
  const router = useRouter();
  const [status, setStatus] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(isAttending: boolean) {
    if (isSubmitting) return;
    setStatus(isAttending);
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAttending }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to save your answer.");
        setIsSubmitting(false);
        return;
      }

      const data = (await response.json()) as { nextPath?: string };
      const nextPath =
        data.nextPath && data.nextPath.startsWith("/")
          ? data.nextPath
          : isAttending
          ? "/attending"
          : "/not-attending";

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  const yesSelected = status === true;
  const noSelected = status === false;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <motion.button
          type="button"
          onClick={() => handleSelect(true)}
          className={`flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium shadow-sm transition ${
            yesSelected
              ? "border-emerald-500 bg-emerald-50 text-emerald-900"
              : "border-slate-200 bg-white text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/60"
          } ${isSubmitting ? "cursor-wait opacity-70" : ""}`}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          Yes
        </motion.button>

        <motion.button
          type="button"
          onClick={() => handleSelect(false)}
          className={`flex h-12 items-center justify-center rounded-full border px-4 text-sm font-medium shadow-sm transition ${
            noSelected
              ? "border-slate-500 bg-slate-100 text-slate-900"
              : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50"
          } ${isSubmitting ? "cursor-wait opacity-70" : ""}`}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          No
        </motion.button>
      </div>

      {error && (
        <motion.p
          {...subtleFade}
          className="text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

