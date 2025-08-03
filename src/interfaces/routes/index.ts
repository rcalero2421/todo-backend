import { Router } from 'express';
import { UserController } from '@interfaces/controllers/userController';
import { createUserValidator } from '@interfaces/validators';
import { validateRequest } from '@interfaces/middlewares/validateRequest';

const router = Router();

router.post('/users', createUserValidator, validateRequest, UserController.create);
router.get('/users/:email', UserController.getByEmail);

export default router;
