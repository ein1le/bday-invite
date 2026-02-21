// node scripts\seed-products.mjs
// seeds data/products.csv into products table

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

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

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current);
  return result.map((part) => part.trim());
}

async function main() {
  await loadEnvLocal();

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (in .env.local or environment) to seed products."
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const csvPath = path.join(__dirname, "..", "data", "products.csv");
  const raw = await fs.readFile(csvPath, "utf8");

  const lines = raw.trim().split(/\r?\n/);
  if (lines.length <= 1) {
    console.error("products.csv appears to be empty or missing rows.");
    process.exit(1);
  }

  const header = parseCsvLine(lines[0]);
  const idIndex = header.indexOf("id");
  const nameIndex = header.indexOf("name");
  const imageIndex = header.indexOf("image_url");
  const descriptionIndex = header.indexOf("description");
  const linkIndex = header.indexOf("link");
  const priceIndex = header.indexOf("price");

  if (
    idIndex === -1 ||
    nameIndex === -1 ||
    imageIndex === -1 ||
    descriptionIndex === -1 ||
    linkIndex === -1 ||
    priceIndex === -1
  ) {
    console.error(
      "products.csv header must include id,name,image_url,description,price."
    );
    process.exit(1);
  }

  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCsvLine(line);
    const id = cols[idIndex];
    const name = cols[nameIndex];
    const imageUrl = cols[imageIndex] || null;
    const description = cols[descriptionIndex] || null;
    const link = cols[linkIndex] || null;
    const priceRaw = cols[priceIndex] || "";

    if (!id || !name) continue;

    let price = 0;
    if (priceRaw) {
      const numeric = priceRaw.replace(/[^0-9.]/g, "");
      if (numeric) {
        const parsed = Number.parseFloat(numeric);
        if (!Number.isNaN(parsed)) {
          price = parsed;
        }
      }
    }

    rows.push({ id, name, imageUrl, description, link, price });
  }

  if (!rows.length) {
    console.error("No valid product rows found in products.csv.");
    process.exit(1);
  }

  console.log(`Seeding ${rows.length} products into Supabase...`);

  for (const row of rows) {
    const { error } = await supabase
      .from("products")
      .upsert(
        {
          id: row.id,
          name: row.name,
          image_url: row.imageUrl,
          description: row.description,
          link: row.link,
          price: row.price,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error(`Failed to seed product "${row.name}":`, error.message);
      process.exitCode = 1;
    } else {
      console.log(`Seeded/updated product: ${row.name}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
