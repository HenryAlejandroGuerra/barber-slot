/* ================================================
    backend/src/routes/servicio.routes.ts
================================================ */
import { Router } from "express";
import { actualizarServicio, crearServicio, desactivarServicio, obtenerServicios } from "@/controllers/servicio.controller";

const router = Router();

router.get("/", obtenerServicios);
router.post("/", crearServicio);
router.put("/:id", actualizarServicio);
router.delete("/:id", desactivarServicio);

export default router;
