/* ================================================
    backend/src/routes/barbero.routes.ts
================================================ */
import { Router } from "express";
import { obtenerBarberos } from "../controllers/barbero.controller.js";

const router = Router();

router.get("/", obtenerBarberos);

export default router;
