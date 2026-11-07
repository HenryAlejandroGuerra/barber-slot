/* =====================================================
    backend/src/routes/cita.routes.ts
    Define los endpoints HTTP relacionados con las citas de BarberSlot.
===================================================== */
import { Router } from "express";
import { actualizarEstadoCita, crearCita, obtenerCitas } from "../controllers/cita.controller.js";

const router = Router();

router.get("/", obtenerCitas);
router.post("/", crearCita);
router.patch("/:id", actualizarEstadoCita);

export default router;
