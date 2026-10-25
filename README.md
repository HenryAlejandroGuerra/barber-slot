# BarberSlot

BarberSlot es un proyecto académico orientado a la gestión de citas y servicios de una barbería. El sistema está dividido en una aplicación web, una aplicación móvil y un backend independiente que permitirá compartir la misma lógica y fuente de datos entre ambas plataformas.

El proyecto fue desarrollado para la asignatura **Diseño y Programación de Software Multiplataforma**.

## Estructura del repositorio

El repositorio utiliza una estructura tipo monorepo:

```text
barber-slot/
├── backend/
│   └── API REST, lógica de negocio y acceso a PostgreSQL
│
├── web/
│   └── Aplicación web desarrollada con Next.js
│
├── mobile/
│   └── Aplicación móvil desarrollada con React Native y Expo
│
├── docs/
│   └── Documentación del proyecto
│
└── README.md
```

Cada carpeta corresponde a un proyecto independiente y administra sus propias dependencias mediante su respectivo `package.json`.

## Arquitectura general

La arquitectura prevista para BarberSlot es:

```text
BarberSlot Web
    Next.js
       │
       │ HTTP / JSON
       ▼
BarberSlot Backend
 Express + Prisma
       │
       ▼
PostgreSQL / Neon
       ▲
       │
       │ HTTP / JSON
BarberSlot Mobile
React Native + Expo
```

Durante el primer avance móvil, la aplicación React Native utiliza datos mock para poder desarrollar y probar las interfaces sin depender de la API REST.

## Requisitos generales

Para trabajar con el repositorio se recomienda tener instalado:

- Node.js **22.13 o superior dentro de la versión 22**
- npm
- Git
- Visual Studio Code o un editor equivalente

Verificar las versiones instaladas:

```bash
node --version
npm --version
git --version
```

Se recomienda que todos los integrantes del equipo utilicen la misma versión principal de Node.js para reducir diferencias entre entornos.

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd barber-slot
```

## Proyectos disponibles

### Aplicación Web

Ubicación:

```text
web/
```

Tecnologías principales:

- Next.js
- React
- TypeScript
- Tailwind CSS

Instalación:

```bash
cd web
npm install
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

Consultar `web/README.md` para más información.

### Aplicación Mobile

Ubicación:

```text
mobile/
```

Tecnologías principales:

- React Native
- Expo SDK 57
- Expo Router
- TypeScript

Instalación:

```bash
cd mobile
npm install
npm start
```

La aplicación puede probarse mediante Expo Go en un dispositivo compatible.

Consultar `mobile/README.md` para más información.

### Backend

Ubicación:

```text
backend/
```

Tecnologías principales:

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL

Instalación:

```bash
cd backend
npm install
npx prisma generate --config=prisma.config.ts
npm run dev
```

El servidor utiliza normalmente:

```text
http://localhost:4000
```

Consultar `backend/README.md` para conocer las variables de entorno y configuración adicional.

## Instalación de dependencias

No se debe ejecutar un único `npm install` desde la raíz del repositorio.

Cada proyecto administra sus dependencias por separado:

```bash
cd web
npm install
```

```bash
cd mobile
npm install
```

```bash
cd backend
npm install
```

## Flujo de trabajo con Git

Antes de comenzar cambios:

```bash
git switch main
git pull origin main
```

Cada integrante debe crear o utilizar su propia rama de trabajo cuando corresponda:

```bash
git switch -c nombre-rama
```

Para guardar cambios:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

No deben subirse al repositorio:

- `node_modules`
- archivos `.env`
- credenciales
- claves privadas
- archivos generados que estén incluidos en `.gitignore`

## Estado actual

El proyecto contiene:

- Versión web de BarberSlot.
- Backend independiente en proceso de integración.
- Versión móvil desarrollada con React Native y Expo.
- Navegación pública y administrativa.
- Login móvil con validaciones y usuarios mock.
- Dashboard administrativo adaptado a dispositivos móviles.
- Datos mock para permitir el desarrollo móvil sin conexión al backend.

## Proyecto académico

**Asignatura:** Diseño y Programación de Software Multiplataforma

**Proyecto:** BarberSlot