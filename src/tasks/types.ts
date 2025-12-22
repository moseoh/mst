export interface TaskResult {
  errors: number;
}

export interface Task {
  name: string;
  description: string;
  run: () => Promise<TaskResult>;
  formatResult: (result: TaskResult) => string;
}
