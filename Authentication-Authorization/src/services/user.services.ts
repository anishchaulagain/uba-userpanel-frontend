import { userRepo } from '../repositories/user.repository';
import { User } from '../database/entities/User';

export const createUserService = async (data: Partial<User>) => {
  const existing = await userRepo.findOne({ where: { email: data.email } });
  if (existing) throw new Error('User with this email already exists');
  const user = userRepo.create(data);
  return await userRepo.save(user);
};

export const getUsersWithInternshipsService = () => userRepo.find({ relations: ['internships', 'roles'] });

export const getOneUserWithInternshipsService = async (id: number) => {
  return await userRepo.findOne({ where: { id }, relations: ['internships'] });
};

export const updateUserService = async (id: number, data: Partial<User>) => {
  const user = await userRepo.findOneBy({ id });
  
  if (!user) throw new Error('User not found');0
  userRepo.merge(user, data);
  return await userRepo.save(user);
};

export const deleteUserService = async (id: number) => {
  const deleted = await userRepo.delete(id);
  if (!deleted.affected) throw new Error('User not found');
};

export const getUsersWithInternshipCountService = async () => {
  return await userRepo.query(`
    WITH internship_count AS (
      SELECT userId, COUNT(*) AS internshipCount
      FROM internship
      WHERE userId IS NOT NULL
      GROUP BY userId
    )
    SELECT u.id, u.firstName, u.lastName, u.email, u.createdAt, ic.internshipCount
    FROM user u
    INNER JOIN internship_count ic ON u.id = ic.userId
    ORDER BY ic.internshipCount DESC;
  `);
};
