# BarberSlot Web

Aplicación web de BarberSlot desarrollada con Next.js, React y TypeScript.

La versión web incluye las interfaces públicas para clientes y el módulo administrativo utilizado para gestionar citas, servicios y otras funciones del sistema.

## Tecnologías utilizadas

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Git y GitHub

## Requisitos

Antes de ejecutar el proyecto se necesita:

- Node.js **22.13 o superior dentro de la versión 22**
- npm
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
cd web
```

Instalar las dependencias:

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

## Compilar el proyecto

Para comprobar que la aplicación puede generar una versión de producción:

```bash
npm run build
```

Para iniciar la compilación generada:

```bash
npm start
```

## Estructura general

```text
web/
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── services/
│   └── ...
│
├── package.json
├── tsconfig.json
└── README.md
```

## Módulo público

La aplicación cuenta con interfaces orientadas a los clientes de BarberSlot, entre ellas:

- Página principal.
- Información de barberos.
- Servicios.
- Horarios.
- Reserva de citas.

La identidad visual utiliza principalmente:

- Fondo blanco en las interfaces públicas.
- Header oscuro.
- Color dorado como color principal de la marca.
- Tipografía Montserrat.

## Módulo administrativo

El área administrativa utiliza una interfaz oscura diferenciada del módulo público.

Entre sus pantallas se encuentran:

- Inicio de sesión.
- Panel de inicio.
- Agenda diaria.
- Gestión de servicios.

El Dashboard muestra información como:

- Citas de hoy.
- Nuevas citas.
- Citas canceladas.
- Servicios activos.
- Citas nuevas agendadas.
- Barberos disponibles.

## Backend

La arquitectura final utiliza un backend independiente ubicado en:

```text
../backend
```

La comunicación entre frontend y backend se realiza mediante HTTP y JSON.

Durante desarrollo local, el backend utiliza normalmente:

```text
http://localhost:4000
```

Cuando la migración al backend independiente se encuentre completamente integrada, la URL podrá configurarse mediante una variable pública, por ejemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Las variables reales utilizadas por el proyecto deben mantenerse fuera del repositorio.

## Imágenes

Las imágenes públicas se encuentran en:

```text
public/images/
```

La estructura incluye recursos para:

```text
public/images/
├── admin/
├── barberos/
├── brand/
├── home/
└── social/
```

## Consideraciones

No modificar directamente archivos generados ni subir:

```text
node_modules/
.env
.env.local
```

Las dependencias deben instalarse mediante:

```bash
npm install
```

después de clonar o actualizar el repositorio.

## Proyecto académico

BarberSlot Web forma parte del proyecto desarrollado para la asignatura:

**Diseño y Programación de Software Multiplataforma**