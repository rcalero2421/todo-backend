import { Request, Response } from 'express';
import { FirebaseUserRepository } from '@infrastructure/repositories';
import { GetUserByEmailUseCase } from '@application/use-cases/user';
import { AuthResponseDto, CreateUserDto } from '@application/dtos';
import { CreateUserUseCase } from '@application/use-cases/user';
import { ApiResponse } from '@shared/types';
import { User } from '@domain/entities/user';
import { EmailAlreadyExistsError } from '@domain/errors';
import { errorResponse, successResponse } from '@shared/helpers';

const userRepo = new FirebaseUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepo);

export class UserController {
  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: user@example.com
   *               name:
   *                 type: string
   *                 example: John Doe
   *               role:
   *                 type: string
   *                 example: user
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       409:
   *         description: Email already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               code: 409
   *               status: error
   *               message: User with email already exists
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *             example:
   *               code: 500
   *               status: error
   *               message: Internal server error
   */
  static async create(req: Request, res: Response) {
    const input: CreateUserDto = {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
    };

    try {
      const result: AuthResponseDto = await createUserUseCase.execute(input);

      return successResponse<AuthResponseDto>(res, 201, 'User created', result);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return errorResponse(res, 409, error.message);
      }

      console.error(error);
      return errorResponse(res, 500, 'Internal server error');
    }
  }

  /**
  * @swagger
  * /api/users/{email}:
  *   get:
  *     summary: Get user by email
  *     tags: [User]
  *     parameters:
  *       - in: path
  *         name: email
  *         required: true
  *         schema:
  *           type: string
  *         description: User email
  *     responses:
  *       200:
  *         description: User found
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/ApiResponse'
  *       404:
  *         description: User not found
  */
  static async getByEmail(req: Request, res: Response<ApiResponse<AuthResponseDto>>) {
    const { email } = req.params;
    const useCase = new GetUserByEmailUseCase(userRepo);

    try {
      const result: AuthResponseDto = await useCase.execute(email);

      return successResponse<AuthResponseDto>(res, 200, 'User found', result);
    } catch (error) {
      return errorResponse(res, 404, 'User not found');
    }
  }
}
