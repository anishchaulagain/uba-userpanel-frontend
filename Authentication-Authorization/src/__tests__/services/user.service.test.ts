import * as userService from '../../services/user.services';
import { userRepo } from '../../repositories/user.repository';
import { User } from '../../database/entities/User';

jest.mock('../../repositories/user.repository');

describe('User Service', () => {
  const mockUser: Partial<User> = {
    id: 1,
    firstName: 'Anish',
    lastName: 'Chaula',
    email: 'anishchaulagain@gmail.com',
    createdAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserService', () => {
    it('should create a user if not exists', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(undefined);
      (userRepo.create as jest.Mock).mockReturnValue(mockUser);
      (userRepo.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUserService(mockUser);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(userRepo.create).toHaveBeenCalledWith(mockUser);
      expect(userRepo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user already exists', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(userService.createUserService(mockUser)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('getUsersWithInternshipsService', () => {
    it('should return users with internships', async () => {
      (userRepo.find as jest.Mock).mockResolvedValue([mockUser]);

      const result = await userService.getUsersWithInternshipsService();
      expect(userRepo.find).toHaveBeenCalledWith({ relations: ['internships'] });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('getOneUserWithInternshipsService', () => {
    it('should return a single user with internships', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getOneUserWithInternshipsService(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['internships'] });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUserService', () => {
    it('should update user if found', async () => {
      (userRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (userRepo.merge as jest.Mock).mockImplementation((user, data) => Object.assign(user, data));
      (userRepo.save as jest.Mock).mockResolvedValue({ ...mockUser, firstName: 'Updated' });

      const result = await userService.updateUserService(1, { firstName: 'Updated' });
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(userRepo.merge).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result.firstName).toBe('Updated');
    });

    it('should throw if user not found', async () => {
      (userRepo.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(userService.updateUserService(1, { firstName: 'Test' })).rejects.toThrow('User not found');
    });
  });

  describe('deleteUserService', () => {
    it('should delete user if found', async () => {
      (userRepo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(userService.deleteUserService(1)).resolves.toBeUndefined();
    });

    it('should throw if user not found', async () => {
      (userRepo.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(userService.deleteUserService(1)).rejects.toThrow('User not found');
    });
  });

  describe('getUsersWithInternshipCountService', () => {
    it('should return users with internship counts', async () => {
      const mockData = [{ id: 1, internshipCount: 3 }];
      (userRepo.query as jest.Mock).mockResolvedValue(mockData);

      const result = await userService.getUsersWithInternshipCountService();
      expect(userRepo.query).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
});
