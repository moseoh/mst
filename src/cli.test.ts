import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

describe("CLI", () => {
  let mockConsoleLog: Mock;
  let mockConsoleError: Mock;
  let mockConsoleClear: Mock;
  let mockProcessExit: Mock;

  beforeEach(() => {
    vi.resetModules();
    mockConsoleLog = vi.fn();
    mockConsoleError = vi.fn();
    mockConsoleClear = vi.fn();
    mockProcessExit = vi.fn();

    vi.stubGlobal("console", {
      log: mockConsoleLog,
      error: mockConsoleError,
      clear: mockConsoleClear,
    });

    vi.stubGlobal("process", {
      ...process,
      argv: ["node", "cli.js"],
      exit: mockProcessExit,
    });
  });

  describe("--version 플래그", () => {
    it("-v 플래그로 버전을 출력해야 한다", async () => {
      process.argv = ["node", "cli.js", "-v"];

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn(), formatResult: vi.fn() },
        sample2Task: { name: "sample2", description: "", run: vi.fn(), formatResult: vi.fn() },
      }));

      vi.doMock("ora", () => ({
        default: vi.fn(() => ({
          start: vi.fn().mockReturnThis(),
          stopAndPersist: vi.fn(),
        })),
      }));

      // 동적 import로 cli 모듈 로드
      await import("./cli.js");

      // 약간의 지연 후 확인 (비동기 처리 대기)
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockConsoleLog).toHaveBeenCalledWith("1.0.0");
      expect(mockProcessExit).toHaveBeenCalledWith(0);
    });

    it("--version 플래그로 버전을 출력해야 한다", async () => {
      process.argv = ["node", "cli.js", "--version"];

      vi.doMock("../package.json", () => ({
        default: { version: "2.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn(), formatResult: vi.fn() },
        sample2Task: { name: "sample2", description: "", run: vi.fn(), formatResult: vi.fn() },
      }));

      vi.doMock("ora", () => ({
        default: vi.fn(() => ({
          start: vi.fn().mockReturnThis(),
          stopAndPersist: vi.fn(),
        })),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockConsoleLog).toHaveBeenCalledWith("2.0.0");
      expect(mockProcessExit).toHaveBeenCalledWith(0);
    });
  });

  describe("--help 플래그", () => {
    it("-h 플래그로 도움말을 출력해야 한다", async () => {
      process.argv = ["node", "cli.js", "-h"];

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn(), formatResult: vi.fn() },
        sample2Task: { name: "sample2", description: "", run: vi.fn(), formatResult: vi.fn() },
      }));

      vi.doMock("ora", () => ({
        default: vi.fn(() => ({
          start: vi.fn().mockReturnThis(),
          stopAndPersist: vi.fn(),
        })),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockConsoleLog).toHaveBeenCalled();
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain("MST");
      expect(mockProcessExit).toHaveBeenCalledWith(0);
    });

    it("--help 플래그로 도움말을 출력해야 한다", async () => {
      process.argv = ["node", "cli.js", "--help"];

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn(), formatResult: vi.fn() },
        sample2Task: { name: "sample2", description: "", run: vi.fn(), formatResult: vi.fn() },
      }));

      vi.doMock("ora", () => ({
        default: vi.fn(() => ({
          start: vi.fn().mockReturnThis(),
          stopAndPersist: vi.fn(),
        })),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockConsoleLog).toHaveBeenCalled();
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain("Usage");
      expect(mockProcessExit).toHaveBeenCalledWith(0);
    });
  });

  describe("알 수 없는 명령어", () => {
    it("알 수 없는 명령어에 대해 에러를 출력해야 한다", async () => {
      process.argv = ["node", "cli.js", "unknown"];

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn(), formatResult: vi.fn() },
        sample2Task: { name: "sample2", description: "", run: vi.fn(), formatResult: vi.fn() },
      }));

      vi.doMock("ora", () => ({
        default: vi.fn(() => ({
          start: vi.fn().mockReturnThis(),
          stopAndPersist: vi.fn(),
        })),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockConsoleLog).toHaveBeenCalled();
      // 알 수 없는 명령어 메시지 확인
      const calls = mockConsoleLog.mock.calls.map((c: unknown[]) => c[0]);
      const hasUnknownMessage = calls.some((c: string) => c && c.includes && c.includes("Unknown"));
      expect(hasUnknownMessage).toBe(true);
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });
  });

  describe("명령어 없음", () => {
    it("명령어 없이 실행하면 도움말을 출력해야 한다", async () => {
      process.argv = ["node", "cli.js"];

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn(), formatResult: vi.fn() },
        sample2Task: { name: "sample2", description: "", run: vi.fn(), formatResult: vi.fn() },
      }));

      vi.doMock("ora", () => ({
        default: vi.fn(() => ({
          start: vi.fn().mockReturnThis(),
          stopAndPersist: vi.fn(),
        })),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockConsoleLog).toHaveBeenCalled();
      const logCall = mockConsoleLog.mock.calls[0][0];
      expect(logCall).toContain("MST");
    });
  });

  describe("install 명령어", () => {
    it("install 명령어로 태스크를 실행해야 한다", async () => {
      process.argv = ["node", "cli.js", "install"];

      const mockTask = {
        name: "test task",
        description: "test",
        run: vi.fn().mockResolvedValue({ errors: 0 }),
        formatResult: vi.fn().mockReturnValue("(success)"),
      };

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [mockTask],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn().mockResolvedValue({ errors: 0 }), formatResult: vi.fn().mockReturnValue("") },
        sample2Task: { name: "sample2", description: "", run: vi.fn().mockResolvedValue({ errors: 0 }), formatResult: vi.fn().mockReturnValue("") },
      }));

      const mockSpinner = {
        start: vi.fn().mockReturnThis(),
        stopAndPersist: vi.fn(),
      };

      vi.doMock("ora", () => ({
        default: vi.fn(() => mockSpinner),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockTask.run).toHaveBeenCalled();
    });

    it("i 단축 명령어로 태스크를 실행해야 한다", async () => {
      process.argv = ["node", "cli.js", "i"];

      const mockTask = {
        name: "test task",
        description: "test",
        run: vi.fn().mockResolvedValue({ errors: 0 }),
        formatResult: vi.fn().mockReturnValue("(success)"),
      };

      vi.doMock("../package.json", () => ({
        default: { version: "1.0.0" },
      }));

      vi.doMock("./tasks/just.js", () => ({
        justTasks: [mockTask],
      }));

      vi.doMock("./tasks/claude.js", () => ({
        claudeTasks: [],
      }));

      vi.doMock("./tasks/sample.js", () => ({
        sample1Task: { name: "sample1", description: "", run: vi.fn().mockResolvedValue({ errors: 0 }), formatResult: vi.fn().mockReturnValue("") },
        sample2Task: { name: "sample2", description: "", run: vi.fn().mockResolvedValue({ errors: 0 }), formatResult: vi.fn().mockReturnValue("") },
      }));

      const mockSpinner = {
        start: vi.fn().mockReturnThis(),
        stopAndPersist: vi.fn(),
      };

      vi.doMock("ora", () => ({
        default: vi.fn(() => mockSpinner),
      }));

      await import("./cli.js");

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockTask.run).toHaveBeenCalled();
    });
  });
});
