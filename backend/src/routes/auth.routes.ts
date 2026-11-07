/* =====================================================
    backend/src/routes/auth.routes.ts
    Define los endpoints HTTP relacionados con autenticación y usuarios de BarberSlot.
===================================================== */
import { Router } from "express";
import { cerrarSesion, iniciarSesion, obtenerSesionActual, registrarUsuario } from "../controllers/auth.controller.js";
import { autenticar, exigirAdministrador } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", iniciarSesion);
router.get("/sesion", autenticar, obtenerSesionActual);
router.post("/logout", autenticar, cerrarSesion);
router.post("/registro", autenticar, exigirAdministrador, registrarUsuario);

export default router;
