"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { subtleFade } from "@/lib/animations";

type ConfirmRsvpChangeProps = {
  isAttending: boolean;
  confirmLabel: string;
  cancelLabel?: string;
  cancelHref: string;
  onCancel?: () => void;
};

export function ConfirmRsvpChange({
  isAttending,
  confirmLabel,
  cancelLabel = "Keep my current answer",
  cancelHref,
  onCancel,
}: ConfirmRsvpChangeProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAttending }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Unable to update your RSVP.");
        setIsSubmitting(false);
        return;
      }

      const data = (await response.json()) as {
        nextPath?: string;
      };

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

  function handleCancel() {
    if (isSubmitting) return;
    if (onCancel) {
      onCancel();
    } else {
      router.push(cancelHref);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="btn-pink flex-1 disabled:opacity-70"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        >
          {confirmLabel}
        </motion.button>

        <motion.button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-full border border-current bg-transparent px-4 py-2.5 text-sm font-medium disabled:opacity-70"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        >
          {cancelLabel}
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
