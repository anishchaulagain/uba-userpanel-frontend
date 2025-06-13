import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Internship } from './entities/Internship';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ,
  port: parseInt(process.env.DB_PORT || '3307'),
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: 'internship_app' ,
  synchronize: false, // Set to false in production
  logging: true,
  entities: [User, Internship],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};