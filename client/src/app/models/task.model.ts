import { TaskPriority, TaskStatus } from './task.enums';
export { TaskPriority, TaskStatus } from './task.enums';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
}