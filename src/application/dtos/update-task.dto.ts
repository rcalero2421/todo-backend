import { TaskStatus } from '@shared/constants';

export interface UpdateTaskDto {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
}
