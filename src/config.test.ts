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
    },
  };
});

// HOME_DIR을 모킹하기 위해 config 모듈을 동적으로 가져옴
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

    // 모듈 다시 로드하기 전에 HOME 설정
    vi.stubEnv("HOME", homeDir);
    vi.stubEnv("USERPROFILE", "");

    const { getShellRcPath } = await import("./config.js");
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

    const { getShellRcPath } = await import("./config.js");
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

    const { getShellRcPath } = await import("./config.js");
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

    const { getShellRcPath } = await import("./config.js");
    const result = await getShellRcPath();

    expect(result.path).toBe(`${homeDir}/.zshrc`);
    expect(result.name).toBe(".zshrc");
  });
});
