import fs from "node:fs";
import path from "node:path";
import type { ComplexConfig } from "./types";

const CONFIG_PATH = path.join(process.cwd(), "config", "complexes.json");

export function loadComplexes(): ComplexConfig[] {
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(raw) as ComplexConfig[];
}

export function getComplex(id: string): ComplexConfig | undefined {
  return loadComplexes().find((c) => c.id === id);
}
