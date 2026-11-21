/* ================================================
    backend/src/app.ts
    Configuración principal de Express
================================================ */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import barberoRoutes from "./routes/barbero.routes.js";
import servicioRoutes from "./routes/servicio.routes.js";
import disponibilidadRoutes from "./routes/disponibilidad.routes.js";
import citaRoutes from "./routes/cita.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { manejarError } from "./middleware/error.middleware.js";

const app = express();

/* Seguridad básica */
app.use(helmet());

/* CORS */
const origenesPermitidos = ["http://localhost:3000", process.env.WEB_ORIGIN].filter((origen): origen is string => Boolean(origen));

app.use(cors({
    origin(origin, callback) {
        if (!origin || origenesPermitidos.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }, credentials: true
}));

/* JSON */
app.use(express.json({limit: "1mb"}));

/* Health check */
app.get("/api/health", (request, response) => {
    response.json({
        estado: "ok",
        servicio: "BarberSlot API",
    });
});

/* Rutas */
app.use("/api/auth", authRoutes);
app.use("/api/barberos", barberoRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);
app.use("/api/citas", citaRoutes);

/* Middleware de errores */
app.use(manejarError);

export default app;
