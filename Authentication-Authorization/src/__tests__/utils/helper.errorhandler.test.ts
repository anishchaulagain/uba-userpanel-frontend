import { Response } from 'express';
import { ZodError } from 'zod';
import { QueryFailedError } from 'typeorm';
import { handleError } from '../../utils/helper.errorhandler';

describe('handleError utility', () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should handle ZodError with status 400', () => {
    const zodError = new ZodError([
      { path: ['email'], message: 'Invalid email', code: 'custom' },
    ]);

    handleError(res as Response, zodError, 'Validation failed');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation Error',
      errors: zodError.errors,
    });
  });

  it('should handle QueryFailedError with status 400', () => {
    const mockQueryError = new QueryFailedError('INSERT', [], new Error('Duplicate entry'));

    handleError(res as Response, mockQueryError, 'DB error');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Database Query Error',
      error: (mockQueryError as any).message,
    });
  });

  it('should handle generic Error with status 500', () => {
    const genericError = new Error('Something went wrong');

    handleError(res as Response, genericError, 'Something failed');

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something failed',
      error: 'Something went wrong',
    });
  });

  it('should handle unknown error with fallback', () => {
    const unknownError = { unexpected: true };

    handleError(res as Response, unknownError, 'Unexpected crash');

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unexpected crash',
    });
  });
});
