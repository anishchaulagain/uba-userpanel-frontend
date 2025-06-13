import { AppDataSource } from '../database/data-source';
import { Internship } from '../database/entities/Internship';

export const internshipRepo = AppDataSource.getRepository(Internship);