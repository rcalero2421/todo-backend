import { Task } from '@domain/entities';
import { ITaskRepository } from '@domain/repositories';
import { CreateTaskDto } from '@application/dtos';
import { TASK_STATUSES } from '@shared/constants';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(data: CreateTaskDto): Promise<Task> {
    const now = new Date();

    const task = new Task(
      '',
      data.title,
      data.description,
      TASK_STATUSES.TODO,
      data.userId,
      now,
      now
    );

    await this.taskRepository.create(task);
    return task;
  }
}
