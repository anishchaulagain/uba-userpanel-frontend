import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Role, RoleType } from '../entities/Role';
import { hashPassword } from '../../utils/auth.utils';
import { userRepo } from '../../repositories/user.repository';
import { roleRepo } from '../../repositories/role.repository';

export const seedAdminUser = async (dataSource: DataSource): Promise<void> => {
  // Check if superadmin user already exists
  const existingSuperAdmin = await userRepo
    .createQueryBuilder('user')
    .innerJoinAndSelect('user.roles', 'role')
    .where('role.name = :roleName', { roleName: RoleType.SUPERADMIN })
    .getOne();

  if (existingSuperAdmin) {
    console.log('Superadmin user already exists, skipping...');
    return;
  }

  // Find the superadmin role
  const superAdminRole = await roleRepo.findOne({ where: { name: RoleType.SUPERADMIN } });

  if (!superAdminRole) {
    console.error('Superadmin role not found. Please run the role seeder first.');
    return;
  }

  const plainPassword = process.env.ADMIN_PASSWORD;
  if (!plainPassword) {
    throw new Error('Missing ADMIN_PASSWORD in environment variables');
  }

  const email = process.env.EMAIL;
  if (!email) {
    throw new Error('Missing EMAIL in environment variables');
  }

  // Create default superadmin user
  const adminUser = userRepo.create({
    firstName: 'Anish',
    lastName: 'Chaulagain',
    email: email,
    password: await hashPassword(plainPassword),
    roles: [superAdminRole]
  });

  await userRepo.save(adminUser);
  console.log('Superadmin user seeded successfully');
};
