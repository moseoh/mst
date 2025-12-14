import { describe, it, expect, beforeEach, vi } from "vitest";
import { vol } from "memfs";
import { linkFolder, type FolderLinkConfig } from "./symlink.js";

vi.mock("fs-extra", async () => {
  const memfs = await import("memfs");
  return {
    default: {
      ...memfs.fs.promises,
      pathExists: async (p: string) => {
        try {
          await memfs.fs.promises.access(p);
          return true;
        } catch {
          return false;
        }
      },
      ensureDir: async (p: string) => {
        await memfs.fs.promises.mkdir(p, { recursive: true });
      },
      ensureSymlink: async (src: string, dest: string) => {
        await memfs.fs.promises.symlink(src, dest);
      },
      lstat: memfs.fs.promises.lstat,
      readlink: memfs.fs.promises.readlink,
      readdir: memfs.fs.promises.readdir,
      stat: memfs.fs.promises.stat,
    },
  };
});

describe("linkFolder", () => {
  beforeEach(() => {
    vol.reset();
  });

  describe("srcDir이 존재하지 않을 때", () => {
    it("errors를 1 증가시키고 반환해야 한다", async () => {
      vol.fromJSON({});

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/nonexistent",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.errors).toBe(1);
      expect(result.success).toBe(0);
      expect(result.skipped).toBe(0);
    });
  });

  describe("단일 파일 링크", () => {
    it("파일을 심볼릭 링크로 생성해야 한다", async () => {
      vol.fromJSON({
        "/src/file.txt": "content",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.success).toBe(1);
      expect(result.skipped).toBe(0);
      expect(result.errors).toBe(0);
    });
  });

  describe("여러 파일 링크", () => {
    it("모든 파일을 심볼릭 링크로 생성해야 한다", async () => {
      vol.fromJSON({
        "/src/file1.txt": "content1",
        "/src/file2.txt": "content2",
        "/src/file3.txt": "content3",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.success).toBe(3);
      expect(result.skipped).toBe(0);
      expect(result.errors).toBe(0);
    });
  });

  describe("중첩 디렉토리", () => {
    it("재귀적으로 심볼릭 링크를 생성해야 한다", async () => {
      vol.fromJSON({
        "/src/file1.txt": "content1",
        "/src/subdir/file2.txt": "content2",
        "/src/subdir/deep/file3.txt": "content3",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.success).toBe(3);
      expect(result.errors).toBe(0);
    });
  });

  describe("무시 파일 필터링", () => {
    it(".DS_Store 파일을 무시해야 한다", async () => {
      vol.fromJSON({
        "/src/file.txt": "content",
        "/src/.DS_Store": "ignore",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.success).toBe(1);
      expect(result.skipped).toBe(0);
    });

    it("Thumbs.db 파일을 무시해야 한다", async () => {
      vol.fromJSON({
        "/src/file.txt": "content",
        "/src/Thumbs.db": "ignore",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.success).toBe(1);
    });

    it(".gitkeep 파일을 무시해야 한다", async () => {
      vol.fromJSON({
        "/src/file.txt": "content",
        "/src/.gitkeep": "",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.success).toBe(1);
    });
  });

  describe("이미 존재하는 링크", () => {
    it("같은 대상의 심볼릭 링크가 있으면 skip해야 한다", async () => {
      vol.fromJSON({
        "/src/file.txt": "content",
      });
      // 먼저 디렉토리 생성
      vol.mkdirSync("/dest", { recursive: true });
      // 심볼릭 링크 생성
      vol.symlinkSync("/src/file.txt", "/dest/file.txt");

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.skipped).toBe(1);
      expect(result.success).toBe(0);
    });

    it("일반 파일이 이미 존재하면 skip해야 한다", async () => {
      vol.fromJSON({
        "/src/file.txt": "source content",
        "/dest/file.txt": "existing content",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      expect(result.skipped).toBe(1);
      expect(result.success).toBe(0);
    });
  });

  describe("빈 디렉토리", () => {
    it("빈 디렉토리는 결과에 영향을 주지 않아야 한다", async () => {
      vol.fromJSON({
        "/src/empty/.gitkeep": "",
      });

      const config: FolderLinkConfig = {
        name: "test",
        srcDir: "/src",
        destDir: "/dest",
      };

      const result = await linkFolder(config);

      // .gitkeep은 무시되므로 success는 0
      expect(result.success).toBe(0);
      expect(result.errors).toBe(0);
    });
  });
});
