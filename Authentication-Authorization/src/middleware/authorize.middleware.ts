import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';
import { RoleType } from '../database/entities/Role';

/**
 * Middleware to check if user has required roles
 * @param requiredRoles Array of roles required to access the route
 */
export const authorize = (requiredRoles: RoleType[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { id: req.user.id },
        relations: ['roles']
      });

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const hasRequiredRole = user.roles.some(role =>
        requiredRoles.includes(role.name as RoleType)
      );

      if (!hasRequiredRole) {
        res.status(403).json({
          message: 'Forbidden: You do not have the required permissions'
        });
        return;
      }

      req.user.roles = user.roles.map(role => role.name);
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};
