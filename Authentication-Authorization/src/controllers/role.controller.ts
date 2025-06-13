import { Request, Response, NextFunction } from 'express';
import { removeRoleSchema } from '../validators/authorization.validator';
import {
  getAllRolesService,
  assignRoleService,
  removeRoleService,
} from '../services/role.service';
import { RoleType } from '../database/entities/Role';
import { handleError } from '../utils/helper.errorhandler';

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await getAllRolesService();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, roleName } = req.body;

    if (!userId || !roleName) {
      res.status(400).json({ message: 'User ID and role name are required' });
      return;
    }

    const user = await assignRoleService(userId, roleName as RoleType);

    res.status(200).json({
      message: 'Role assigned successfully',
      user
    });
  } catch (err) {
    handleError(res, err, 'Error assigning roles');
    return;
  }
};

export const removeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parseResult = removeRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.flatten().fieldErrors });
      return;
    }

    const { userId, roleName } = parseResult.data;
    const user = await removeRoleService(userId, roleName);

    res.status(200).json({
      message: `Role '${roleName}' removed successfully`,
      user,
    });
  } catch (err) {
    handleError(res, err, 'Error removing roles');
  }
};
