-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('administrador', 'barbero');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('pendiente', 'confirmada', 'cancelada');

-- CreateTable
CREATE TABLE "barbero" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "imagen_url" TEXT,

    CONSTRAINT "barbero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "duracion_minutos" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cita" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "barbero_id" TEXT NOT NULL,
    "servicio_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMPTZ NOT NULL,
    "fecha_fin" TIMESTAMPTZ NOT NULL,
    "estado" "EstadoCita" NOT NULL DEFAULT 'pendiente',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contra_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "barbero_id" TEXT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- AddForeignKey
ALTER TABLE "cita" ADD CONSTRAINT "cita_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cita" ADD CONSTRAINT "cita_barbero_id_fkey" FOREIGN KEY ("barbero_id") REFERENCES "barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cita" ADD CONSTRAINT "cita_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_barbero_id_fkey" FOREIGN KEY ("barbero_id") REFERENCES "barbero"("id") ON DELETE SET NULL ON UPDATE CASCADE;
