import fs from "fs-extra";
import path from "path";

const IGNORE_FILES = [".DS_Store", "Thumbs.db", ".gitkeep"];

export interface FilesLinkConfig {
  srcDir: string;
  destDir: string;
}

export interface FolderLinkConfig {
  src: string;
  dest: string;
}

export interface LinkResult {
  success: number;
  skipped: number;
  errors: number;
}

/**
 * 심볼릭 링크 생성
 */
async function createSymlink(
  srcPath: string,
  destPath: string
): Promise<"success" | "skip" | "error"> {
  try {
    let destExists = false;
    let isSymlink = false;
    let currentTarget = "";

    try {
      const lstat = await fs.lstat(destPath);
      destExists = true;
      isSymlink = lstat.isSymbolicLink();
      if (isSymlink) {
        currentTarget = await fs.readlink(destPath);
      }
    } catch {
      destExists = false;
    }

    if (destExists) {
      // 이미 같은 링크면 스킵
      if (isSymlink && currentTarget === srcPath) {
        return "skip";
      }
      // 다른 파일/링크가 있으면 스킵 (--force 옵션 추가 시 덮어쓰기)
      return "skip";
    }

    await fs.ensureSymlink(srcPath, destPath);
    return "success";
  } catch {
    return "error";
  }
}

async function linkFilesRecursive(
  srcDir: string,
  destDir: string,
  result: LinkResult
): Promise<void> {
  await fs.ensureDir(destDir);

  const items = await fs.readdir(srcDir);

  for (const item of items) {
    if (IGNORE_FILES.includes(item)) {
      continue;
    }

    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    const stat = await fs.stat(srcPath);

    if (stat.isDirectory()) {
      await linkFilesRecursive(srcPath, destPath, result);
    } else if (stat.isFile()) {
      const status = await createSymlink(srcPath, destPath);
      if (status === "success") result.success++;
      else if (status === "skip") result.skipped++;
      else result.errors++;
    }
  }
}

/**
 * 폴더 내 파일들을 재귀적으로 심볼릭 링크
 */
export async function linkFiles(config: FilesLinkConfig): Promise<LinkResult> {
  const result: LinkResult = { success: 0, skipped: 0, errors: 0 };

  if (!(await fs.pathExists(config.srcDir))) {
    result.errors++;
    return result;
  }

  await linkFilesRecursive(config.srcDir, config.destDir, result);
  return result;
}

/**
 * 폴더 자체를 심볼릭 링크
 */
export async function linkFolder(config: FolderLinkConfig): Promise<LinkResult> {
  const result: LinkResult = { success: 0, skipped: 0, errors: 0 };

  if (!(await fs.pathExists(config.src))) {
    result.errors++;
    return result;
  }

  await fs.ensureDir(path.dirname(config.dest));
  const status = await createSymlink(config.src, config.dest);

  if (status === "success") result.success++;
  else if (status === "skip") result.skipped++;
  else result.errors++;

  return result;
}
