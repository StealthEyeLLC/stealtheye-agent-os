import { WorkerTaskSchema, type WorkerTask, type WorkerTaskStatus } from "./schemas";

const allowedTransitions: Record<WorkerTaskStatus, WorkerTaskStatus[]> = {
  queued: ["leased", "blocked", "canceled"],
  leased: ["running", "waiting", "blocked", "retry_scheduled", "canceled"],
  running: ["waiting", "blocked", "completed", "failed", "retry_scheduled", "canceled"],
  waiting: ["queued", "leased", "blocked", "canceled"],
  blocked: ["queued", "canceled"],
  completed: [],
  failed: ["retry_scheduled", "canceled"],
  retry_scheduled: ["queued", "canceled"],
  canceled: []
};

export function canTransitionTaskStatus(from: WorkerTaskStatus, to: WorkerTaskStatus): boolean {
  return from === to || allowedTransitions[from].includes(to);
}

export function transitionTaskStatus(task: WorkerTask, to: WorkerTaskStatus, now: string, patch: Partial<WorkerTask> = {}): WorkerTask {
  if (!canTransitionTaskStatus(task.status, to)) throw new Error(`invalid task status transition: ${task.status} -> ${to}`);
  return WorkerTaskSchema.parse({
    ...task,
    ...patch,
    status: to,
    updated_at: now,
    started_at: to === "running" ? (task.started_at ?? now) : task.started_at,
    completed_at: to === "completed" ? now : task.completed_at,
    failed_at: to === "failed" ? now : task.failed_at
  });
}

export interface WorkerMissionSummary {
  mission_id: string;
  total_tasks: number;
  counts_by_status: Record<WorkerTaskStatus, number>;
  blockers: string[];
  next_runnable_task_ids: string[];
  completion_ready: boolean;
  failed_retryable_task_ids: string[];
  summary: string;
}

export function taskSummary(task: WorkerTask): string {
  const dependencyText = task.dependencies.length === 0 ? "no dependencies" : `${task.dependencies.length} dependencies`;
  const blockText = task.blocked_reason ? ` Blocked: ${task.blocked_reason}` : "";
  return `${task.task_id} is ${task.status} as ${task.task_type} with ${dependencyText}.${blockText}`;
}

export function blockerSummary(tasks: WorkerTask[]): string[] {
  return tasks
    .filter((task) => task.status === "blocked" || task.blocked_reason)
    .map((task) => `${task.task_id}: ${task.blocked_reason ?? "blocked"}`)
    .sort();
}

export function nextRunnableTasks(tasks: WorkerTask[]): WorkerTask[] {
  const completed = new Set(tasks.filter((task) => task.status === "completed").map((task) => task.task_id));
  return tasks.filter((task) => task.status === "queued" && task.dependencies.every((dependency) => completed.has(dependency)));
}

export function completionReady(tasks: WorkerTask[]): boolean {
  return tasks.length > 0 && tasks.every((task) => task.status === "completed" || task.status === "canceled");
}

export function failedRetryableTasks(tasks: WorkerTask[]): WorkerTask[] {
  return tasks.filter((task) => (task.status === "failed" || task.status === "retry_scheduled") && Boolean(task.error_summary?.retryable) && !(task.retry_state?.exhausted));
}

export function missionWorkerSummary(tasks: WorkerTask[]): WorkerMissionSummary {
  const missionId = tasks[0]?.mission_id ?? "mission:unknown";
  const counts = Object.fromEntries((Object.keys(allowedTransitions) as WorkerTaskStatus[]).map((status) => [status, 0])) as Record<WorkerTaskStatus, number>;
  for (const task of tasks) counts[task.status] += 1;
  const runnable = nextRunnableTasks(tasks).map((task) => task.task_id).sort();
  const blockers = blockerSummary(tasks);
  const retryable = failedRetryableTasks(tasks).map((task) => task.task_id).sort();
  return {
    mission_id: missionId,
    total_tasks: tasks.length,
    counts_by_status: counts,
    blockers,
    next_runnable_task_ids: runnable,
    completion_ready: completionReady(tasks),
    failed_retryable_task_ids: retryable,
    summary: `${tasks.length} worker tasks: ${runnable.length} runnable, ${blockers.length} blocked, ${retryable.length} retryable failures.`
  };
}
