"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { subtleFade } from "@/lib/animations";

type LoginFormProps = {
  guests: {
    username: string;
    displayName: string;
  }[];
  onSuccess?: () => void;
};

export default function LoginForm({ guests, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(
    guests[0]?.username ?? ""
  );
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = searchParams.get("from");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Invalid name or password.");
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        const target = from && from.startsWith("/") ? from : "/rsvp";
        router.push(target);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label
          htmlFor="guest"
          className="block text-sm font-medium text-slate-700"
        >
          Your name
        </label>
        <select
          id="guest"
          className="block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        >
          {guests.map((guest) => (
            <option key={guest.username} value={guest.username}>
              {guest.displayName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className="block w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting || !username || !password}
        className="flex w-full items-center justify-center rounded-full bg-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
      >
        {isSubmitting ? "Signing in..." : "Continue"}
      </motion.button>

      {error && (
        <motion.p
          {...subtleFade}
          className="text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </form>
  );
}
