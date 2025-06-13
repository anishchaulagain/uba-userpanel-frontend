import { Request, Response } from 'express';
import * as userService from '../../services/user.services'
import * as userController from '../../controllers/user.controller'
import { handleError } from '../../utils/helper.errorhandler';

jest.mock('../../services/user.services');
jest.mock('../../utils/helper.errorhandler');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};



describe('User Controller', () => {
  const mockUser = { firstName: 'Anish', lastName: "Chaulagain" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUser - success', async () => {
    const req = { body: mockUser } as Request;
    const res = mockResponse();

    (userService.createUserService as jest.Mock).mockResolvedValue(mockUser);

    await userController.createUser(req, res);

    expect(userService.createUserService).toHaveBeenCalledWith(mockUser);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', user: mockUser });
  });

  test('should handle error in createUser (catch block)', async () => {
    const req = { body: mockUser } as Request;
    const res = mockResponse();
    const error = new Error('Database down');

    (userService.createUserService as jest.Mock).mockRejectedValue(error);

    await userController.createUser(req, res as Response);

    expect(userService.createUserService).toHaveBeenCalledWith(mockUser);
    expect(handleError).toHaveBeenCalledWith(res, error, 'Error creating user');
  });

  test('getUsersWithInternships - success', async () => {
    const req = {} as Request;
    const res = mockResponse();

    (userService.getUsersWithInternshipsService as jest.Mock).mockResolvedValue([mockUser]);

    await userController.getUsersWithInternships(req, res);

    expect(userService.getUsersWithInternshipsService).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([mockUser]);
  });
  test('should handle error in getUsersWithInternships (catch block)', async () => {
    const req = { body: mockUser } as Request;
    const res = mockResponse();
    const error = new Error('Database down');

    (userService.getUsersWithInternshipsService as jest.Mock).mockRejectedValue(error);

    await userController.getUsersWithInternships(req, res as Response);

    expect(userService.getUsersWithInternshipsService).toHaveBeenCalled();
    expect(handleError).toHaveBeenCalledWith(res, error, 'Error fetching users');
  });

  test('getOneUserWithInternships - user exists', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    (userService.getOneUserWithInternshipsService as jest.Mock).mockResolvedValue(mockUser);

    await userController.getOneUserWithInternships(req, res);

    expect(userService.getOneUserWithInternshipsService).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });
  test('should handle error in getOneUserWithInternships (catch block)', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();
    const error = new Error('Database down');

    (userService.getOneUserWithInternshipsService as jest.Mock).mockRejectedValue(error);

    await userController.getOneUserWithInternships(req, res as Response);

    expect(userService.getOneUserWithInternshipsService).toHaveBeenCalledWith(1);
    expect(handleError).toHaveBeenCalledWith(res, error, 'Error fetching user');
  });

  test('getOneUserWithInternships - user not found', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    (userService.getOneUserWithInternshipsService as jest.Mock).mockResolvedValue(null);

    await userController.getOneUserWithInternships(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('updateUser - success', async () => {
    const req = { params: { id: '1' }, body: mockUser } as unknown as Request;
    const res = mockResponse();

    const updatedUser = { id: 1, ...mockUser }; 

    (userService.updateUserService as jest.Mock).mockResolvedValue(updatedUser);

    await userController.updateUser(req, res);

    expect(userService.updateUserService).toHaveBeenCalledWith(1, mockUser);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User updated successfully',
      user: updatedUser,
    });
  });

  test('should handle error in updateUser (catch block)', async () => {
    const req = { params: { id: '1' }, body: mockUser } as unknown as Request;
    const res = mockResponse();
    const error = new Error('Database down');

    (userService.updateUserService as jest.Mock).mockRejectedValue(error);

    await userController.updateUser(req, res as Response);

    expect(userService.updateUserService).toHaveBeenCalledWith(1, mockUser);
    expect(handleError).toHaveBeenCalledWith(res, error, 'Error updating user');
  });

  test('deleteUser - success', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    (userService.deleteUserService as jest.Mock).mockResolvedValue(undefined);

    await userController.deleteUser(req, res);

    expect(userService.deleteUserService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
  });
  test('should handle error in deleteUser (catch block)', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();
    const error = new Error('Database down');

    (userService.deleteUserService as jest.Mock).mockRejectedValue(error);

    await userController.deleteUser(req, res as Response);

    expect(userService.deleteUserService).toHaveBeenCalledWith(1);
    expect(handleError).toHaveBeenCalledWith(res, error, 'Error deleting user');
  });

  test('getUsersWithInternshipCount - success', async () => {
    const req = {} as Request;
    const res = mockResponse();
    const data = [{ userId: 1, count: 3 }];

    (userService.getUsersWithInternshipCountService as jest.Mock).mockResolvedValue(data);
    await userController.getUsersWithInternshipCount(req, res);
    expect(res.json).toHaveBeenCalledWith(data);
  });
});
