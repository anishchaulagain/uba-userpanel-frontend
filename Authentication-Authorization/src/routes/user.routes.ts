import express from 'express';
import { createUser, deleteUser, getOneUserWithInternships, getUsersWithInternshipCount, getUsersWithInternships, updateUser } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { userSchema } from '../validators/user.validator';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { RoleType } from '../database/entities/Role';
import { authorizePermission } from '../middleware/permission.middleware';


const router = express.Router();


//Protected Routes
router.post('/', authenticate, validate(userSchema),  authorizePermission(['create_user']),  createUser);

router.get('/', authenticate, authorizePermission(['read_user']) ,  getUsersWithInternships);

//router.get('/:id', authenticate, authorize([RoleType.USER, RoleType.MENTOR, RoleType.ADMIN]),  getOneUserWithInternships);

//unprotected Route
router.get('/count', getUsersWithInternshipCount); 


router.put('/:id', authenticate, authorize([RoleType.SUPERADMIN, RoleType.ADMIN]),  validate(userSchema), updateUser);
router.delete('/:id', authenticate,  authorize([RoleType.SUPERADMIN]),  deleteUser);

export default router;