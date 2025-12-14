import { describe, it, expect, beforeEach, vi } from "vitest";
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
      writeFile: memfs.fs.promises.writeFile,
      readFile: memfs.fs.promises.readFile,
      appendFile: memfs.fs.promises.appendFile,
    },
  };
});

describe("claudeTasks", () => {
  beforeEach(() => {
    vol.reset();
    vi.resetModules();
  });

  describe("claudeLinkTask", () => {
    it("claude 설정 파일을 링크해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      // assets 디렉토리 구조 생성
      vol.fromJSON({
        "/assets/claude/settings.json": '{"theme": "dark"}',
        "/assets/claude/CLAUDE.md": "# Claude Config",
        [`${homeDir}/.zshrc`]: "# existing config",
      });

      // config 모듈의 ASSETS_DIR을 오버라이드하기 위해 모킹
      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: `${homeDir}/.zshrc`,
          name: ".zshrc",
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const linkTask = claudeTasks[0];

      const result = await linkTask.run();

      expect(result.errors).toBe(0);
    });

    it("소스 디렉토리가 없으면 에러를 반환해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({
        [`${homeDir}/.zshrc`]: "# existing config",
      });

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/nonexistent",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: `${homeDir}/.zshrc`,
          name: ".zshrc",
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const linkTask = claudeTasks[0];

      const result = await linkTask.run();

      expect(result.errors).toBeGreaterThan(0);
    });

    it("formatResult가 에러 메시지를 올바르게 포맷해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({});

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: `${homeDir}/.zshrc`,
          name: ".zshrc",
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const linkTask = claudeTasks[0];

      const formatted = linkTask.formatResult({ errors: 2, success: 0, skipped: 0 });

      expect(formatted).toContain("2 errors");
    });

    it("formatResult가 성공 메시지를 올바르게 포맷해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({});

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: `${homeDir}/.zshrc`,
          name: ".zshrc",
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const linkTask = claudeTasks[0];

      const formatted = linkTask.formatResult({ errors: 0, success: 3, skipped: 1 });

      expect(formatted).toContain("3 linked");
      expect(formatted).toContain("1 skipped");
    });
  });

  describe("claudeAliasTask", () => {
    it("셸 RC 파일에 alias를 추가해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({
        [`${homeDir}/.zshrc`]: "# existing config\n",
      });

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: `${homeDir}/.zshrc`,
          name: ".zshrc",
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const aliasTask = claudeTasks[1];

      const result = await aliasTask.run();

      expect(result.errors).toBe(0);
    });

    it("셸 RC 파일이 없으면 에러를 반환해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({});

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: null,
          name: null,
          error: "no shell rc file found",
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const aliasTask = claudeTasks[1];

      const result = await aliasTask.run();

      expect(result.errors).toBe(1);
    });

    it("formatResult가 에러 메시지를 올바르게 포맷해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({});

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: null,
          name: null,
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const aliasTask = claudeTasks[1];

      const formatted = aliasTask.formatResult({
        errors: 1,
        added: false,
        file: null,
        error: "some error",
      });

      expect(formatted).toContain("some error");
    });

    it("formatResult가 성공 메시지를 올바르게 포맷해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({});

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: null,
          name: null,
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const aliasTask = claudeTasks[1];

      const formatted = aliasTask.formatResult({
        errors: 0,
        added: true,
        file: ".zshrc",
        error: null,
      });

      expect(formatted).toContain("added");
      expect(formatted).toContain(".zshrc");
    });

    it("formatResult가 스킵 메시지를 올바르게 포맷해야 한다", async () => {
      const homeDir = "/home/test";
      vi.stubEnv("HOME", homeDir);
      vi.stubEnv("USERPROFILE", "");

      vol.fromJSON({});

      vi.doMock("../config.js", () => ({
        ASSETS_DIR: "/assets",
        HOME_DIR: homeDir,
        getShellRcPath: async () => ({
          path: null,
          name: null,
          error: null,
        }),
      }));

      const { claudeTasks } = await import("./claude.js");
      const aliasTask = claudeTasks[1];

      const formatted = aliasTask.formatResult({
        errors: 0,
        added: false,
        file: ".zshrc",
        error: null,
      });

      expect(formatted).toContain("skipped");
    });
  });
});
