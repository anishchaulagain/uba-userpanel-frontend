

import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';

export const authorizePermission = (requiredPermissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id) {
                res.status(401).json({ message: 'Unauthorized' });
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({
                where: { id: req.user.id },
                relations: ['roles', 'roles.permissions'],
            });

            if (!user) {
                res.status(401).json({ message: 'User not found' });
                return
            }

            const userPermissions = user.roles.flatMap(role => role.permissions.map(p => p.name));

            const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

            if (!hasPermission) {
                res.status(403).json({ message: 'Forbidden: You do not have permission' });
            }

            next();
        } catch (err) {
            console.error('Permission check error:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
