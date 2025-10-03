import express from 'express';

import { authCallback, authFailure } from '../controllers/authController';

import passport from '../config/passport';

const authRoutes = express.Router();

authRoutes.get('/discord', passport.authenticate('discord'));
authRoutes.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/auth/discord/failure',
    successRedirect: '/auth/discord/success',
}));

authRoutes.get('/discord/success', authCallback);
authRoutes.get('/discord/failure', authFailure);

export default authRoutes;