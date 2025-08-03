import { Request, Response } from 'express';
import { FirebaseUserRepository } from '@infrastructure/repositories/FirebaseUserRepository';
import { GetUserByEmail } from '@application/use-cases/user/getUserByEmail';
import { CreateUserDto } from '@application/dtos';
import { CreateUserUseCase } from '@application/use-cases/user/createUser';
import { ApiResponse } from '@shared/types/ApiResponse';
import { User } from '@domain/entities/User';
import { EmailAlreadyExistsError } from '@domain/errors';

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
  static async create(req: Request, res: Response<ApiResponse<User>>) {
    const input: CreateUserDto = {
      email: req.body.email,
      name: req.body.name,
      role: req.body.role,
    };
    try {
      const user = await createUserUseCase.execute(input);

      return res.status(201).json({
        code: 201,
        status: 'success',
        message: 'User created',
        data: user,
      });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return res.status(409).json({
          code: 409,
          status: 'error',
          message: error.message,
        });
      }

      console.error(error);
      return res.status(500).json({
        code: 500,
        status: 'error',
        message: 'Internal server error',
      });
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
  static async getByEmail(req: Request, res: Response<ApiResponse<User | null>>) {
  const { email } = req.params;
  const useCase = new GetUserByEmail(userRepo);
  const user = await useCase.execute(email);

  if (!user) {
    return res.status(404).json({
      code: 404,
      status: 'error',
      message: 'User not found',
    });
  }

  return res.status(200).json({
    code: 200,
    status: 'success',
    message: 'User found',
    data: user,
  });
}
}
