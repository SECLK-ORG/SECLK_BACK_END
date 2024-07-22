import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const addUserValidation = [
  check('name').isString().notEmpty().withMessage('employee name is required'),
  check('email').notEmpty().isEmail().withMessage('Valid email is required'),
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
