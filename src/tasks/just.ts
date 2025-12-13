import path from "path";
import pc from "picocolors";
import { ASSETS_DIR, HOME_DIR, getShellRcPath } from "../config.js";
import { linkFolder, appendIfMissing, type LinkResult } from "../utils/index.js";
import type { Task, TaskResult } from "../types.js";

const SRC_DIR = path.join(ASSETS_DIR, "just");
const DEST_DIR = path.join(HOME_DIR, ".config", "just");

const ALIAS_CONTENT = `# just alias (added by mst)
alias jg='just --justfile ~/.config/just/justfile --working-directory .'`;

// Link Task
const justLinkTask: Task = {
  name: "link justfile",
  description: "~/.config/just",

  async run(): Promise<LinkResult> {
    return linkFolder({
      name: this.name,
      srcDir: SRC_DIR,
      destDir: DEST_DIR,
    });
  },

  formatResult(result: TaskResult): string {
    const r = result as LinkResult;
    if (r.errors > 0) {
      return pc.red(`(${r.errors} errors)`);
    }
    return pc.dim(`(${r.success} linked, ${r.skipped} skipped)`);
  },
};

// Alias Task
interface AliasResult extends TaskResult {
  added: boolean;
  file: string | null;
  error: string | null;
}

const justAliasTask: Task = {
  name: "setup just alias",
  description: "~/.zshrc or ~/.bashrc",

  async run(): Promise<AliasResult> {
    const shellRc = await getShellRcPath();

    if (shellRc.error) {
      return {
        errors: 1,
        added: false,
        file: null,
        error: shellRc.error,
      };
    }

    const result = await appendIfMissing(shellRc.path!, ALIAS_CONTENT);

    return {
      errors: result === "error" ? 1 : 0,
      added: result === "success",
      file: shellRc.name,
      error: result === "error" ? "failed to write" : null,
    };
  },

  formatResult(result: TaskResult): string {
    const r = result as AliasResult;
    if (r.error) {
      return pc.red(`(${r.error})`);
    }
    if (r.added) {
      return pc.dim(`(added → ${r.file})`);
    }
    return pc.dim(`(skipped)`);
  },
};

export const justTasks = [justLinkTask, justAliasTask];
