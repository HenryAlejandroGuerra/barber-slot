# BarberSlot Backend

Backend independiente de BarberSlot desarrollado con Node.js, Express, TypeScript y Prisma ORM.

Su objetivo es centralizar el acceso a datos y la lógica de negocio para que tanto BarberSlot Web como BarberSlot Mobile puedan consumir la misma API REST.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Neon
- Zod
- bcrypt
- Git y GitHub

## Requisitos

Antes de ejecutar el backend se necesita:

- Node.js **22.13 o superior dentro de la versión 22**
- npm
- PostgreSQL accesible mediante una URL de conexión
- Git
- Visual Studio Code o editor equivalente

Verificar:

```bash
node --version
npm --version
```

## Instalación

Desde la raíz del repositorio:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo:

```text
backend/.env
```

tomando como referencia:

```text
backend/.env.example
```

Una configuración local puede contener:

```env
DATABASE_URL="postgresql://..."
PORT=4000
WEB_ORIGIN="http://localhost:3000"
```

Cuando se implemente completamente la autenticación u otros servicios también pueden utilizarse variables adicionales, por ejemplo:

```env
SESSION_SECRET="..."
RESEND_API_KEY="..."
```

Nunca deben subirse credenciales reales al repositorio.

El archivo:

```text
.env
```

debe permanecer en `.gitignore`.

## Prisma

El proyecto utiliza Prisma ORM para acceder a PostgreSQL.

El schema se encuentra en:

```text
prisma/schema.prisma
```

La configuración de Prisma se encuentra en:

```text
prisma.config.ts
```

## Generar Prisma Client

Después de instalar las dependencias ejecutar:

```bash
npx prisma generate --config=prisma.config.ts
```

También puede utilizarse:

```bash
npm run prisma:generate
```

El cliente generado no necesita versionarse si su carpeta está incluida en `.gitignore`.

## Ejecutar el backend

En desarrollo:

```bash
npm run dev
```

El servidor utiliza normalmente:

```text
http://localhost:4000
```

## Comprobar el servidor

Endpoint de salud:

```text
GET http://localhost:4000/api/health
```

Otros endpoints implementados o previstos incluyen:

```text
/api/barberos
/api/servicios
/api/disponibilidad
/api/citas
/api/auth
```

La disponibilidad final de cada endpoint depende del avance actual del backend.

## TypeScript

Para comprobar los tipos sin generar archivos:

```bash
npm run typecheck
```

Se recomienda ejecutar este comando antes de realizar un commit con cambios importantes del backend.

## Scripts principales

El `package.json` incluye scripts similares a:

```json
{
    "scripts": {
        "dev": "tsx watch src/server.ts",
        "start": "tsx src/server.ts",
        "typecheck": "tsc --noEmit",
        "prisma:generate": "prisma generate --config=prisma.config.ts",
        "postinstall": "prisma generate --config=prisma.config.ts"
    }
}
```

## Base de datos

BarberSlot utiliza PostgreSQL.

La base de datos puede estar alojada mediante Neon u otro servicio PostgreSQL compatible.

La arquitectura es:

```text
Web ───────┐
           │
           ▼
       API REST
       Express
           │
         Prisma
           │
           ▼
      PostgreSQL
           ▲
           │
Mobile ────┘
```

Web y Mobile nunca deben contener directamente las credenciales de PostgreSQL.

## Migraciones

Las migraciones se encuentran en:

```text
prisma/migrations/
```

Estas migraciones sí forman parte del repositorio.

Durante desarrollo pueden crearse migraciones mediante:

```bash
npx prisma migrate dev --name nombre_migracion --config=prisma.config.ts
```

No ejecutar:

```bash
prisma migrate reset
```

sobre una base de datos compartida sin autorización, ya que puede eliminar los datos existentes.

Para entornos de despliegue se utiliza el flujo de migraciones correspondiente a producción.

## Seed

El proyecto puede contener:

```text
prisma/seed.ts
```

Este archivo se utiliza para cargar datos iniciales o de prueba.

Debe revisarse antes de ejecutarse contra una base compartida, especialmente si contiene operaciones que eliminan datos existentes.

## Estructura principal

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── controllers/
│   ├── generated/
│   ├── lib/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

## Separación de responsabilidades

El backend está organizado conceptualmente en:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Prisma
   ↓
PostgreSQL
```

Las rutas reciben las solicitudes HTTP.

Los controllers procesan los datos de entrada y salida.

Los services contienen la lógica de negocio.

Prisma administra el acceso a la base de datos.

## Estado actual

Entre los elementos desarrollados se encuentran:

- Servidor Express.
- Endpoint de salud.
- Consulta de barberos.
- CRUD de servicios.
- Integración con Prisma.
- PostgreSQL.
- Validación mediante Zod.
- Preparación del módulo de disponibilidad.
- Preparación para citas y autenticación.

## Seguridad

No deben almacenarse en el repositorio:

- `DATABASE_URL`
- contraseñas
- claves de servicios externos
- tokens
- secretos de sesión

Todas estas configuraciones deben administrarse mediante variables de entorno.

## Proyecto académico

BarberSlot Backend forma parte del proyecto desarrollado para la asignatura:

**Diseño y Programación de Software Multiplataforma**