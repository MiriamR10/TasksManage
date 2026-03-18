export enum TaskPriority {
  Low = 'נמוכה',
  Medium = 'בינונית',
  High = 'גבוהה',
}

export enum TaskStatus {
  Pending = 'ממתינה',
  InProgress = 'בתהליך',
  Done = 'הושלמה',
}

export const TASK_PRIORITIES: TaskPriority[] = [
  TaskPriority.Low,
  TaskPriority.Medium,
  TaskPriority.High,
];

export const TASK_STATUSES: TaskStatus[] = [
  TaskStatus.Pending,
  TaskStatus.InProgress,
  TaskStatus.Done,
];
