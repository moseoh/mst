import fs from "fs-extra";
import path from "path";
import { HOME_DIR } from "./paths.js";

export interface AliasResult {
  errors: number;
  added: boolean;
  file: string | null;
  error: string | null;
}

export interface AliasConfig {
  content: string;
}

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

export type AppendResult = "success" | "skip" | "error";

export async function appendIfMissing(
  filePath: string,
  content: string
): Promise<AppendResult> {
  try {
    const exists = await fs.pathExists(filePath);
    if (!exists) {
      await fs.writeFile(filePath, content + "\n");
      return "success";
    }

    const fileContent = await fs.readFile(filePath, "utf-8");
    if (fileContent.includes(content.trim())) {
      return "skip";
    }

    await fs.appendFile(filePath, "\n" + content + "\n");
    return "success";
  } catch {
    return "error";
  }
}

export async function setupAlias(config: AliasConfig): Promise<AliasResult> {
  const shellRc = await getShellRcPath();

  if (shellRc.error) {
    return {
      errors: 1,
      added: false,
      file: null,
      error: shellRc.error,
    };
  }

  const result = await appendIfMissing(shellRc.path!, config.content);

  return {
    errors: result === "error" ? 1 : 0,
    added: result === "success",
    file: shellRc.name,
    error: result === "error" ? "failed to write" : null,
  };
}
