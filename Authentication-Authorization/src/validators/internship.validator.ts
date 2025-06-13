import { z } from 'zod';

export const internshipSchema = z.object({
  joinedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid joined date'
  }),
  completionDate: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid completion date'
    }),
  isCertified: z.boolean(),
  mentorName: z
    .string()
    .min(3, { message: 'Mentor name must be at least 3 characters' })
    .max(100, { message: 'Mentor name must be less than 100 characters' }),
  userId: z.number().int().positive({ message: 'User ID must be a positive integer' })
});
