import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

const validateParams = (req: Request, res: Response, next: NextFunction) => {
  interface iErrors {
    value: string;
    msg: string;
    param: string;
    location: string;
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json(
      // @ts-ignore
      errors.array().map((error: iErrors) => ({
        msg: error.msg,
        param: error.param,
      })),
    );
  }
  next();
};

export default {
  validateBase64Data: check('password')
    // To delete leading and triling space
    .trim()
    // Validate input field to accept only base32 string
    .isBase64()
    // Custom message
    .withMessage('Must be a Base 64 encoded string'),
  validateParams,
};