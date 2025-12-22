#!/usr/bin/env node

import ora from "ora";
import pc from "picocolors";
import pkg from "../package.json" with { type: "json" };
import { justTasks } from "./tasks/just.js";
import { claudeTasks } from "./tasks/claude.js";
import type { Task } from "./tasks/types.js";

const { version: VERSION } = pkg;

const tasks: Task[] = [...justTasks, ...claudeTasks];

function showHelp(): void {
  console.log(`
  ${pc.bold("MST")} ${pc.dim(`v${VERSION}`)} - Moseoh Setup Tool

  ${pc.dim("Usage:")}
    mst install, i

  ${pc.dim("Options:")}
    -v, --version   Show version
    -h, --help      Show this help message
`);
}

async function runInstall(): Promise<void> {
  console.clear();
  console.log(`\n${pc.bold("MST")} ${pc.dim(`v${VERSION}`)}\n`);
  console.log(`Tasks...`);

  for (const task of tasks) {
    const spinner = ora({ text: task.name, prefixText: " " }).start();
    const result = await task.run();
    const symbol = result.errors > 0 ? pc.red("✖") : pc.green("✔");
    const text = `${task.name} ${task.formatResult(result)}`;

    spinner.stopAndPersist({ symbol, text, prefixText: " " });
  }

  console.log(`\n${pc.green(`${tasks.length} tasks completed`)}\n`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (args.includes("-v") || args.includes("--version")) {
    console.log(VERSION);
    process.exit(0);
  }

  if (args.includes("-h") || args.includes("--help")) {
    showHelp();
    process.exit(0);
  }

  if (command === "install" || command === "i") {
    await runInstall();
  } else if (command) {
    console.log(pc.red(`Unknown command: ${command}`));
    showHelp();
    process.exit(1);
  } else {
    showHelp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
