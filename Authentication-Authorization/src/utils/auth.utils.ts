import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// to Generate JWT token
export const generateToken = (payload: any) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

// Hash password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare password with hash
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};