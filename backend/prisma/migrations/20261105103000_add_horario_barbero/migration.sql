/* =====================================================
    backend/prisma/migrations/20261105103000_add_horario_barbero/migration.sql
    Agrega los días de semana y los horarios asociados
    a cada barbero.
===================================================== */

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM (
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo'
);

-- CreateTable
CREATE TABLE "horario_barbero" (
    "id" TEXT NOT NULL,
    "barbero_id" TEXT NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_inicio" TIME(0) NOT NULL,
    "hora_fin" TIME(0) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "horario_barbero_pkey"
        PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX
    "horario_barbero_barbero_id_dia_semana_key"
ON "horario_barbero"(
    "barbero_id",
    "dia_semana"
);

-- AddForeignKey
ALTER TABLE "horario_barbero"
ADD CONSTRAINT "horario_barbero_barbero_id_fkey"
FOREIGN KEY ("barbero_id")
REFERENCES "barbero"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;