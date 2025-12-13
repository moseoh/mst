import fs from "fs-extra";

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
