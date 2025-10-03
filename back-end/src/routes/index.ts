import express from 'express';
import { ensureAuthenticated } from '../middleware/auth';

import exampleRoutes from './exampleRoutes';
import authRoutes from './authRoutes'
import userRoutes from './userRoutes';

const router = express.Router();

router.use((req, res, next) => {
    if (req.path.startsWith('/auth')) return next();
    return ensureAuthenticated(req, res, next);
})

router.use('/example', exampleRoutes);
router.use('/profile', userRoutes);
router.use('/auth', authRoutes);

export default router;