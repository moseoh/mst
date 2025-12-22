import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ASSETS_DIR = path.join(__dirname, "..", "..", "assets");
export const HOME_DIR = process.env.HOME || process.env.USERPROFILE || "";
