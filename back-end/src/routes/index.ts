import express from 'express';

import exampleRoutes from './exampleRoutes';
import userRoutes from './user';

const router = express.Router();

// Rotas existentes
router.use('/examples', exampleRoutes);

// Novas rotas de usuário
router.use('/api/user', userRoutes);

// Rota de health check
router.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando',
    timestamp: new Date().toISOString()
  });
});

export default router;