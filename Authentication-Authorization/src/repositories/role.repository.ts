import { AppDataSource } from "../database/data-source";
import { Role } from "../database/entities/Role";

export const roleRepo = AppDataSource.getRepository(Role);