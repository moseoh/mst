import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { vol } from "memfs";

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
      writeFile: memfs.fs.promises.writeFile,
      readFile: memfs.fs.promises.readFile,
      appendFile: memfs.fs.promises.appendFile,
    },
  };
});

describe("getShellRcPath", () => {
  beforeEach(() => {
    vol.reset();
    vi.resetModules();
  });

  it(".zshrc가 존재하면 .zshrc 경로를 반환해야 한다", async () => {
    const homeDir = "/home/test";
    vol.fromJSON({
      [`${homeDir}/.zshrc`]: "# zsh config",
    });

    vi.stubEnv("HOME", homeDir);
    vi.stubEnv("USERPROFILE", "");

    const { getShellRcPath } = await import("./alias.js");
    const result = await getShellRcPath();

    expect(result.path).toBe(`${homeDir}/.zshrc`);
    expect(result.name).toBe(".zshrc");
    expect(result.error).toBeNull();
  });

  it(".zshrc가 없고 .bashrc가 있으면 .bashrc 경로를 반환해야 한다", async () => {
    const homeDir = "/home/test";
    vol.fromJSON({
      [`${homeDir}/.bashrc`]: "# bash config",
    });

    vi.stubEnv("HOME", homeDir);
    vi.stubEnv("USERPROFILE", "");

    const { getShellRcPath } = await import("./alias.js");
    const result = await getShellRcPath();

    expect(result.path).toBe(`${homeDir}/.bashrc`);
    expect(result.name).toBe(".bashrc");
    expect(result.error).toBeNull();
  });

  it("둘 다 없으면 에러를 반환해야 한다", async () => {
    const homeDir = "/home/test";
    vol.fromJSON({
      [`${homeDir}/other.txt`]: "some file",
    });

    vi.stubEnv("HOME", homeDir);
    vi.stubEnv("USERPROFILE", "");

    const { getShellRcPath } = await import("./alias.js");
    const result = await getShellRcPath();

    expect(result.path).toBeNull();
    expect(result.name).toBeNull();
    expect(result.error).toBe("no shell rc file found (.zshrc or .bashrc)");
  });

  it(".zshrc와 .bashrc 둘 다 있으면 .zshrc를 우선해야 한다", async () => {
    const homeDir = "/home/test";
    vol.fromJSON({
      [`${homeDir}/.zshrc`]: "# zsh config",
      [`${homeDir}/.bashrc`]: "# bash config",
    });

    vi.stubEnv("HOME", homeDir);
    vi.stubEnv("USERPROFILE", "");

    const { getShellRcPath } = await import("./alias.js");
    const result = await getShellRcPath();

    expect(result.path).toBe(`${homeDir}/.zshrc`);
    expect(result.name).toBe(".zshrc");
  });
});

describe("appendIfMissing", () => {
  beforeEach(() => {
    vol.reset();
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("파일이 존재하지 않을 때", () => {
    it("새 파일을 생성하고 success를 반환해야 한다", async () => {
      vol.fromJSON({
        "/test": null, // 디렉토리 생성
      });

      const { appendIfMissing } = await import("./alias.js");
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

      const { appendIfMissing } = await import("./alias.js");
      const result = await appendIfMissing("/test/file.txt", "hello world");

      expect(result).toBe("skip");
    });

    it("내용이 없으면 추가하고 success를 반환해야 한다", async () => {
      vol.fromJSON({
        "/test/file.txt": "existing content\n",
      });

      const { appendIfMissing } = await import("./alias.js");
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

      const { appendIfMissing } = await import("./alias.js");
      const result = await appendIfMissing("/test/file.txt", "  hello world  ");

      expect(result).toBe("skip");
    });
  });

  describe("에러 처리", () => {
    it("존재하지 않는 디렉토리에 파일 작성 시 error를 반환해야 한다", async () => {
      vol.fromJSON({});

      const { appendIfMissing } = await import("./alias.js");
      const result = await appendIfMissing("/nonexistent/file.txt", "content");
      expect(result).toBe("error");
    });
  });
});
