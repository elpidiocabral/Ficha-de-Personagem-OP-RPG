import express from "express";

import { createFicha, deleteFicha, getFichasByUserId, updateFicha } from "../controllers/fichaController";

const fichaRoutes = express.Router();

fichaRoutes.post("/", createFicha);
fichaRoutes.get("/", getFichasByUserId);
fichaRoutes.put("/:id", updateFicha);
fichaRoutes.delete("/:id", deleteFicha);

export default fichaRoutes;