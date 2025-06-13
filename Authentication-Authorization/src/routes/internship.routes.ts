import express from 'express';
import { createInternship, deleteInternship, updateInternship } from '../controllers/internship.controller';
import { validate } from '../middleware/validate';
import { internshipSchema } from '../validators/internship.validator';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { RoleType } from '../database/entities/Role';

const router = express.Router();

// Protected routes
router.post('/', authenticate, authorize([RoleType.USER, RoleType.ADMIN, RoleType.SUPERADMIN]), validate(internshipSchema), createInternship);
router.put('/:id', authenticate, authorize([RoleType.ADMIN, RoleType.SUPERADMIN]),  validate(internshipSchema), updateInternship);
router.delete('/:id', authenticate, authorize([RoleType.ADMIN]),  deleteInternship);

export default router;