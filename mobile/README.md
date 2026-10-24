# BarberSlot Mobile

Aplicación móvil del proyecto **BarberSlot**, desarrollada con React Native y Expo como parte de la asignatura Diseño y Programación de Software Multiplataforma.

BarberSlot permite gestionar reservas de una barbería mediante una aplicación móvil con módulo público y módulo administrativo.

El flujo público de reservas se conecta a la API REST de la aplicación web para consultar barberos, servicios y horarios, y registrar las citas.

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

### Ejecutar la app con la API

La app móvil necesita que la API de Next.js esté ejecutándose en `web/`, además del servidor de Expo. En una terminal, desde `web/`, inicia la API:

```bash
npm run dev -- --hostname 0.0.0.0
```

En otra terminal, desde `mobile/`, inicia Expo:

```bash
npm start
```

Si usas Expo Go en un teléfono, conecta el teléfono y la computadora a la misma red Wi-Fi y permite conexiones entrantes al puerto 3000 en el firewall. La app obtiene la dirección de la computadora desde Expo. Si la detección automática no funciona, crea `mobile/.env` con la IP local de la computadora:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.31:3000
```

Reemplaza `192.168.1.31` por la dirección IPv4 de tu computadora y reinicia Expo para que lea la variable. No uses `localhost` en un teléfono físico: apuntaría al propio teléfono.

Usuarios de prueba tras el seed: `admin@barberslot.test` / `Admin123!` (administrador) y `henry@barberslot.test` / `Barber123!` (barbero).
## Pantallas informativas

La navegación pública incluye Inicio, Barberos, Servicios y Horarios.
Servicios presenta precios, duraciones aproximadas y descripciones; Horarios utiliza el horario publicado en el pie de página: lunes a sábado, de 9:00 a. m. a 5:00 p. m.
Ambas pantallas incluyen botones para volver al inicio y solicitar una reserva en `/reservar` (pantalla de reserva actualmente pendiente de implementación).

### Imagen de Horarios

Reemplaza `mobile/assets/images/horarios/barberia.png` por tu fotografía en formato PNG, conservando el nombre. Se incluye una copia de la imagen de inicio como imagen inicial. Se recomienda una foto horizontal en proporción 16:9; se recorta para llenar el espacio.
Si prefieres otro nombre o formato, actualiza `IMAGES.horarios.barberia` en `mobile/src/constants/images.ts` y la descripción accesible en `mobile/src/app/(public)/horarios.tsx` para que coincida con la imagen.