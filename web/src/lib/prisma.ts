/* ===========================================
    web/src/lib/prisma.ts
    Cliente único de Prisma
=========================================== */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalParaPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// En desarrollo, Next.js recarga los módulos en cada cambio y crearía un
// PrismaClient nuevo por cada recarga, agotando las conexiones a la base.
// Por eso lo guardamos en globalThis y lo reutilizamos.
export const prisma = globalParaPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalParaPrisma.prisma = prisma;
}
