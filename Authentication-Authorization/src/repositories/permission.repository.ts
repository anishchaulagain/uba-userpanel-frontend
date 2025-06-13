// repositories/permission.repository.ts

import { AppDataSource } from '../database/data-source';
import { Permission } from '../database/entities/Permission';

export const permissionRepo = AppDataSource.getRepository(Permission);
