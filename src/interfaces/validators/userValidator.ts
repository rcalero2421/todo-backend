import { body } from 'express-validator';

export const createUserValidator = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
];
