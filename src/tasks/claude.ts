import path from "path";
import pc from "picocolors";
import { ASSETS_DIR, HOME_DIR } from "../lib/paths.js";
import { linkFolder, type LinkResult } from "../lib/symlink.js";
import { setupAlias, type AliasResult } from "../lib/alias.js";
import type { Task, TaskResult } from "./types.js";

const SRC_DIR = path.join(ASSETS_DIR, "claude");
const DEST_DIR = path.join(HOME_DIR, ".claude");

const ALIAS_CONTENT = `# claude alias (added by mst)
alias cc='claude --dangerously-skip-permissions'`;

// Plugin Link Task
const claudePluginLinkTask: Task = {
  name: "link claude plugin",
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
const claudeAliasTask: Task = {
  name: "setup claude alias",
  description: "~/.zshrc or ~/.bashrc",

  async run(): Promise<AliasResult> {
    return setupAlias({ content: ALIAS_CONTENT });
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

export const claudeTasks = [claudePluginLinkTask, claudeAliasTask];
