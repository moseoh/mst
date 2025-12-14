import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { vol } from "memfs";
import { appendIfMissing } from "./file.js";

vi.mock("fs-extra", async () => {
  const memfs = await import("memfs");
  return {
    default: {
      pathExists: async (p: string) => {
        try {
          await memfs.fs.promises.access(p);
          return true;
        } catch {
          return false;
        }
      },
      writeFile: memfs.fs.promises.writeFile,
      readFile: memfs.fs.promises.readFile,
      appendFile: memfs.fs.promises.appendFile,
    },
  };
});

describe("appendIfMissing", () => {
  beforeEach(() => {
    vol.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("파일이 존재하지 않을 때", () => {
    it("새 파일을 생성하고 success를 반환해야 한다", async () => {
      vol.fromJSON({
        "/test": null, // 디렉토리 생성
      });
      const result = await appendIfMissing("/test/file.txt", "hello world");

      expect(result).toBe("success");
      expect(vol.readFileSync("/test/file.txt", "utf-8")).toBe("hello world\n");
    });
  });

  describe("파일이 이미 존재할 때", () => {
    it("내용이 이미 포함되어 있으면 skip을 반환해야 한다", async () => {
      vol.fromJSON({
        "/test/file.txt": "hello world\n",
      });

      const result = await appendIfMissing("/test/file.txt", "hello world");

      expect(result).toBe("skip");
    });

    it("내용이 없으면 추가하고 success를 반환해야 한다", async () => {
      vol.fromJSON({
        "/test/file.txt": "existing content\n",
      });

      const result = await appendIfMissing("/test/file.txt", "new content");

      expect(result).toBe("success");
      const content = vol.readFileSync("/test/file.txt", "utf-8");
      expect(content).toContain("existing content");
      expect(content).toContain("new content");
    });

    it("내용이 공백으로 감싸져 있어도 검사해야 한다", async () => {
      vol.fromJSON({
        "/test/file.txt": "  hello world  \n",
      });

      const result = await appendIfMissing("/test/file.txt", "  hello world  ");

      expect(result).toBe("skip");
    });
  });

  describe("에러 처리", () => {
    it("존재하지 않는 디렉토리에 파일 작성 시 error를 반환해야 한다", async () => {
      vol.fromJSON({});
      // /nonexistent 디렉토리가 존재하지 않으므로 에러 발생
      const result = await appendIfMissing("/nonexistent/file.txt", "content");
      expect(result).toBe("error");
    });
  });
});
