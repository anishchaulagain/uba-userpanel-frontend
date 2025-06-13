import { internshipRepo } from '../repositories/internship.repository';
import { userRepo } from '../repositories/user.repository';
import { Internship } from '../database/entities/Internship';

export const createInternshipService = async (data: Partial<Internship> & { userId: number }) => {
  const user = await userRepo.findOneByOrFail({ id: data.userId });
  const internship = internshipRepo.create({ ...data, user });
  return await internshipRepo.save(internship);
};

export const updateInternshipService = async (id: number, data: Partial<Internship>) => {
  const internship = await internshipRepo.findOne({ where: { id }, relations: ['user'] });
  if (!internship) throw new Error('Internship not found');
  internshipRepo.merge(internship, data);
  return await internshipRepo.save(internship);
};

export const deleteInternshipService = async (id: number) => {
  const deleted = await internshipRepo.delete(id);
  if (!deleted.affected) throw new Error('Internship not found');
};
