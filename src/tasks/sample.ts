import pc from "picocolors";
import type { Task, TaskResult } from "../types.js";

interface SampleResult extends TaskResult {
  items: number;
}

export const sample1Task: Task = {
  name: "Sample1",
  description: "1초 대기 샘플",

  async run(): Promise<SampleResult> {
    await new Promise((r) => setTimeout(r, 500));
    return { items: 5, errors: 0 };
  },

  formatResult(result: TaskResult): string {
    const r = result as SampleResult;
    if (r.errors > 0) {
      return pc.red(`(${r.errors} errors)`);
    }
    return pc.dim(`(${r.items} installed)`);
  },
};

export const sample2Task: Task = {
  name: "Sample2",
  description: "1초 대기 샘플",

  async run(): Promise<SampleResult> {
    await new Promise((r) => setTimeout(r, 500));
    return { items: 3, errors: 0 };
  },

  formatResult(result: TaskResult): string {
    const r = result as SampleResult;
    if (r.errors > 0) {
      return pc.red(`(${r.errors} errors)`);
    }
    return pc.dim(`(${r.items} configured)`);
  },
};
