import path from "path";
import pc from "picocolors";
import { ASSETS_DIR, HOME_DIR, getShellRcPath } from "../config.js";
import {
  linkFiles,
  linkFolder,
  appendIfMissing,
  type LinkResult,
} from "../utils/index.js";
import type { Task, TaskResult } from "../types.js";

const SRC_DIR = path.join(ASSETS_DIR, "claude");
const DEST_DIR = path.join(HOME_DIR, ".claude");

const ALIAS_CONTENT = `# claude alias (added by mst)
alias cc='claude --dangerously-skip-permissions'`;

// Files Link Task
const claudeFileLinkTask: Task = {
  name: "link claude files",
  description: "~/.claude (files)",

  async run(): Promise<LinkResult> {
    return linkFiles({
      srcDir: path.join(SRC_DIR, "commands"),
      destDir: path.join(DEST_DIR, "commands"),
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

// Folder Link Task
const claudeFolderLinkTask: Task = {
  name: "link claude plugins",
  description: "~/.claude/plugins",

  async run(): Promise<LinkResult> {
    return linkFolder({
      src: path.join(SRC_DIR, "plugins/marketplaces/moseoh-marketplaces"),
      dest: path.join(DEST_DIR, "plugins/marketplaces/moseoh-marketplaces"),
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

const claudeAliasTask: Task = {
  name: "setup claude alias",
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

export const claudeTasks = [
  claudeFileLinkTask,
  claudeFolderLinkTask,
  claudeAliasTask,
];
