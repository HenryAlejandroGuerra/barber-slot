# BarberSlot: documentación técnica 

## 1. Resumen ejecutivo

BarberSlot es un sistema académico multiplataforma para gestionar citas de una barbería. El repositorio está organizado como un monorepo con tres aplicaciones independientes:

- `web/`: interfaz pública y panel administrativo web con Next.js.
- `mobile/`: interfaz pública y panel administrativo móvil con React Native y Expo.
- `backend/`: API REST independiente con Express, Prisma y PostgreSQL.

El objetivo funcional del sistema es centralizar:

- catálogo de barberos;
- catálogo de servicios;
- consulta de disponibilidad;
- creación y actualización de citas;
- autenticación de administradores y barberos;
- gestión administrativa de servicios y reservas;
- consulta de información pública.

El estado actual es híbrido: existen implementaciones reales de API, base de datos y autenticación Firebase, pero algunas vistas móviles todavía utilizan datos mock. Por tanto, esta documentación distingue claramente lo implementado de lo previsto.

## 2. Alcance y estado del proyecto

### Implementado y verificable en el código

- API Express con endpoint de salud.
- Modelo de datos Prisma para PostgreSQL.
- CRUD/operaciones de servicios y citas.
- Consulta de barberos.
- Cálculo de disponibilidad por barbero, servicio y fecha.
- Prevención básica de traslape de citas.
- Autenticación basada en Firebase y perfiles en Firestore.
- Compatibilidad temporal con sesiones HMAC/tokens históricos.
- Aplicación web con Next.js App Router.
- Aplicación móvil con Expo Router.
- Flujo móvil público para seleccionar barbero, servicio, fecha y hora.
- Flujo móvil administrativo con Firebase y perfiles de acceso.

### Pendiente o parcialmente integrado

- La mayoría del panel móvil administrativo usa datos mock.
- Las vistas móvil de agenda, historial y dashboard no están completamente conectadas a la API.
- Los README históricos describen diferentes variantes de integración: API Next.js, API Express desplegada y datos mock.
- Algunas rutas del backend no aplican autenticación, aunque administran datos.
- La UI pública y la administración deben sincronizarse completamente con el backend.
- Falta automatizar pruebas integrales y documentar en el repositorio el despliegue final.

## 3. Arquitectura general

### Vista lógica

```text
                    ┌────────────────────────┐
                    │     PostgreSQL         │
                    │     Neon u otro        │
                    └───────────▲────────────┘
                                │ Prisma
                    ┌───────────┴────────────┐
                    │   BarberSlot Backend   │
                    │ Express + TypeScript   │
                    └───────────▲────────────┘
                                │ HTTP/JSON
             ┌──────────────────┼──────────────────┐
             │                                      │
    ┌────────┴────────┐                   ┌─────────┴────────┐
    │  BarberSlot Web │                   │ BarberSlot Mobile│
    │ Next.js/React   │                   │ Expo/React Native│
    └─────────────────┘                   └──────────────────┘
             │                                      │
             └────────────── Firebase ─────────────┘
                        Auth / Firestore
```

### Principios de separación

1. **Los clientes no acceden directamente a PostgreSQL.**
2. **Express y Prisma contienen la integración con datos del backend independiente.**
3. **Next.js conserva APIs propias y servicios en `src/app/api/`**, además de tener integración de Firebase.
4. **React Native consume servicios HTTP**, con una capa adicional para Firebase Authentication.
5. **Las reglas de disponibilidad y conflictos se deben aplicar en el backend**, no solamente en la interfaz.

## 4. Estructura del repositorio

```text
BarberSlot/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── web/
│   ├── public/
│   ├── prisma/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── mobile/
│   ├── android/
│   ├── assets/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── data/mock/
│   │   ├── lib/
│   │   ├── services/
│   │   └── types/
│   ├── app.json
│   └── package.json
└── docs/
```

Cada carpeta administra dependencias de forma independiente; no se debe instalar todo el proyecto desde la raíz.

## 5. Modelo de datos

### Diagrama de entidades

```text
Usuario ──────────────┐
                      │ opcional
Barbero ──< HorarioBarbero
    │
    ├──< Cita >── Servicio
    │
    └──< Usuario

Cliente ──< Cita
```

### `Barbero`

Representa al profesional que atiende citas.

Campos principales:

- `id`
- `nombre`
- `especialidad`
- `activo`
- `disponible`
- `imagenUrl`

Se utiliza un identificador CUID generado por Prisma.

### `HorarioBarbero`

Excluye o prepara horarios semanales por barbero.

Campos principales:

- `barberoId`
- `diaSemana`
- `horaInicio`
- `horaFin`
- `activo`

Existe una restricción única por combinación de barbero y día. Aunque está modelado en el backend, el cálculo de disponibilidad actual se basa principalmente en el horario general de negocio y citas ocupadas.

### `Servicio`

Describe una prestación ofrecida por la barbería.

Campos principales:

- `nombre`
- `descripcion`
- `precio` con precisión decimal `10,2`
- `duracionMinutos`
- `activo`

La duración se utiliza para calcular el final de una cita y evitar traslapes.

### `Cliente`

Agrupa los datos de contacto necesarios para una reserva.

- `nombre`
- `correo`
- `telefono`

La relación con la cita es obligatoria. En la creación móvil/web, si el correo ya existe se reutiliza y se actualizan nombre y teléfono.

### `Cita`

Representa una reserva individual.

Campos principales:

- `clienteId`
- `barberoId`
- `servicioId`
- `fechaInicio`
- `fechaFin`
- `estado`
- `fechaCreacion`

Estados permitidos:

| Estado | Significado |
|---|---|
| `pendiente` | Reservada, pero no confirmada |
| `confirmada` | Confirmada por el negocio |
| `cancelada` | Anulada y liberada para disponibilidad |

### `Usuario`

Representa una cuenta administrativa o de barbero dentro del esquema PostgreSQL.

- `nombre`
- `correo` único
- `contraHash`
- `rol`
- `activo`
- `barberoId` opcional

Los roles permitidos son `administrador` y `barbero`.

## 6. API REST del backend Express

### Servidor

- Entrada: `backend/src/server.ts`
- Configuración Express: `backend/src/app.ts`
- Puerto por defecto: `4000`
- Formato: HTTP/JSON
- Middleware de seguridad: Helmet
- Validación: Zod en recursos seleccionados
- Body máximo: `1 MB`

### Salud

```http
GET /api/health
```

Respuesta de ejemplo:

```json
{
  "estado": "ok",
  "servicio": "BarberSlot API"
}
```

### Barberos

```http
GET /api/barberos
```

Devuelve el catálogo completo administrado por Prisma. El cliente móvil filtra localmente los registros con `activo` y `disponible`.

### Servicios

```http
GET /api/servicios
POST /api/servicios
PUT /api/servicios/:id
DELETE /api/servicios/:id
```

Las operaciones POST/PUT validan:

- nombre de 2 a 100 caracteres;
- descripción de 1 a 500 caracteres;
- precio con máximo dos decimales;
- duración entre 1 y 480 minutos;
- estado activo booleano.

La operación DELETE es una desactivación lógica: cambia `activo` a `false`.

### Disponibilidad

```http
GET /api/disponibilidad?barberoId=<id>&servicioId=<id>&fecha=YYYY-MM-DD
```

Respuesta:

```json
{
  "horarios": ["09:00", "09:30", "10:00"]
}
```

El backend rechaza:

- fechas en formato distinto de `YYYY-MM-DD`;
- fechas pasadas;
- barberos inexistentes o inactivos;
- servicios inexistentes o inactivos.

La generación usa:

- apertura: `09:00`;
- cierre: `18:00`;
- intervalo de inicio: cada 30 minutos;
- duración real del servicio;
- citas no canceladas como bloques ocupados;
- exclusión de horarios pasados en el día actual.

### Citas

```http
GET /api/citas
POST /api/citas
PATCH /api/citas/:id
```

Ejemplo de creación:

```json
{
  "nombreCliente": "Juan Pérez",
  "correoCliente": "juan@ejemplo.com",
  "telefonoCliente": "7000-0000",
  "barberoId": "barbero-id",
  "servicioId": "servicio-id",
  "fecha": "2026-11-23",
  "hora": "10:30"
}
```

Comportamientos principales:

- valida que existan todos los datos;
- verifica barbero y servicio;
- calcula `fechaFin` a partir de la duración;
- rechaza traslapes con citas no canceladas;
- reutiliza un cliente por correo;
- crea la cita con estado `pendiente`;
- permite cambiar el estado mediante `PATCH`.

El `PATCH` acepta únicamente `pendiente`, `confirmada` y `cancelada`.

### Autenticación

```http
POST /api/auth/login
GET  /api/auth/sesion
POST /api/auth/logout
POST /api/auth/registro
```

`login`, `sesion`, `logout` y `registro` forman parte de una compatibilidad entre autenticación HMAC histórica y Firebase.

- `login` valida correo y contraseña contra PostgreSQL.
- `sesion` requiere `Authorization: Bearer <token>`.
- `logout` confirma cierre local del token; no mantiene una blacklist.
- `registro` requiere autenticación y rol administrador.

El middleware acepta en prioridad:

1. token HMAC compatible con la sesión histórica;
2. Firebase ID Token.

Para Firebase, busca el perfil en la colección Firestore `usuarios/<uid>`. El perfil debe contener un rol válido y puede contener `barberoId`.

## 7. Autenticación y autorización

### Modelo de sesiones

Existen dos mecanismos coexistentes:

### Firebase Authentication

Usado por las aplicaciones web y móvil:

- correo y contraseña;
- Google Sign-In;
- persistencia móvil con AsyncStorage;
- Firebase ID Token enviado al backend;
- perfil administrativo almacenado en Firestore.

En móvil se utiliza `react-native-nitro-google-signin`. El inicio de sesión con Google obtiene un ID Token y lo convierte en credencial Firebase.

### Sesión HMAC histórica

El backend puede crear tokens firmados y busca usuarios en PostgreSQL. Este mecanismo mantiene compatibilidad mientras migra a Firebase.

El token incluye:

- `idUsuario`;
- `nombre`;
- `correo`;
- `rol`;
- `idBarbero`;
- `exp`.

### Guardia administrativa

La autenticación por sí sola no concede acceso administrativo. El usuario debe tener uno de estos roles:

- `administrador`;
- `barbero`.

La UI web consulta el perfil para evitar mostrar el panel a cuentas que no tienen el rol correcto. El backend usa el middleware `exigirAdministrador` para las operaciones que se reservan a administradores.

### Consideraciones de seguridad

- No se deben registrar secretos en el repositorio.
- El token debe enviarse como Bearer.
- CORS permite `localhost:3000` y `WEB_ORIGIN`.
- Helmet aplica cabeceras de seguridad básicas.
- El body JSON está limitado a `1 MB`.
- El login histórico aplica límites de intentos mediante rate limit.
- El correo puede usarse para restablecimiento a través de Resend.

## 8. Aplicación web

### Framework

- Next.js `16.3.4`
- React `19.2.8`
- Tailwind CSS `4`
- TypeScript `5`

### Rutas públicas

Rutas dentro de `src/app/(public)/`:

| Ruta | Propósito |
|---|---|
| `/` | Página principal |
| `/barberos` | Catálogo de barberos |
| `/reservar` | Reserva de citas |

Los grupos `(public)` y `(panel)` organizan layouts sin aparecer en la URL.

### Rutas administrativas

| Ruta | Propósito |
|---|---|
| `/admin` | Inicio de sesión |
| `/admin/inicio` | Dashboard |
| `/admin/agenda` | Agenda diaria |
| `/admin/servicios` | Gestión de servicios |
| `/admin/usuarios/nuevo` | Registro de usuario |

### APIs propias de Next.js

Además de la API Express, `web/src/app/api/` incluye rutas para autenticación, barberos, servicios, disponibilidad y citas. Esta arquitectura permite una migración gradual y explica por qué existen dos fuentes REST en el repositorio.

### Componentes principales

- `AdminDashboard`: resumen administrativo.
- `AdminGuard`: protege la navegación administrativa.
- `AdminLoginForm`: inicio de sesión.
- `ReservasForm`: reserva pública.
- `PublicHeader` y `PublicFooter`.
- `AuthContext`: observa y administra la sesión Firebase.

### Integración web

La URL base se obtiene de `NEXT_PUBLIC_API_URL` o queda como `http://localhost:4000`.

`apiFetch` prioriza el Firebase ID Token del usuario activo y, si no existe, conserva el token HMAC de `sessionStorage`.

## 9. Aplicación móvil

### Configuración Expo

El archivo `mobile/app.json` define:

- nombre: `BarberSlot`;
- slug: `barberslot-mobile`;
- versión: `1.0.0`;
- orientación vertical;
- esquema de deep linking: `barberslot://`;
- interfaz automática según tema del sistema;
- paquete Android: `com.barberslot.mobile`;
- soporte de tabletas iOS;
- salida web estática;
- rutas tipadas;
- React Compiler experimental.

Plugins configurados:

- `react-native-nitro-google-signin`;
- `expo-router`;
- `expo-splash-screen`;
- `expo-font`;
- `expo-dev-client`.

El splash utiliza fondo `#0D0D0D`, el logo de marca y 100 píxeles de ancho.

El proyecto tiene un proyecto EAS configurado mediante `projectId` y desarrollo interno en perfiles `development`, `preview` y `production`.

### Navegación

La entrada principal es `expo-router/entry`.

Rutas públicas:

| Ruta | Propósito |
|---|---|
| `/` | Página principal |
| `/barberos` | Catálogo |
| `/servicios` | Servicios |
| `/reservar` | Selección de barbero |
| `/horarios` | Selección de fecha y hora |
| `/detalles-cita` | Datos del cliente |
| `/cita-reservada` | Confirmación |
| `/registro` | Registro público |

Rutas administrativas:

| Ruta | Propósito |
|---|---|
| `/admin` | Login |
| `/admin/inicio` | Dashboard |
| `/admin/agenda` | Agenda |
| `/admin/servicios` | Servicios |
| `/admin/historial` | Historial |

### Fuente y tema

La aplicación carga las variantes Montserrat:

- Regular;
- Medium;
- SemiBold;
- Bold;
- ExtraBold.

Los colores compartidos se encuentran en `src/constants/theme.ts`. La interfaz pública usa fondo claro y acentos dorados; el panel administrativo usa fondo oscuro y tarjetas con bordes dorados.

### Estado de reserva móvil

`ReservaProvider` conserva durante el flujo:

- barberos;
- servicios;
- barbero seleccionado;
- servicio seleccionado;
- fecha;
- hora;
- nombre del cliente;
- correo;
- teléfono;
- estado de confirmación;
- respuesta de la cita creada.

La fecha se valida con formato `DD/MM/YYYY`, no permite fechas anteriores ni domingos.

### Comunicación HTTP móvil

Existen dos implementaciones HTTP:

- `src/lib/apiFetch.ts`: usa `EXPO_PUBLIC_API_URL` y como fallback `https://barberslot-api.vercel.app`;
- `src/lib/apiClient.ts`: resuelve automáticamente la IP de Metro o usa Next.js en el puerto `3000`.

Los servicios públicos actuales de barberos, servicios y citas utilizan `src/lib/apiFetch.ts`. Por ello el despliegue debe configurarse de forma consistente mediante `EXPO_PUBLIC_API_URL`.

### Estado actual móvil

- Autenticación móvil: integrada con Firebase.
- Consulta real de barberos: preparada.
- Consulta real de servicios: preparada.
- Disponibilidad y creación de citas: preparadas.
- Dashboard móvil: datos mock.
- Agenda móvil: datos mock.
- Historial móvil: datos mock.
- Servicios administrativos: puede necesitar integración adicional.

## 10. Flujo funcional de reserva

```text
1. Consultar barberos disponibles
2. Consultar servicios activos
3. Seleccionar barbero y servicio
4. Seleccionar fecha válida
5. Consultar disponibilidad
6. Seleccionar una hora
7. Capturar datos del cliente
8. Crear la cita
9. El backend valida barbero y servicio
10. El backend calcula fechaFin
11. El backend busca conflictos
12. Se reutiliza o crea el cliente
13. Se crea la cita como pendiente
14. Se muestra la confirmación
```

La reserva se considera exitosa solo si el backend devuelve `201`. El frontend no debe confirmar localmente una cita antes de recibir esa respuesta.

## 11. Flujo administrativo

```text
Abrir /admin
  ↓
Firebase inicia/cierra sesión
  ↓
Consultar perfil usuarios/{uid}
  ↓
Validar administrador o barbero
  ↓
Entrar al dashboard
  ↓
Acceder a agenda, servicios o historial
```

Firebase controla identidad. Firestore controla el perfil y el rol. PostgreSQL controla los datos de negocio. En caso de migración completa a PostgreSQL, el rol puede mantenerse en `Usuario` y sincronizarse con el uid Firebase.

## 12. Variables de entorno

### Backend

Archivo: `backend/.env`

| Variable | Uso |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL |
| `DATABASE_URL_POOLED` | Conexión agrupada si se despliega con pooling |
| `PORT` | Puerto HTTP, por defecto `4000` |
| `WEB_ORIGIN` | Origen adicional permitido por CORS |
| `SESSION_SECRET` | Firma HMAC de la sesión histórica |
| `FIREBASE_PROJECT_ID` | Proyecto Firebase Admin |
| `FIREBASE_CLIENT_EMAIL` | Cuenta de servicio Firebase |
| `FIREBASE_PRIVATE_KEY` | Clave privada Firebase |
| `RESEND_API_KEY` | Envío de correo |

### Web

Archivo: `web/.env.local`

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL de la API REST |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web |

La web también puede necesitar `DATABASE_URL`, secretos de servidor y configuración de Resend si usa sus rutas Prisma propias.

### Mobile

Archivo: `mobile/.env.local` o configuración del entorno Expo

| Variable | Uso |
|---|---|
| `EXPO_PUBLIC_API_URL` | URL central de la API |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase React Native |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase React Native |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase React Native |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase React Native |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase React Native |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase React Native |

Las variables `EXPO_PUBLIC_*` y `NEXT_PUBLIC_*` se incluyen en el bundle del cliente y no deben contener secretos privados.

## 13. Instalación local

### Requisitos

- Node.js 22.13 o superior dentro de la línea 22;
- npm;
- Git;
- PostgreSQL o una instancia Neon;
- Firebase configurado;
- Android Studio o Expo Go para móvil.

### Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run dev
```

API local:

```text
http://localhost:4000
```

### Web

```bash
cd web
npm install
npm run dev
```

Web local:

```text
http://localhost:3000
```

### Mobile

```bash
cd mobile
npm install
npm start
```

Comandos adicionales:

```bash
npx expo start --clear
npm run android
npm run ios
npm run web
npm run lint
```

Para probar desde Expo Go, el teléfono y la computadora deben compartir red. Cuando se usa el backend Express, configure `EXPO_PUBLIC_API_URL` con una URL accesible desde el dispositivo, no con `localhost` de la computadora.

## 14. Base de datos y Prisma

### Generar cliente

```bash
cd backend
npx prisma generate --config=prisma.config.ts
```

### Crear migración

```bash
cd backend
npx prisma migrate dev --name descripcion_migracion --config=prisma.config.ts
```

Las migraciones deben versionarse. No se debe ejecutar `prisma migrate reset` sobre una base compartida sin respaldo y autorización.

### Seed

El seed crea barberos, servicios, usuarios y citas de ejemplo. El archivo elimina datos de tablas dependientes antes de insertar los ejemplos, por lo que no debe ejecutarse sobre una base de producción sin modificación.

```bash
cd backend
npx tsx prisma/seed.ts
```

El seed utiliza `DATABASE_URL` o el entorno cargado por Prisma y contiene usuarios de prueba. Las contraseñas de prueba no representan credenciales de producción.

## 15. Compilación y calidad

### Backend

```bash
npm run typecheck
npm run dev
npm start
```

### Web

```bash
npm run lint
npm run build
npm start
```

### Mobile

```bash
npm run lint
npx expo export --platform web
npx expo run:android
npx expo run:ios
```

No existen suites completas de pruebas unitarias o E2E identificadas en los scripts actuales. Las verificaciones recomendadas son:

- validar cada ruta API con casos válidos e inválidos;
- probar conflictos de cita;
- probar fechas pasadas;
- probar cancelaciones y liberación de horario;
- validar inactivación de servicios;
- probar Firebase con correo y Google;
- probar el bloqueo de perfiles sin rol;
- probar Expo desde una red real.

## 16. Despliegue

### Backend

Usar Node.js compatible con `24.x` según `backend/package.json`.

Configurar:

- `DATABASE_URL`;
- `SESSION_SECRET`;
- credenciales Firebase Admin;
- `WEB_ORIGIN`;
- `PORT` si el proveedor no asigna uno.

Ejecutar antes del arranque:

```bash
npm run prisma:generate
npm run dev
```

Para producción se recomienda un proceso explícito que genere Prisma y arranque `tsx src/server.ts`, o compilar TypeScript si se agrega el script correspondiente.

### Web

Usar el build de Next.js:

```bash
npm run build
npm start
```

Configurar `NEXT_PUBLIC_API_URL` para apuntar a la API Express o mantener las rutas propias de Next según la arquitectura desplegada.

### Mobile

El proyecto incluye perfiles EAS:

- `development`: development client interno;
- `preview`: distribución interna;
- `production`: incremento automático de versión.

Ejemplos:

```bash
eas build --profile development --platform android
eas build --profile preview --platform android
eas build --profile production --platform android
```

Los archivos Android nativos ya están presentes en el repositorio. Si se cambian plugins nativos o configuración significativa de Firebase/Google Sign-In, se debe ejecutar un prebuild/build nativo nuevo.

## 17. Identidad visual

### Marca

- nombre principal: BarberSlot;
- color de énfasis: dorado;
- fondo público: claro;
- fondo administrativo: oscuro;
- tipografía: Montserrat;
- recursos principales:
  - `assets/images/brand/app-icon.png`;
  - `assets/images/brand/logo.png`;
  - imágenes públicas y administrativas organizadas por carpetas.

En web las imágenes públicas están bajo `web/public/images/`. En móvil están bajo `mobile/assets/images/`.

## 18. Observabilidad y errores

### Respuesta de errores

La API normalmente devuelve:

```json
{
  "error": "Mensaje describiendo el problema."
}
```

Los códigos esperados incluyen:

- `400`: datos inválidos;
- `401`: no autenticado;
- `403`: rol insuficiente;
- `404`: recurso inexistente;
- `409`: conflicto o recurso no disponible;
- `500`: error no controlado.

El middleware global `manejarError` evita exponer detalles internos y registra errores no controlados.

### Recomendaciones operativas

- registrar solicitudes con request ID;
- registrar errores Prisma;
- medir disponibilidad y latencia;
- configurar alertas de fallos de base de datos;
- monitorear errores de Firebase;
- usar logs estructurados en producción.

## 19. Riesgos técnicos y deuda conocida

1. **Paridad web/móvil no completa**: varias pantallas móviles siguen usando mocks.
2. **Dos familias de API**: API Express y rutas API de Next.js conviven.
3. **Dos sistemas de sesión**: Firebase y HMAC históricos requieren un plan de retiro.
4. **Falta protección uniforme**: algunas operaciones CRUD no incluyen middleware de autenticación.
5. **Disponibilidad parcial**: el modelo incluye horarios por barbero, pero el cálculo actual usa horario general.
6. **Zonas horarias**: se usa UTC-6 para El Salvador; una cita creada debe normalizarse de forma consistente en todos los clientes.
7. **Sin reservas transaccionales concurrentes**: la comprobación y creación siguen abiertas a condiciones de carrera si dos solicitudes llegan exactamente al mismo tiempo.
8. **No hay índice de búsqueda temporal**: el modelo no declara índices adicionales para rangos de citas.
9. **Configuración móvil inconsistente**: existen fallbacks a `localhost`, Next.js y una URL Vercel en distintas capas.
10. **Seed destructivo**: elimina datos existentes al ejecutarse.
11. **Pruebas incompletas**: no se identifican suites integrales en los scripts principales.

## 20. Checklist de integración final

- Seleccionar una única URL pública de API móvil y web.
- Eliminar fallbacks obsoletos.
- Conectar agenda, historial y dashboard móvil a la API.
- Aplicar autenticación y autorización a todas las operaciones administrativas.
- Migrar completamente las sesiones HMAC a Firebase o PostgreSQL.
- Sincronizar perfiles Firebase con usuarios Prisma.
- Agregar índices y reglas de concurrencia en citas.
- Incorporar HorarioBarbero al cálculo real de disponibilidad.
- Agregar límites de reservas por usuario o correo si la lógica lo requiere.
- Agregar pruebas unitarias, de integración y E2E.
- Definir CI/CD para backend, web y mobile.
- Revisar secretos y variables antes de publicar.
- Definir proceso de migración y seed seguro para producción.

## 21. Comandos de referencia

```bash
# Backend
cd backend
npm install
npm run prisma:generate
npm run typecheck
npm run dev

# Web
cd web
npm install
npm run lint
npm run dev
npm run build

# Mobile
cd mobile
npm install
npm run lint
npm start
npx expo start --clear
```
