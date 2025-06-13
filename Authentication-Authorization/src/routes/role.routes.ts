import express from 'express';
import { getRoles, assignRole, removeRole } from '../controllers/role.controller'
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { RoleType } from '../database/entities/Role';

const router = express.Router();

// Get all roles 
router.get('/', authenticate, getRoles);

// Admin only routes
router.post('/assign', authenticate, authorize([RoleType.SUPERADMIN]), assignRole
);

router.post('/remove', authenticate, authorize([RoleType.SUPERADMIN]), removeRole
);

export default router;