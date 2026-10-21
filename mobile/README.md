# BarberSlot Mobile

Aplicación móvil del proyecto **BarberSlot**, desarrollada con React Native y Expo como parte de la asignatura Diseño y Programación de Software Multiplataforma.

BarberSlot permite representar el flujo de una barbería mediante una aplicación móvil con módulo público y módulo administrativo.

Esta versión corresponde al desarrollo móvil del proyecto y actualmente utiliza datos simulados (mock) para permitir el desarrollo y prueba de las pantallas sin depender de la API REST.

---

## Tecnologías utilizadas

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- React
- Expo Go
- Montserrat
- Git y GitHub

---

## Requisitos

Antes de ejecutar el proyecto se recomienda tener instalado:

- Node.js 22 o superior
- npm
- Git
- Visual Studio Code
- Expo Go en un dispositivo Android o iOS

Android Studio puede utilizarse opcionalmente para ejecutar la aplicación mediante un emulador Android.

---

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Usuarios de prueba tras el seed: `admin@barberslot.test` / `Admin123!` (administrador) y `henry@barberslot.test` / `Barber123!` (barbero).
## Pantallas informativas

La navegación pública incluye Inicio, Barberos, Servicios y Horarios.
Servicios presenta precios, duraciones aproximadas y descripciones; Horarios utiliza el horario publicado en el pie de página: lunes a sábado, de 9:00 a. m. a 5:00 p. m.
Ambas pantallas incluyen botones para volver al inicio y solicitar una reserva en `/reservar` (pantalla de reserva actualmente pendiente de implementación).

### Imagen de Horarios

Reemplaza `mobile/assets/images/horarios/barberia.png` por tu fotografía en formato PNG, conservando el nombre. Se incluye una copia de la imagen de inicio como imagen inicial. Se recomienda una foto horizontal en proporción 16:9; se recorta para llenar el espacio.
Si prefieres otro nombre o formato, actualiza `IMAGES.horarios.barberia` en `mobile/src/constants/images.ts` y la descripción accesible en `mobile/src/app/(public)/horarios.tsx` para que coincida con la imagen.