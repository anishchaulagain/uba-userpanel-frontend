import { AppDataSource } from '../database/data-source';
import { User } from '../database/entities/User';

export const userRepo = AppDataSource.getRepository(User);