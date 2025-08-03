import { body } from 'express-validator';
import { TASK_STATUSES } from '@shared/constants';

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string'),
];

export const updateTaskValidator = [
  body('id')
    .notEmpty()
    .withMessage('ID is required'),

  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(TASK_STATUSES))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUSES).join(', ')}`),
];
