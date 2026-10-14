/* ===========================================
    backend/src/lib/prisma.ts
    Cliente único de Prisma
=========================================== */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient; };
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL no está configurada.");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = globalParaPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalParaPrisma.prisma = prisma;
}
