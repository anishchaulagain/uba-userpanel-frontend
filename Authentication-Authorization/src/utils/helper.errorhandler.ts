
import { Response } from 'express';
import { ZodError } from 'zod';
import { QueryFailedError } from 'typeorm';

export function handleError(res: Response, error: unknown, customMessage = 'Internal server error') {
  // Zod Validation Error
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.errors,
    });
  }

  // TypeORM Query Failure (e.g., duplicate, bad type, etc.)
  if (error instanceof QueryFailedError) {
    return res.status(400).json({
      message: 'Database Query Error',
      error: (error as any).message,
    });
  }

  // Generic Error
  if (error instanceof Error) {
    return res.status(500).json({
      message: customMessage,
      error: error.message,
    });
  }

  // Fallback
  return res.status(500).json({ message: customMessage });
}
