import { Request, Response } from 'express';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.utils';
import { userRepo } from '../repositories/user.repository';
import { handleError } from '../utils/helper.errorhandler';

//Register user method
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const user = userRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await userRepo.save(user);

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (err) {
      handleError(res, err, 'Registration error');
    }
};


// Login user method
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email }, relations: ['roles'], });

    if (!user || !(await comparePassword(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;
    const roles = user.roles.map(role => role.name);

    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      roles
    });
  } catch (err) {
    handleError(res, err, 'Login error');
  }
};
