
import { DataSource } from 'typeorm';
import { Permission } from '../entities/Permission';
import { permissionRepo } from '../../repositories/permission.repository';

export const seedPermissions = async (dataSource: DataSource): Promise<Permission[]> => {

  const existingPermissions = await permissionRepo.find();
  if (existingPermissions.length > 0) {
    console.log('Permissions already seeded, skipping...');
    return existingPermissions;
  }

  const permissions = [
    { name: 'create_user', description: 'Create a new user' },
    { name: 'read_user', description: 'Read user data' },
    { name: 'update_user', description: 'Update user data' },
    { name: 'delete_user', description: 'Delete user' },
  ];

  const savedPermissions = await permissionRepo.save(permissions);
  console.log('Permissions seeded successfully');
  return savedPermissions;
};
