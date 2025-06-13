import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateToken, hashPassword, comparePassword } from '../../utils/auth.utils';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Auth Utils', () => {
  const mockPayload = { id: 1, email: 'testuser@example.com' };
  const mockSecret = 'secret123';
  const mockToken = 'jwt.token.mocked';
  const mockPassword = 'plaintextPassword';
  const mockHash = 'hashedPassword';

  beforeAll(() => {
    process.env.JWT_SECRET = mockSecret;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  describe('generateToken', () => {
    it('should generate a JWT token with correct payload and secret', () => {
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = generateToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        mockSecret,
        { expiresIn: '1h' }
      );
      expect(token).toBe(mockToken);
    });

    it('should throw error if JWT_SECRET is not defined', () => {
      delete process.env.JWT_SECRET;

      expect(() => generateToken(mockPayload)).toThrow('JWT_SECRET is not defined');

      // Restore for other tests
      process.env.JWT_SECRET = mockSecret;
    });
  });

  describe('hashPassword', () => {
    it('should generate a hash from password', async () => {
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await hashPassword(mockPassword);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 'salt');
      expect(result).toBe('hashedPassword');
    });
  });

  describe('comparePassword', () => {
    it('should compare password and hash correctly', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePassword(mockPassword, mockHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockHash);
      expect(result).toBe(true);
    });
  });
}); 
