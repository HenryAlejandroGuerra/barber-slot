# BarberSlot Mobile

Aplicación móvil de BarberSlot desarrollada con React Native y Expo.

Esta versión corresponde a la Etapa 3 del proyecto y adapta la experiencia de BarberSlot a dispositivos móviles, manteniendo la identidad visual utilizada en la versión web.

Actualmente la aplicación móvil utiliza datos mock, por lo que puede ejecutarse y demostrarse sin conexión al backend.

## Tecnologías utilizadas

- React Native
- Expo SDK 57
- Expo Router
- React
- TypeScript
- Expo Go
- Montserrat
- Git y GitHub

## Requisitos

Antes de ejecutar el proyecto se recomienda tener instalado:

- Node.js **22.13 o superior dentro de la versión 22**
- npm
- Git
- Visual Studio Code o editor equivalente
- Expo Go compatible con SDK 57 para pruebas en dispositivo físico

Opcionalmente:

- Android Studio para utilizar un emulador Android

Verificar Node.js:

```bash
node --version
```

Verificar npm:

```bash
npm --version
```

## Instalación

Desde la raíz del repositorio:

```bash
cd mobile
```

Instalar dependencias:

```bash
npm install
```

## Ejecutar la aplicación

Desde la carpeta `mobile`:

```bash
npm start
```

También puede utilizarse:

```bash
npx expo start
```

Si existen problemas relacionados con la caché:

```bash
npx expo start --clear
```

Después se puede abrir el proyecto desde Expo Go mediante el código QR mostrado en la terminal.

## Importante

Los comandos de Expo deben ejecutarse desde:

```text
barber-slot/mobile
```

y no desde la raíz:

```text
barber-slot/
```

Ejecutar `npx expo start` desde la raíz puede provocar que `npx` intente instalar una versión diferente de Expo.

## Expo SDK

Este proyecto utiliza:

```text
Expo SDK 57
```

Los integrantes del grupo deben conservar esta versión para evitar incompatibilidades entre el proyecto y Expo Go.

No se debe actualizar Expo de forma individual sin coordinarlo previamente con el equipo.

## Usuarios de prueba

La autenticación de este avance utiliza usuarios mock.

### Administrador

```text
Correo: admin@barberslot.test
Contraseña: Admin123!
Rol: administrador
```

### Barbero

```text
Correo: henry@barberslot.test
Contraseña: Barber123!
Rol: barbero
```

Estos usuarios son únicamente para pruebas de la versión móvil mientras no se encuentre conectada al backend.

## Estructura principal

```text
mobile/
├── assets/
│   └── images/
│       ├── admin/
│       ├── barberos/
│       ├── brand/
│       ├── home/
│       └── social/
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   └── admin/
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── constants/
│   ├── contexts/
│   ├── data/
│   │   └── mock/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## Navegación

La aplicación utiliza Expo Router.

Las rutas principales incluyen:

```text
/                    Landing pública
/reservar             Reserva

/admin                 Login administrativo
/admin/inicio          Dashboard administrativo
/admin/agenda          Agenda diaria
/admin/servicios       Gestión de servicios
```

La carpeta:

```text
(public)
```

es un Route Group utilizado para organizar las rutas públicas y no forma parte de la URL.

## Diseño visual

### Parte pública

Las interfaces públicas mantienen:

- Fondo blanco.
- Header oscuro.
- Elementos dorados.
- Fuente Montserrat.
- Identidad visual equivalente a BarberSlot Web.

### Parte administrativa

Las interfaces administrativas utilizan:

- Fondo oscuro.
- Tarjetas oscuras.
- Bordes dorados.
- Texto blanco y gris.
- Elementos destacados en dorado.
- Fuente Montserrat.

El Dashboard administrativo móvil conserva la información principal del Dashboard web, adaptándola a una distribución vertical.

## Datos mock

Durante este avance se utilizan datos simulados para permitir el desarrollo independiente del backend.

Actualmente pueden existir mocks para:

- Usuarios.
- Métricas del Dashboard.
- Citas.
- Barberos disponibles.
- Servicios.
- Agenda.

En etapas posteriores los servicios mock serán sustituidos por peticiones a la API REST.

## Estado actual

Entre las funcionalidades implementadas se encuentran:

- Navegación con Expo Router.
- Identidad visual BarberSlot.
- Fuente Montserrat.
- Login administrativo.
- Validaciones de formulario.
- Usuarios de prueba.
- Dashboard administrativo.
- Acceso a Agenda Diaria.
- Acceso a Servicios.
- Cierre de sesión.
- Interfaces públicas iniciales.

## Integración futura

La aplicación móvil utilizará el mismo backend que BarberSlot Web:

```text
Mobile
   │
   ▼
API REST
   │
   ▼
PostgreSQL
```

La aplicación móvil no accederá directamente a Prisma ni a PostgreSQL.

## Proyecto académico

BarberSlot Mobile forma parte de la Etapa 3 del proyecto de la asignatura:

**Diseño y Programación de Software Multiplataforma**