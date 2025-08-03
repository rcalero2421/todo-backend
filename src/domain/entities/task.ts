import { TaskStatus } from '@shared/constants/index';

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public status: TaskStatus,
    public userId: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
