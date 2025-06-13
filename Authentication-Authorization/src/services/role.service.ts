
import { RoleType } from '../database/entities/Role';
import { roleRepo } from '../repositories/role.repository';
import { userRepo } from '../repositories/user.repository';

export const getAllRolesService = async () => {
  return await roleRepo.find();
};

export const assignRoleService = async (userId: number, roleName: RoleType) => {
  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ['roles']
  });

  if (!user) throw new Error('User not found');

  if (!Object.values(RoleType).includes(roleName)) {
    throw new Error('Invalid role name');
  }

  const role = await roleRepo.findOne({ where: { name: roleName } });

  if (!role) throw new Error('Role not found');

  if (user.roles.some(r => r.name === roleName)) {
    throw new Error('User already has this role');
  }

  user.roles.push(role);
  await userRepo.save(user);

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName ?? ''}`.trim(),
    email: user.email,
    roles: user.roles.map(r => r.name)
  };
};

export const removeRoleService = async (userId: number, roleName: RoleType) => {
  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ['roles'],
  });

  if (!user) throw new Error('User not found');

  const roleIndex = user.roles.findIndex(role => role.name === roleName);
  if (roleIndex === -1) throw new Error(`User does not have the '${roleName}' role`);

  user.roles.splice(roleIndex, 1);
  await userRepo.save(user);

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    roles: user.roles.map(r => r.name),
  };
};
