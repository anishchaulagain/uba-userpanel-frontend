import { Request, Response, NextFunction } from 'express';
import { getRoles, assignRole, removeRole } from '../../controllers/role.controller';
import * as roleService from '../../services/role.service';
import { RoleType } from '../../database/entities/Role';
import { removeRoleSchema } from '../../validators/authorization.validator';

jest.mock('../../services/role.service');
jest.mock('../../validators/authorization.validator', () => ({
  ...jest.requireActual('../../validators/authorization.validator'),
  removeRoleSchema: {
    safeParse: jest.fn()
  }
}));

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('Role Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoles', () => {
    it('should return roles on success', async () => {
      const res = mockResponse();
      const roles = [{ id: 1, name: RoleType.ADMIN }];
      (roleService.getAllRolesService as jest.Mock).mockResolvedValue(roles);

      await getRoles({} as Request, res);

      expect(roleService.getAllRolesService).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(roles);
    });

    it('should handle errors', async () => {
      const res = mockResponse();
      (roleService.getAllRolesService as jest.Mock).mockRejectedValue(new Error('DB error'));

      await getRoles({} as Request, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('assignRole', () => {
    it('should assign role when valid', async () => {
      const req = {
        body: { userId: 1, roleName: RoleType.ADMIN }
      } as Request;
      const res = mockResponse();
      const mockUser = { id: 1, email: 'testuser@example.com', roles: [RoleType.ADMIN] };

      (roleService.assignRoleService as jest.Mock).mockResolvedValue(mockUser);

      await assignRole(req, res);

      expect(roleService.assignRoleService).toHaveBeenCalledWith(1, RoleType.ADMIN);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Role assigned successfully',
        user: mockUser
      });
    });

    it('should return 400 if missing fields', async () => {
      const req = { body: { userId: null } } as Request;
      const res = mockResponse();

      await assignRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User ID and role name are required' });
    });

    it('should handle error', async () => {
      const req = {
        body: { userId: 1, roleName: RoleType.ADMIN }
      } as Request;
      const res = mockResponse();
      (roleService.assignRoleService as jest.Mock).mockRejectedValue(new Error('Some failure'));

      await assignRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error assigning roles',
        error: 'Some failure'
      });
    });
  });

  describe('removeRole', () => {
    it('should remove role if valid input', async () => {
      const req = {
        body: { userId: 1, roleName: RoleType.USER }
      } as Request;
      const res = mockResponse();
      const next = jest.fn();

      const mockUser = { id: 1, email: 'testuser@example.com', roles: [] };

      (removeRoleSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: req.body
      });
      (roleService.removeRoleService as jest.Mock).mockResolvedValue(mockUser);

      await removeRole(req, res, next);

      expect(roleService.removeRoleService).toHaveBeenCalledWith(1, RoleType.USER);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `Role 'user' removed successfully`,
        user: mockUser
      });
    });

    it('should return 400 on validation error', async () => {
      const req = {
        body: {}
      } as Request;
      const res = mockResponse();
      const next = jest.fn();

      (removeRoleSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          flatten: () => ({ fieldErrors: { userId: ['Required'] } })
        }
      });

      await removeRole(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: { userId: ['Required'] }
      });
    });

    it('should handle internal error', async () => {
      const req = {
        body: { userId: 1, roleName: RoleType.ADMIN }
      } as Request;
      const res = mockResponse();
      const next = jest.fn();

      (removeRoleSchema.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: req.body
      });

      (roleService.removeRoleService as jest.Mock).mockRejectedValue(new Error('DB error'));

      await removeRole(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error removing roles',
        error: 'DB error'
      });
    });
  });
});
