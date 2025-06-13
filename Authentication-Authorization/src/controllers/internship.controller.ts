import { Request, Response } from 'express';
import * as internshipService from '../services/internship.service';
import { handleError } from '../utils/helper.errorhandler';

export const createInternship = async (req: Request, res: Response) => {
  try {
    const saved = await internshipService.createInternshipService(req.body);
    res.status(201).json({
      message: `Internship created successfully for user`,
      internship: saved,
    });
  } catch (err) {
    handleError(res, err, 'Error creating internship');
  }
};

export const updateInternship = async (req: Request, res: Response) => {
  try {
    const updated = await internshipService.updateInternshipService(Number(req.params.id), req.body);
    res.status(200).json(updated);
  } catch (err) {
    handleError(res, err, 'Error updating internship');
  }
};

export const deleteInternship = async (req: Request, res: Response) => {
  try {
    await internshipService.deleteInternshipService(Number(req.params.id));
    res.status(200).json({ message: 'Internship deleted successfully' });
  } catch (err) {
    handleError(res, err, 'Error deleting internship');
  }
};
