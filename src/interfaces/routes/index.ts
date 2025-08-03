import { Router } from 'express';
import { UserController, TaskController } from '@interfaces/controllers';
import { createUserValidator, createTaskValidator, updateTaskValidator } from '@interfaces/validators';
import { authMiddleware, validateRequest } from '@interfaces/middlewares';

const router = Router();

router.post('/users', createUserValidator, validateRequest, UserController.create);
router.get('/users/:email', UserController.getByEmail);

router.post('/tasks', authMiddleware, createTaskValidator, validateRequest, TaskController.create);
router.put('/tasks', authMiddleware, updateTaskValidator, validateRequest, TaskController.update);
router.delete('/tasks/:id', authMiddleware, TaskController.delete);
router.get('/tasks/user', authMiddleware, TaskController.getByUser); 

export default router;
