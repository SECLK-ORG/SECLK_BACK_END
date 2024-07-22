import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const addUserValidation = [
  check('username').isString().notEmpty().withMessage('Username is required'),
  check('email').notEmpty().isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().isString().withMessage('Password is required'),
  check('role').notEmpty().isIn(['Admin', 'User']).withMessage('Role must be Admin or User'),
  check('position').optional().isString(),
  (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array().map((error)=> error.msg) });
    }
    next();
  }
];
