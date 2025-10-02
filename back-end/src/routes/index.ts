import express from 'express';

import exampleRoutes from './exampleRoutes';

const router = express.Router();

router.use('/examples', exampleRoutes)

export default router;