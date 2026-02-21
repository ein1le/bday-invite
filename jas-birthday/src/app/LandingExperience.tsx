"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import envelope from "@/Birthday Assets/envelope.png";
import pageRsvp from "@/Birthday Assets/page-rsvp.png";
import LoginForm from "@/app/login/LoginForm";

type LandingExperienceProps = {
  guests: {
    username: string;
    displayName: string;
  }[];
};

export default function LandingExperience({ guests }: LandingExperienceProps) {
  const [stage, setStage] = useState<"envelope" | "card" | "login">("envelope");

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
      {/* Expanding pink circle */}
      <motion.div
        className="absolute h-48 w-48 rounded-full bg-rose-300/70"
        initial={{ scale: 0.9, opacity: 1 }}
        animate={
          stage === "envelope"
            ? { scale: 1, opacity: 1, transition: { duration: 0.4 } }
            : { scale: 6, opacity: 0.35, transition: { duration: 0.6 } }
        }
      />

      {/* Stage 1: Envelope in the center */}
      {stage === "envelope" && (
        <>
          <motion.button
            type="button"
            onClick={() => setStage("card")}
            className="relative flex items-center justify-center outline-none"
            initial={{ opacity: 0, scale: 0.8, y: 24 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.5 },
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Open your invitation"
          >
            <Image
              src={envelope}
              alt="Invitation envelope"
              className="relative z-10 h-40 w-40 object-contain"
              priority
            />
          </motion.button>

          <motion.p
            className="absolute bottom-8 text-xs font-medium uppercase tracking-[0.2em] text-slate-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, delay: 0.1 },
            }}
          >
            Tap to open your invite
          </motion.p>
        </>
      )}

      {/* Stage 2: RSVP card only, centered; tap to continue */}
      {stage === "card" && (
        <motion.button
          type="button"
          onClick={() => setStage("login")}
          className="relative flex items-center justify-center outline-none"
          initial={{ opacity: 0, y: 160 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Continue to login"
        >
          <Image
            src={pageRsvp}
            alt="RSVP preview"
            className="h-80 w-auto rounded-2xl object-cover shadow-lg"
          />
        </motion.button>
      )}

      {/* Stage 3: Login form only */}
      {stage === "login" && (
        <motion.div
          className="w-full max-w-sm rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
          }}
        >
          <LoginForm guests={guests} />
        </motion.div>
      )}
    </div>
  );
}
