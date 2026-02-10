"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp } from "@/lib/animations";

export function Hero() {
  return (
    <div className="flex flex-col items-center gap-10 text-center sm:gap-12">
      <motion.div
        {...fadeInUp}
        className="inline-flex items-center gap-2 rounded-full bg-pink-100/80 px-4 py-1 text-xs font-medium text-pink-800"
      >
        <span className="h-2 w-2 rounded-full bg-pink-500" />
        You&apos;re invited
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.05 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Jas&apos;s Birthday Celebration
        </h1>
        <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
          Join us for an evening of good vibes, great music, and the people who
          matter most. Let us know if you can make it.
        </p>
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        className="grid w-full gap-3 text-sm text-slate-600 sm:grid-cols-3"
      >
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            When
          </div>
          <div className="mt-1 font-medium text-slate-900">
            Saturday · 7:00 PM
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Where
          </div>
          <div className="mt-1 font-medium text-slate-900">
            Details in your invite
          </div>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Dress code
          </div>
          <div className="mt-1 font-medium text-slate-900">Soft party</div>
        </div>
      </motion.div>

      <motion.div
        {...fadeInUp}
        transition={{ ...fadeInUp.transition, delay: 0.15 }}
        className="flex flex-col items-center gap-3 sm:flex-row"
      >
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-md transition-colors hover:bg-slate-800"
        >
          Open your invite
        </Link>
        <p className="text-xs text-slate-500">
          It only takes a few seconds to RSVP.
        </p>
      </motion.div>
    </div>
  );
}

