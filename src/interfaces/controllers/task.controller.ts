import { Request, Response } from 'express';
import {
  CreateTaskUseCase,
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  GetTasksByUserUseCase,
} from '@application/use-cases/task';
import { FirebaseTaskRepository } from '@infrastructure/repositories';
import { successResponse, errorResponse } from '@shared/helpers';
import { TaskStatus } from '@shared/constants';

const taskRepository = new FirebaseTaskRepository();

export class TaskController {
  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title, description, userId]
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               userId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Task created
   *       400:
   *         description: Invalid request
   */
  static async create(req: Request, res: Response) {
    try {
      const useCase = new CreateTaskUseCase(taskRepository);
      const task = await useCase.execute(req.body);
      return successResponse(res, 201, 'Task created', task);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }

  /**
   * @swagger
   * /api/tasks:
   *   put:
   *     summary: Update an existing task
   *     tags: [Tasks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [id, title, description, userId, status]
   *             properties:
   *               id:
   *                 type: string
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               userId:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [todo, in_progress, completed]
   *     responses:
   *       200:
   *         description: Task updated
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Task not found
   */
  static async update(req: Request, res: Response) {
    try {
      const useCase = new UpdateTaskUseCase(taskRepository);
      await useCase.execute(req.body);
      return successResponse(res, 200, 'Task updated');
    } catch (err: any) {
      return errorResponse(
        res,
        err.name === 'TaskNotFoundError' ? 404 : 400,
        err.message
      );
    }
  }

  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Task deleted
   *       400:
   *         description: Invalid ID
   *       404:
   *         description: Task not found
   */
  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const useCase = new DeleteTaskUseCase(taskRepository);
      await useCase.execute(req.params.id, userId);
      return successResponse(res, 200, 'Task deleted');
    } catch (err: any) {
      return errorResponse(
        res,
        err.name === 'TaskNotFoundError' ? 404 : 400,
        err.message
      );
    }
  }

  /**
 * @swagger
 * /api/tasks/user:
 *   get:
 *     summary: Get tasks of the authenticated user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, completed]
 *     responses:
 *       200:
 *         description: List of tasks
 *       400:
 *         description: Invalid request
 */
  static async getByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const useCase = new GetTasksByUserUseCase(taskRepository);
      const status = req.query.status as TaskStatus | undefined;
      const tasks = await useCase.execute(userId, status);
      return successResponse(res, 200, 'Tasks found', tasks);
    } catch (err: any) {
      return errorResponse(res, 400, err.message);
    }
  }
}
