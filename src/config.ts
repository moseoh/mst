import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ASSETS_DIR = path.join(__dirname, "..", "assets");
export const HOME_DIR = process.env.HOME || process.env.USERPROFILE || "";

export interface ShellRcResult {
  path: string | null;
  name: string | null;
  error: string | null;
}

export async function getShellRcPath(): Promise<ShellRcResult> {
  const zshrc = path.join(HOME_DIR, ".zshrc");
  const bashrc = path.join(HOME_DIR, ".bashrc");

  if (await fs.pathExists(zshrc)) {
    return { path: zshrc, name: ".zshrc", error: null };
  }

  if (await fs.pathExists(bashrc)) {
    return { path: bashrc, name: ".bashrc", error: null };
  }

  return {
    path: null,
    name: null,
    error: "no shell rc file found (.zshrc or .bashrc)",
  };
}
