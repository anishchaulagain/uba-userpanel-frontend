import { createInternshipService, updateInternshipService, deleteInternshipService } from '../../services/internship.service';
import { internshipRepo } from '../../repositories/internship.repository'; 
import { userRepo } from '../../repositories/user.repository'; 
import { Internship } from '../../database/entities/Internship'; 
import { User } from '../../database/entities/User';

jest.mock('../../repositories/internship.repository');
jest.mock('../../repositories/user.repository');

describe('Internship Services', () => {
  const mockUser: User = {
  id: 1,
  firstName: 'Anish',
  lastName: 'Chaulagain',
  email: 'anish@example.com',
  password: 'hashedPassword',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  internships: [] as Internship[],
  roles: [],
};

const mockInternship: Internship = {
  id: 1,
  joinedDate: new Date('2024-01-01'),
  completionDate: new Date('2024-06-01'),
  isCertified: true,
  mentorName: 'Dummy Mentor',
  user: mockUser,
};
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createInternshipService', () => {
    it('should create and save an internship', async () => {
      (userRepo.findOneByOrFail as jest.Mock).mockResolvedValue(mockUser);
      (internshipRepo.create as jest.Mock).mockReturnValue(mockInternship);
      (internshipRepo.save as jest.Mock).mockResolvedValue(mockInternship);

      const data = { title: 'Test Internship', userId: 1 };
      const result = await createInternshipService(data);

      expect(userRepo.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
      expect(internshipRepo.create).toHaveBeenCalledWith({ ...data, user: mockUser });
      expect(internshipRepo.save).toHaveBeenCalledWith(mockInternship);
      expect(result).toEqual(mockInternship);
    });
  });

  describe('updateInternshipService', () => {
  it('should update and save the internship', async () => {
    const updatedData = { mentorName: 'Updated Mentor', isCertified: false };
    const mergedInternship = { ...mockInternship, ...updatedData };

    (internshipRepo.findOne as jest.Mock).mockResolvedValue(mockInternship);
    (internshipRepo.merge as jest.Mock).mockImplementation((target, source) => Object.assign(target, source));
    (internshipRepo.save as jest.Mock).mockResolvedValue(mergedInternship);

    const result = await updateInternshipService(1, updatedData);

    expect(internshipRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user'] });
    expect(internshipRepo.merge).toHaveBeenCalledWith(mockInternship, updatedData);
    expect(internshipRepo.save).toHaveBeenCalledWith(mergedInternship);
    expect(result.mentorName).toBe('Updated Mentor');
    expect(result.isCertified).toBe(false);
  });

  it('should throw error if internship not found', async () => {
    (internshipRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(updateInternshipService(999, {})).rejects.toThrow('Internship not found');
  });
});


  describe('deleteInternshipService', () => {
    it('should delete the internship if it exists', async () => {
      (internshipRepo.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(deleteInternshipService(1)).resolves.toBeUndefined();
      expect(internshipRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error if internship not found', async () => {
      (internshipRepo.delete as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(deleteInternshipService(999)).rejects.toThrow('Internship not found');
    });
  });
});
