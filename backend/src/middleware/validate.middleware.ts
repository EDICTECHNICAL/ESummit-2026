import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { sendError } from '../utils/response.util';

/**
 * Middleware to validate request body using Zod schema
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body
      const validated = schema.parse(req.body);

      // Replace request body with validated data
      req.body = validated;

      next();
    } catch (error: any) {
      // Format Zod errors
      if (error.errors) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });

        sendError(res, 'Validation failed', 400, undefined, errors);
        return;
      }

      sendError(res, 'Validation failed', 400, error.message);
      return;
    }
  };
};
