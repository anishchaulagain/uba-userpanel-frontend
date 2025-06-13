import { assignRoleService, removeRoleService } from '../../services/role.service';
import { userRepo } from '../../repositories/user.repository';
import { roleRepo } from '../../repositories/role.repository';
import { Role, RoleType } from '../../database/entities/Role';
import { User } from '../../database/entities/User';

jest.mock('../../repositories/user.repository');
jest.mock('../../repositories/role.repository');

//mocking repositories
const mockedUserRepo = userRepo as jest.Mocked<typeof userRepo>;
const mockedRoleRepo = roleRepo as jest.Mocked<typeof roleRepo>;

describe('Role Service', () => {
  const mockUser: User = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'hashedpassword',
    createdAt: new Date(),
    internships: [],
    roles: [],
  };

  const mockRole: Role = {
    id: 1,
    name: RoleType.USER,
    description: 'Standard user with basic access',
    users: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('assignRoleService', () => {
    it('should assign role to a user successfully', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({ ...mockUser, roles: [] });
      mockedRoleRepo.findOne.mockResolvedValueOnce(mockRole);
      mockedUserRepo.save.mockResolvedValueOnce({ ...mockUser, roles: [mockRole] });

      const result = await assignRoleService(1, RoleType.USER);

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        roles: [RoleType.USER],
      });

      expect(mockedUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['roles'] });
      expect(mockedRoleRepo.findOne).toHaveBeenCalledWith({ where: { name: RoleType.USER } });
      expect(mockedUserRepo.save).toHaveBeenCalled();
    });

    it('should throw if user is not found', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce(null);

      await expect(assignRoleService(1, RoleType.USER)).rejects.toThrow('User not found');
    });

    it('should throw if role name is invalid', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({ ...mockUser, roles: [] });

      await expect(assignRoleService(1, 'INVALID_ROLE' as RoleType)).rejects.toThrow('Invalid role name');
    });

    it('should throw if role not found', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({ ...mockUser, roles: [] });
      mockedRoleRepo.findOne.mockResolvedValueOnce(null);

      await expect(assignRoleService(1, RoleType.USER)).rejects.toThrow('Role not found');
    });

     it('should throw if user already has the role', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({ ...mockUser, roles: [mockRole] });
      mockedRoleRepo.findOne.mockResolvedValueOnce(mockRole); 

      await expect(assignRoleService(1, RoleType.USER)).rejects.toThrow('User already has this role');
    });
  })

  describe('removeRoleService', () => {
    it('should remove role from user successfully', async () => {
      const userWithRole = { ...mockUser, roles: [mockRole] };
      mockedUserRepo.findOne.mockResolvedValueOnce(userWithRole);
      mockedUserRepo.save.mockResolvedValueOnce({ ...mockUser, roles: [] });

      const result = await removeRoleService(1, RoleType.USER);

      expect(result).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        roles: [],
      });

      expect(mockedUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['roles'] });
      expect(mockedUserRepo.save).toHaveBeenCalled();
    });

    it('should throw if user is not found', async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce(null);

      await expect(removeRoleService(1, RoleType.USER)).rejects.toThrow('User not found');
    });

    it("should throw if user doesn't have the role", async () => {
      mockedUserRepo.findOne.mockResolvedValueOnce({ ...mockUser, roles: [] });

      await expect(removeRoleService(1, RoleType.USER)).rejects.toThrow(
        `User does not have the '${RoleType.USER}' role`
      );
    });
  });
});

