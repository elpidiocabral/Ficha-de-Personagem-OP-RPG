import express from 'express';
import { getProfile } from '../controllers/userController';

const userRoutes = express.Router();

userRoutes.get('/', getProfile);

export default userRoutes;