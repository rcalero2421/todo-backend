import { Task } from '@domain/entities';
import { ITaskRepository } from '@domain/repositories';
import { TaskStatus } from '@shared/constants';

export class GetTasksByUserUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(userId: string, status?: TaskStatus): Promise<Task[]> {
    return this.taskRepository.getByUserId(userId, status);
  }
}
