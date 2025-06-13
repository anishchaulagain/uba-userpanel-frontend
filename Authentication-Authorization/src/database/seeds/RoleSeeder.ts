import { DataSource } from 'typeorm';
import { Role, RoleType } from '../entities/Role';
import { roleRepo } from '../../repositories/role.repository';

export const seedRoles = async (dataSource: DataSource): Promise<Role[]> => {
  
  
  const existingRoles = await roleRepo.find();
  if (existingRoles.length > 0) {
    console.log('Roles already seeded, skipping...');
    return existingRoles;
  }

  //default roles
  const roles = [
    {
      name: RoleType.SUPERADMIN,
      description: 'Administrator with full access'
    },
    {
      name: RoleType.ADMIN,
      description: 'Mentor with ability to guide users'
    },
    {
      name: RoleType.USER,
      description: 'Standard user with basic access'
    }
  ];

  const savedRoles = await roleRepo.save(roles);
  console.log('Roles seeded successfully');
  return savedRoles;
};
