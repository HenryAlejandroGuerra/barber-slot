/* ===============================================================
    backend/prisma.config.ts
    Configuración principal de Prisma para migraciones, conexión y carga de datos iniciales.
=============================================================== */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "tsx prisma/seed.ts"
    },
    datasource: {
        url: env("DATABASE_URL")
    }
});
