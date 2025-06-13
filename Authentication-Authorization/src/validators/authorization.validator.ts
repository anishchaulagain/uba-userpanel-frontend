import z from 'zod'
import { RoleType } from '../database/entities/Role';

export const removeRoleSchema = z.object({
    userId: z.coerce.number().int().positive({ message: 'User ID must be a positive number' }),
    roleName: z.nativeEnum(RoleType, {
        errorMap: () => ({ message: 'Invalid role name' })
    }),
});