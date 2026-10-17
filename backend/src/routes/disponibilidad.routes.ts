/* ================================================
    backend/src/routes/disponibilidad.routes.ts
================================================ */
import { Router } from "express";
import { obtenerDisponibilidad } from "@/controllers/disponibilidad.controller";

const router = Router();

router.get("/", obtenerDisponibilidad);

export default router;
