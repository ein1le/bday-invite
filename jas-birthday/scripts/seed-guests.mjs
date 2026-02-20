// node scripts\seed-guests.mjs
// seeds csv into guests table


import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");

  try {
    const raw = await fs.readFile(envPath, "utf8");

    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local is optional for this script; we fall back to process.env.
  }
}

async function main() {
  await loadEnvLocal();

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (in .env.local or environment) to seed guests."
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const csvPath = path.join(__dirname, "..", "data", "guests.csv");
  const raw = await fs.readFile(csvPath, "utf8");

  const lines = raw.trim().split(/\r?\n/);
  if (lines.length <= 1) {
    console.error("guests.csv appears to be empty or missing rows.");
    process.exit(1);
  }

  // Expect header: id,username,password
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(",");
    if (parts.length < 3) continue;

    const username = parts[1]?.trim();
    const password = parts[2]?.trim();

    if (!username || !password) continue;

    rows.push({
      username,
      displayName: username,
      password,
    });
  }

  if (!rows.length) {
    console.error("No valid rows found in guests.csv.");
    process.exit(1);
  }

  console.log(`Seeding ${rows.length} guests into Supabase...`);

  for (const row of rows) {
    const passwordHash = await bcrypt.hash(row.password, 10);

    const { error } = await supabase
      .from("guests")
      .upsert(
        {
          username: row.username,
          display_name: row.displayName,
          password_hash: passwordHash,
        },
        { onConflict: "username" }
      );

    if (error) {
      console.error(`Failed to seed ${row.username}:`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`Seeded/updated guest: ${row.username}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

