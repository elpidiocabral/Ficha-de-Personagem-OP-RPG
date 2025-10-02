import express from 'express'

import { getAllExamples, postExample } from '../controllers/exampleController';

const exampleRoutes = express.Router();

exampleRoutes.get('/', getAllExamples);
exampleRoutes.post('/', postExample);

export default exampleRoutes;

