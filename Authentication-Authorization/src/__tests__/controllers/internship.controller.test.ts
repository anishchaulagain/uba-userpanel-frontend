import { Request, Response } from 'express';
import * as internshipService from '../../services/internship.service';
import * as internshipController from '../../controllers/internship.controller';
import { handleError } from '../../utils/helper.errorhandler';

jest.mock('../../services/internship.service');
jest.mock('../../utils/helper.errorhandler');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Internship Controller', () => {
  const mockInternship = {
    joinedDate: new Date('2024-01-01'),
    completionDate: new Date('2024-06-01'),
    isCertified: true,
    mentorName: 'Dummy Mentor',
    userId: 18
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createInternship - success', async () => {
    const req = { body: mockInternship } as Request;
    const res = mockResponse();

    (internshipService.createInternshipService as jest.Mock).mockResolvedValue(mockInternship);

    await internshipController.createInternship(req, res);

    expect(internshipService.createInternshipService).toHaveBeenCalledWith(mockInternship);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internship created successfully for user',
      internship: mockInternship,
    });
  });

  test('createInternship - error handling', async () => {
    const req = { body: mockInternship } as Request;
    const res = mockResponse();
    const err = new Error('DB error');

    (internshipService.createInternshipService as jest.Mock).mockRejectedValue(err);

    await internshipController.createInternship(req, res);

    expect(handleError).toHaveBeenCalledWith(res, err, 'Error creating internship');
  });

  test('updateInternship - success', async () => {
    const req = { params: { id: '1' }, body: mockInternship } as unknown as Request;
    const res = mockResponse();

    (internshipService.updateInternshipService as jest.Mock).mockResolvedValue(mockInternship);

    await internshipController.updateInternship(req, res);

    expect(internshipService.updateInternshipService).toHaveBeenCalledWith(1, mockInternship);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInternship);
  });

  test('updateInternship - error handling', async () => {
    const req = { params: { id: '1' }, body: mockInternship } as unknown as Request;
    const res = mockResponse();
    const err = new Error('DB error');

    (internshipService.updateInternshipService as jest.Mock).mockRejectedValue(err);

    await internshipController.updateInternship(req, res);

    expect(handleError).toHaveBeenCalledWith(res, err, 'Error updating internship');
  });

  test('deleteInternship - success', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();

    (internshipService.deleteInternshipService as jest.Mock).mockResolvedValue(undefined);

    await internshipController.deleteInternship(req, res);

    expect(internshipService.deleteInternshipService).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internship deleted successfully' });
  });

  test('deleteInternship - error handling', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = mockResponse();
    const err = new Error('DB error');

    (internshipService.deleteInternshipService as jest.Mock).mockRejectedValue(err);

    await internshipController.deleteInternship(req, res);

    expect(handleError).toHaveBeenCalledWith(res, err, 'Error deleting internship');
  });
});
