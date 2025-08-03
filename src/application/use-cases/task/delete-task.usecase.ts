import { ITaskRepository } from '@domain/repositories';
import { TaskNotFoundError } from '@domain/errors';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.taskRepository.getById(id, userId);
    if (!existing) {
      throw new TaskNotFoundError(id);
    }

    await this.taskRepository.delete(id, userId);
  }
}
