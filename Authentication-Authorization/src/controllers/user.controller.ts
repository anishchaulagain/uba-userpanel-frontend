import { Request, Response } from 'express';
import * as userService from '../services/user.services';
import { handleError } from '../utils/helper.errorhandler';

export const createUser = async (req: Request, res: Response) => {
  try {
    const saved = await userService.createUserService(req.body);
    res.status(201).json({ message: 'User created successfully', user: saved });
  } catch (err) {
    handleError(res, err, 'Error creating user');
  }
};

export const getUsersWithInternships = async (_: Request, res: Response) => {
  try {
    const users = await userService.getUsersWithInternshipsService();
    const sanitizedUsers = users.map(user => {
      const { password, roles, ...userWithoutPassword } = user;
      const roleNames = roles.map(role => role.name);

      return {
        ...userWithoutPassword,
        roles: roleNames
      };
    });

    res.json(sanitizedUsers);
  } catch (err) {
    handleError(res, err, 'Error fetching users');
  }
};

export const getOneUserWithInternships = async (req: Request, res: Response) => {
  try {
    const user = await userService.getOneUserWithInternshipsService(Number(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(res, err, 'Error fetching user');
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, password } = req.body;
    if (password) {
      res.status(400).json({
        message: 'You are not allowed to update the password from this endpoint.',
      });
    }
    const updated = await userService.updateUserService(Number(req.params.id), {
      firstName,
      lastName,

    });
    const { password: _, ...sanitizedUser } = updated;

    res.status(200).json({ message: 'User updated successfully', user: sanitizedUser });
  } catch (err) {
    handleError(res, err, 'Error updating user');
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUserService(Number(req.params.id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    handleError(res, err, 'Error deleting user');
  }
};

export const getUsersWithInternshipCount = async (_: Request, res: Response) => {
  try {
    const result = await userService.getUsersWithInternshipCountService();
    res.json(result);
  } catch (err) {
    handleError(res, err, 'Error fetching users with internship count');
  }
};
