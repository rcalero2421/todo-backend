import { Task } from '../entities/task';

export interface ITaskRepository {
  create(task: Task): Promise<void>;
  update(task: Task): Promise<void>;
  delete(taskId: string, userId: string): Promise<void>;
  getByUserId(userId: string, status?: string): Promise<Task[]>;
  getById(taskId: string, userId: string): Promise<Task | null>;
}
