import express from 'express';
import { fetchAllUsers, fetchUserById, updateUserById, deleteUserById } from '#controllers/users.controller.js';
import { requireAuth } from '#middleware/auth.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(requireAuth);

router.get('/', fetchAllUsers);
router.get('/:id', fetchUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;
