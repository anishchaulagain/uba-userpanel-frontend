import { Request, Response } from 'express';
import { register, login } from '../../controllers/auth.controller';
import { userRepo } from '../../repositories/user.repository';
import * as authUtils from '../../utils/auth.utils'
import * as errorHandler from '../../utils/helper.errorhandler';

jest.mock('../../repositories/user.repository');
jest.mock('../../utils/auth.utils');
jest.mock('../../utils/helper.errorhandler', () => ({
    handleError: jest.fn(),
}));

const mockRequest = (body = {}) => ({ body } as Request);
const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const req = mockRequest({
                firstName: 'Anish',
                lastName: 'Chaulagain',
                email: 'anish@example.com',
                password: 'password123'
            });
            const res = mockResponse();

            (userRepo.findOne as jest.Mock).mockResolvedValue(null);
            (authUtils.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
            (userRepo.create as jest.Mock).mockReturnValue({ id: 1, firstName: 'Anish', lastName: 'Chaulagain', email: 'anish@example.com', password: 'hashedPassword' });
            (userRepo.save as jest.Mock).mockResolvedValue({});

            await register(req, res);

            expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: 'anish@example.com' } });
            expect(authUtils.hashPassword).toHaveBeenCalledWith('password123');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'User registered successfully',
                user: expect.objectContaining({
                    firstName: 'Anish',
                    lastName: 'Chaulagain',
                    email: 'anish@example.com'
                })
            }));
        });

        it('should not register if user already exists', async () => {
            const req = mockRequest({ email: 'anish@example.com' });
            const res = mockResponse();

            (userRepo.findOne as jest.Mock).mockResolvedValue({ id: 1 });

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });
        it('should handle error and call handleError on failure', async () => {
            const req = mockRequest({ email: 'error@example.com', password: 'pass' });
            const res = mockResponse();
            const mockError = new Error('Unexpected failure');

            (userRepo.findOne as jest.Mock).mockRejectedValue(mockError); // forcefully causing failure

            await register(req, res);
            expect(errorHandler.handleError).toHaveBeenCalledWith(res, mockError, 'Registration error');
        });
    });

    describe('login', () => {
        it('should log in with correct credentials', async () => {
            const req = mockRequest({ email: 'anish@example.com', password: 'password123' });
            const res = mockResponse();

            const mockUser = {
                id: 1,
                email: 'anish@example.com',
                password: 'hashedPassword',
                firstName: 'Anish',
                lastName: 'Chaulagain',
                roles: [
                    { name: 'admin' },
                    { name: 'mentor' }
                ]
            };

            (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
            (authUtils.comparePassword as jest.Mock).mockResolvedValue(true);
            (authUtils.generateToken as jest.Mock).mockReturnValue('jwt-token');


            await login(req, res);

            expect(authUtils.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword');
            expect(authUtils.generateToken).toHaveBeenCalledWith({ id: 1, email: 'anish@example.com' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Login successful',
                user: expect.objectContaining({
                    email: 'anish@example.com'
                }),
                token: 'jwt-token',
                roles: ['admin', 'mentor']
            }));
        });

        it('should fail login with invalid credentials', async () => {
            const req = mockRequest({ email: 'anish@example.com', password: 'wrong' });
            const res = mockResponse();

            (userRepo.findOne as jest.Mock).mockResolvedValue({ password: 'hashedPassword' });
            (authUtils.comparePassword as jest.Mock).mockResolvedValue(false);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
        it('should handle error and call handleError on failure', async () => {
            const req = mockRequest({ email: 'fail@example.com', password: 'fail' });
            const res = mockResponse();
            const mockError = new Error('DB failure');

            (userRepo.findOne as jest.Mock).mockRejectedValue(mockError);

            await login(req, res);

            expect(errorHandler.handleError).toHaveBeenCalledWith(res, mockError, 'Login error');
        });
    });
});
