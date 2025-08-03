import { Task } from '@domain/entities/task';
import { ITaskRepository } from '@domain/repositories';
import { UpdateTaskDto } from '@application/dtos';
import { TaskNotFoundError } from '@domain/errors';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(data: UpdateTaskDto): Promise<void> {
    const existing = await this.taskRepository.getById(data.id, data.userId);
    if (!existing) {
      throw new TaskNotFoundError(data.id);
    }

    const updated = new Task(
      data.id,
      data.title,
      data.description,
      data.status,
      data.userId,
      existing.createdAt,
      new Date()
    );

    await this.taskRepository.update(updated);
  }
}
