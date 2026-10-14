/* ================================================
    backend/src/app.ts
    Configuración principal de Express
================================================ */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import barberoRoutes from "@/routes/barbero.routes";
import { manejarError } from "@/middleware/error.middleware";
import servicioRoutes from "@/routes/servicio.routes";

const app = express();

/* ========================================
    Seguridad básica
======================================== */
app.use(helmet());

/* ========================================
    CORS
======================================== */
app.use(cors({
        origin: process.env.WEB_ORIGIN ?? "http://localhost:3000", credentials: true
    })
);

/* ========================================
    JSON
======================================== */
app.use(express.json({limit: "1mb"}));

/* ========================================
    Health check
======================================== */
app.get(
    "/api/health",
    (request, response) => {
        response.json({
            estado: "ok",
            servicio: "BarberSlot API",
        });
    }
);

/* ========================================
    Rutas
======================================== */
app.use("/api/barberos", barberoRoutes);
app.use("/api/servicios", servicioRoutes);

/* ========================================
    Middleware de errores
======================================== */
app.use(manejarError);

export default app;
