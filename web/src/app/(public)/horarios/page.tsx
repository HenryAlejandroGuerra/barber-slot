/*
========================================================
web/src/app/(public)/horarios/page.tsx
Página para seleccionar la fecha y el horario de la cita.
========================================================
*/


/*
====================================================
COMPONENTE DEL LADO DEL CLIENTE
====================================================
Esta instrucción le indica a Next.js que esta página debe ejecutarse en el navegador.
La necesitamos porque utilizamos:
- useState
- useEffect
- useMemo
- useRouter
- useSearchParams
- LocalStorage mediante nuestros servicios
*/
"use client";


/*
====================================================
IMPORTACIONES DE REACT
====================================================
useEffect: Ejecuta código cuando la página se carga o cuando cambian determinadas variables.
useMemo: Nos ayuda a memorizar resultados que no necesitamos recalcular innecesariamente.
useState: Nos permite guardar información que cambia mientras el usuario utiliza la página.
ChangeEvent: Es el tipo que utilizaremos para identificar correctamente el evento del campo de fecha.
*/
import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

/*
====================================================
IMPORTACIONES DE NEXT.JS
====================================================
useRouter: Permite navegar de una página a otra mediante código.
useSearchParams: Permite leer los parámetros que vienen en la URL.
*/
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

/*
====================================================
TIPOS DEL PROYECTO
====================================================
Cita: Representa una cita almacenada en el sistema.
Barbero: Representa la información de un barbero.
*/
import type {Cita} from "@/types/cita";
import type {Barbero} from "@/types/barbero";

/*
====================================================
SERVICIOS DEL PROYECTO
====================================================
citaService: Nos permite consultar las citas existentes.
barberoService: Nos permite consultar la información de los barberos.
*/
import {citaService} from "@/services/cita.service";
import {barberoService} from "@/services/barbero.service";

/*
========================================================
FUNCIÓN: obtenerFechaActual Devuelve la fecha actual en formato: YYYY-MM-DD
========================================================
*/
const obtenerFechaActual = () => {

/*
Obtenemos la fecha y hora actual del equipo del usuario.
*/
    const hoy = new Date();

/*
Obtenemos el año.
*/
    const año = hoy.getFullYear();

/*
Obtenemos el mes. JavaScript comienza los meses en 0:
Enero = 0
Febrero = 1
...
Diciembre = 11
Por eso agregamos 1.
*/
    const mes = String(
        hoy.getMonth() + 1
    ).padStart(2, "0");

/*
Obtenemos el día del mes.
*/
    const dia = String(
        hoy.getDate()
    ).padStart(2, "0");

/*
Construimos la fecha completa. Resultado: YYYY-MM-DD
*/
    return `${año}-${mes}-${dia}`;
};

/*
========================================================
FUNCIÓN: obtenerFechaInicial
Determina qué fecha debemos mostrar inicialmente.
Regla:
Lunes a sábado: se utiliza la fecha de hoy.
Domingo: se utiliza el lunes siguiente.
De esta manera nunca iniciamos la página mostrando un domingo.
========================================================
*/
const obtenerFechaInicial = () => {

/*
Creamos una fecha con el día actual.
*/
    const fecha = new Date();

/*
getDay() devuelve:
0 = domingo
1 = lunes
2 = martes
3 = miércoles
4 = jueves
5 = viernes
6 = sábado
*/
    const diaSemana = fecha.getDay();

/*
Si hoy es domingo agregamos un día para llegar al lunes.
*/
    if (diaSemana === 0) {
        fecha.setDate(
            fecha.getDate() + 1
        );
    }

/*
Obtenemos el año.
*/
    const año = fecha.getFullYear();

/*
Obtenemos el mes.
*/
    const mes = String(
        fecha.getMonth() + 1
    ).padStart(2, "0");

/*
Obtenemos el día.
*/
    const dia = String(
        fecha.getDate()
    ).padStart(2, "0");

/*
Devolvemos la fecha en formato: YYYY-MM-DD
*/
    return `${año}-${mes}-${dia}`;
};

/*
========================================================
FUNCIÓN: generarHorarios
 Genera los horarios disponibles de la barbería.
Inicio: 09:00
Fin:    17:00
Los intervalos son de 30 minutos.
Resultado:
09:00
09:30
10:00
10:30
...
16:30
17:00
========================================================
*/
function generarHorarios(): string[] {

/*
Arreglo donde guardaremos todos los horarios.
*/
    const horarios: string[] = [];

/*
9:00 AM expresado en minutos. 9 × 60 = 540
*/
    const horaInicio = 9 * 60;

/*
5:00 PM expresado en minutos. 17 × 60 = 1020
*/
    const horaFin = 17 * 60;

/*
Recorremos todos los horarios
avanzando de 30 en 30 minutos.
*/
    for (
        let minutos = horaInicio;
        minutos <= horaFin;
        minutos += 30
    ) {

/*
Convertimos los minutos totales en horas enteras.
Ejemplo:570 minutos a 9 horas
*/
        const horas = Math.floor(
            minutos / 60
        );

/*
Obtenemos los minutos restantes. Ejemplo: 570 % 60 = 30
*/
        const minutosRestantes =
            minutos % 60;

/*
Agregamos un cero a la izquierda cuando sea necesario.
*/
        const horasTexto = horas
            .toString()
            .padStart(2, "0");

        const minutosTexto =
            minutosRestantes
                .toString()
                .padStart(2, "0");

/*
Construimos el horario. Ejemplo: "09:30"
*/
        horarios.push(
            `${horasTexto}:${minutosTexto}`
        );
    }

/*
 Devolvemos todos los horarios.
*/
    return horarios;
}

/*
========================================================
COMPONENTE PRINCIPAL
========================================================
*/
export default function HorariosPage() {

/*
====================================================
ROUTER
====================================================
Nos permitirá realizar las navegaciones:
Regresar a /servicios
Seguir a /reservar/detalle
*/
    const router = useRouter();

/*
====================================================
SEARCH PARAMS
====================================================
Nos permite leer los datos enviados desde la página anterior.
*/
    const searchParams = useSearchParams();

/*
====================================================
OBTENER ID DEL BARBERO
====================================================
Buscamos el parámetro: barbero
*/
    const idBarbero = searchParams.get("barbero");

/*
====================================================
OBTENER SERVICIOS SELECCIONADOS
====================================================
Desde Servicios podemos recibir: servicios=1,3,5 Aquí lo convertimos a: ["1", "3", "5"]
*/
    const idsServicios = useMemo(() => {

/*
Obtenemos el parámetro de la URL.
*/
        const parametro =
            searchParams.get("servicios");

/*
Si no existe, devolvemos un arreglo vacío.
        */
        if (!parametro) {
            return [];
        }

/*
Separamos utilizando la coma. "1,3,5" se convierte en: ["1", "3", "5"]
*/
        return parametro
            .split(",")
            .filter(Boolean);

    }, [searchParams]);

/*
====================================================
ESTADO: BARBERO
====================================================
Aquí guardaremos la información completa del barbero seleccionado. Inicialmente no tenemos ninguno.
*/
    const [barbero, setBarbero] =
        useState<Barbero | null>(null);

/*
====================================================
ESTADO: CITAS
====================================================
Aquí almacenaremos las citas existentes correspondientes a la fecha seleccionada.
*/
    const [citas, setCitas] =
        useState<Cita[]>([]);

/*
====================================================
ESTADO: FECHA
====================================================
Inicialmente utilizamos una fecha válida. Si hoy es domingo, será automáticamente el próximo lunes.
*/
    const [fecha, setFecha] =
        useState(obtenerFechaInicial());

/*
====================================================
ESTADO: HORA SELECCIONADA
====================================================
Aquí guardaremos el horario elegido por el usuario. Inicialmente no hay ninguna hora.
*/
    const [horaSeleccionada, setHoraSeleccionada] =
        useState("");

/*
====================================================
ESTADO: MENSAJE DE FECHA
====================================================
Aquí guardaremos un mensaje para cuando el usuario intente seleccionar un domingo.
Ejemplo: "La barbería no atiende los domingos."
*/
    const [mensajeFecha, setMensajeFecha] =
        useState("");

/*
====================================================
ESTADO: CARGANDO
====================================================
Mientras estamos obteniendo información mostramos un mensaje de carga.
*/
    const [cargando, setCargando] =
        useState(true);

/*
====================================================
LISTA DE HORARIOS
====================================================
Generamos la lista de horarios una sola vez. Gracias a useMemo no necesitamos reconstruir el arreglo en cada renderizado.
*/
    const horarios = useMemo(
        () => generarHorarios(),
        []
    );

/*
====================================================
CARGAR DATOS
====================================================
Ejecutamos esta función cuando:
- se carga la página
- cambia el barbero
- cambia la fecha
*/
    useEffect(() => {

/*
Creamos una función asíncrona porque nuestros servicios devuelven Promises.
*/
        async function cargarDatos() {

 /*
Activamos el estado de carga.
 */
            setCargando(true);

            try {

/*
==================================================
OBTENER BARBERO
==================================================
Solo buscamos el barbero si recibimos un ID.
*/
                if (idBarbero) {

/*
Obtenemos todos los barberos.
*/
                    const barberos =
                        await barberoService.obtenerTodos();

/*
Buscamos aquel cuyo ID coincida con el ID recibido.
*/
                    const barberoseleccionado =
                        barberos.find(
                            (item) =>
                                item.id === idBarbero
                        );

/*
Guardamos el barbero encontrado. Si no existe, guardamos null.
*/
                    setBarbero(
                        barberoseleccionado ?? null
                    );

                } else {

/*
Si no tenemos ID de barbero, dejamos el estado vacío.
*/
                    setBarbero(null);
                }

/*
==================================================
OBTENER CITAS DE LA FECHA
==================================================
Utilizamos exactamente la función que ya existe en cita.service.ts: citaService.obtenerPorFecha(fecha)
*/
                const citasDeLaFecha =
                    await citaService.obtenerPorFecha(
                        fecha
                    );

/*
Guardamos las citas obtenidas.
*/
                setCitas(citasDeLaFecha);

            } finally {

/*
Terminamos el estado de carga.
*/
                setCargando(false);
            }
        }

/*
Ejecutamos la función.
*/
        cargarDatos();

/*
Cada vez que cambie el barbero o la fecha, volveremos a consultar la información.
*/
    }, [idBarbero, fecha]);

/*
====================================================
FUNCIÓN: ESTA OCUPADA
====================================================
Recibe una hora: "10:30"
y comprueba si existe una cita:
- del mismo barbero
- de la misma hora
- que no esté cancelada
*/
    function estaOcupada(
        hora: string
    ): boolean {

/*
Si no tenemos barbero todavía, no podemos comparar correctamente. Por el momento la dejamos disponible.
*/
        if (!idBarbero) {
            return false;
        }

/*
some() devuelve true cuando encuentra al menos una cita que cumpla todas nuestras condiciones.
*/
        return citas.some((cita) => (

/*
La cita pertenece al mismo barbero.
*/
            cita.idBarbero === idBarbero

            &&

/*
La cita tiene la misma hora.
*/
            cita.hora === hora

            &&

/*
  Una cita cancelada no bloquea el horario.
Por tanto:
pendiente   si bloquea
confirmado  si bloquea
cancelado   nO bloquea
*/
            cita.estado !== "cancelado"
        ));
    }

/*
====================================================
FUNCIÓN: CAMBIAR FECHA
====================================================
Se ejecuta cuando el usuario selecciona una fecha desde el calendario.
*/
    function manejarCambioFecha(
        event: ChangeEvent<HTMLInputElement>
    ) {

/*
Obtenemos la nueva fecha. Ejemplo: "2026-09-21"
*/
        const nuevaFecha =
            event.target.value;

/*
Creamos una fecha utilizando la seleccionada por el usuario.
Agregamos T00:00:00 para trabajar con la fecha al inicio del día.
*/
        const fechaSeleccionada =
            new Date(`${nuevaFecha}T00:00:00`);

/*
Obtenemos el día de la semana.
0 = domingo
1 = lunes
2 = martes
3 = miércoles
4 = jueves
5 = viernes
6 = sábado
*/
        const diaSemana =
            fechaSeleccionada.getDay();

/*
==================================================
COMPROBAR SI ES DOMINGO
==================================================
*/
        if (diaSemana === 0) {

/*
Mostramos un mensaje explicativo.
*/
            setMensajeFecha(
                "La barbería no atiende los domingos."
            );

/*
Limpiamos la fecha seleccionada. Esto evita que el domingo quede como fecha válida.
*/
            setFecha("");

/*
También limpiamos la hora.
*/
            setHoraSeleccionada("");

/*
Terminamos la función. De esta forma el domingo no continúa como una fecha válida.
*/
            return;
        }

/*
==================================================
FECHA VÁLIDA
==================================================
*/

/*
Eliminamos cualquier mensaje anterior.
*/
        setMensajeFecha("");

/*
Guardamos la nueva fecha.
*/
        setFecha(nuevaFecha);

/*
Al cambiar de día debemos volver a elegir una hora.
*/
        setHoraSeleccionada("");
    }

/*
====================================================
FUNCIÓN: REGRESAR
====================================================
El botón Regresar desde Horarios debe llevar al usuario nuevamente a Servicios.
*/
    function regresar() {

/*
Creamos los parámetros de navegación.
*/
        const parametros =
            new URLSearchParams();

/*
Conservamos los servicios que el usuario había seleccionado.
*/
        if (idsServicios.length > 0) {

            parametros.set(
                "servicios",
                idsServicios.join(",")
            );
        }

/*
Conservamos también el barbero.
*/
        if (idBarbero) {

            parametros.set(
                "barbero",
                idBarbero
            );
        }

/*
Convertimos los parámetros en texto.
*/
        const queryString =
            parametros.toString();

/*
Si hay parámetros:
/servicios?servicios=1,3&barbero=abc Si no existen: /servicios
*/
        router.push(
            queryString
                ? `/servicios?${queryString}`
                : "/servicios"
        );
    }

/*
====================================================
FUNCIÓN: SEGUIR
====================================================
El botón Seguir desde Horarios debe llevar Datos
*/
    function seguir() {

/*
No permitimos avanzar sin una hora.
*/
        if (!horaSeleccionada) {
            return;
        }

/*
Creamos los parámetros que enviaremos a la página de Datos.
*/
        const parametros =
            new URLSearchParams();

/*
Enviamos los servicios seleccionados.
*/
        if (idsServicios.length > 0) {

            parametros.set(
                "servicios",
                idsServicios.join(",")
            );
        }

/*
Enviamos el ID del barbero.
*/
        if (idBarbero) {

            parametros.set(
                "barbero",
                idBarbero
            );
        }

/*
Enviamos la fecha seleccionada.
*/
        parametros.set(
            "fecha",
            fecha
        );

/*
Enviamos la hora seleccionada.
*/
        parametros.set(
            "hora",
            horaSeleccionada
        );

/*
Navegamos a la página de detalle.
*/
        router.push(
            `/reservar/detalle?${parametros.toString()}`
        );
    }

/*
========================================================
INTERFAZ VISUAL
========================================================
*/
    return (

/*
Sección principal de la página.
*/
        <section className="section-spacing">

            {
/*
Contenedor general ya definido en globals.css.
*/
            }
            <div className="app-container max-w-6xl">

                {
/*
==================================================
CONTENIDO PRINCIPAL
==================================================
En pantallas medianas y grandes utilizamos dos columnas:
izquierda: imagen del barbero
derecha: información y selección
*/
                }
                <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr]">

                    {
/*
==================================================
IMAGEN DEL BARBERO
==================================================
*/
                    }
                    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl bg-black shadow-lg">

                        <img

/*
Si el barbero tiene una imagen, usamos esa imagen.
Si no tiene imagen, utilizamos temporalmentenel logo de la barbería.
*/
                            src={
                                barbero?.imagenUrl ||
                                "/images/brand/logo.png"
                            }

/*
Texto alternativo. Ayuda a las tecnologías denasistencia y accesibilidad.
*/
                            alt={
                                barbero
                                    ? `Imagen de ${barbero.nombre}`
                                    : "Barbero seleccionado"
                            }

/*
Diseño de la imagen. object-cover hace que la imagen cubra el espacio disponible manteniendo sus proporciones.
*/
                            className="aspect-[4/5] h-full w-full object-cover"
                        />

                    </div>

                    {
/*
==================================================
INFORMACIÓN DEL LADO DERECHO
==================================================
*/
                    }
                    <div className="text-center md:text-left">

                        {
/*
==================================================
NOMBRE DEL BARBERO
==================================================
*/
                        }
                        <h1 className="text-3xl font-extrabold text-brand-gold md:text-4xl">

                            {barbero?.nombre ??
                                "Barbero seleccionado"}

                        </h1>

                        {
/*
==================================================
ESPECIALIDAD
==================================================
Si tenemos la especialidad del barbero, la mostramos debajo del nombre.
*/
                        }
                        {barbero?.especialidad && (

                            <p className="mx-auto mt-6 max-w-xl text-sm font-semibold leading-relaxed text-brand-black md:mx-0">

                                {barbero.especialidad}

                            </p>

                        )}

                        {
/*
==================================================
FECHA
==================================================
*/
                        }
                        <div className="mt-8">

                            <label
                                htmlFor="fecha"
                                className="block text-2xl font-extrabold text-brand-gold"
                            >
                                Fecha
                            </label>

                            {
/*
Selector de fecha. El navegador mostrará automáticamente un calendario.
*/
                            }
                            <input
                                id="fecha"
                                type="date"

/*
Fecha actual que tenemos almacenada en el estado.
*/
                                value={fecha}

/*
Cuando el usuario seleccione una fecha se ejecutará nuestra función personalizada.
*/
                                onChange={
                                    manejarCambioFecha
                                }

/*
No permitimos seleccionar fechas anteriores a hoy.
*/
                                min={
                                    obtenerFechaActual()
                                }

/*
Clases visuales.
*/
                                className="input-base mx-auto mt-3 max-w-sm text-center md:mx-0"
                            />

                            {
/*
==================================================
MENSAJE DE FECHA
==================================================
Solo aparecerá cuando: mensajeFecha !== "" Por ejemplo: "La barbería no atiende los domingos."
*/
                            }
                            {mensajeFecha && (

                                <p className="mt-3 text-sm font-bold text-red-600">

                                    {mensajeFecha}

                                </p>

                            )}

                        </div>

                        {
/*
==================================================
HORA
==================================================
*/
                        }
                        <div className="mt-8">

                            <label
                                htmlFor="hora"
                                className="block text-2xl font-extrabold text-brand-gold"
                            >
                                Hora
                            </label>


                            <select
                                id="hora"

/*
Hora actualmente seleccionada.
*/
                                value={horaSeleccionada}

/*
Cuando el usuario selecciona una hora, actualizamos el estado.
*/
                                onChange={(event) =>
                                    setHoraSeleccionada(
                                        event.target.value
                                    )
                                }

/*
Diseño del selector.
*/
                                className="input-base mx-auto mt-3 max-w-sm text-center md:mx-0"
                            >

                                {
/*
Primera opción informativa. No representa una hora.
*/
                                }
                                <option value="">
                                    Seleccione una hora
                                </option>

                                {
/*
Recorremos todos los horarios generados anteriormente.
*/
                                }
                                {horarios.map((hora) => {

/*
Comprobamos si esta hora está ocupada.
*/
                                    const ocupada =
                                        estaOcupada(hora);


                                    return (

                                        <option
                                            key={hora}
                                            value={hora}

/*
Si está ocupada, no permitimos seleccionarla.
*/
                                            disabled={ocupada}
                                        >
                                            {hora}

                                            {ocupada
                                                ? " - Ocupado"
                                                : ""}
                                        </option>

                                    );
                                })}

                            </select>

                        </div>

                        {
/*
==================================================
MENSAJE DE CARGA
==================================================
Mientras consultamos las citas, mostramos este mensaje.
*/
                        }
                        {cargando && (

                            <p className="mt-4 text-sm font-semibold text-brand-black">

                                Cargando disponibilidad...

                            </p>

                        )}

                        {
/*
==================================================
BOTONES DE NAVEGACIÓN
==================================================
Regresar: lleva a Servicios
Seguir: lleva a Datos
*/
                        }
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">

                            {
/*
==================================================
BOTÓN REGRESAR
==================================================
*/
                            }
                            <button
                                type="button"

/*
Ejecutamos la función que nos lleva a Servicios.
*/
                                onClick={regresar}

                                className="btn-navigation min-w-36 text-base"
                            >
                                Regresar
                            </button>

                            {
/*
==================================================
BOTÓN SEGUIR
==================================================
*/
                            }
                            <button
                                type="button"

/*
Ejecutamos la función que nos lleva a Datos.
*/
                                onClick={seguir}

/*
El botón permanece deshabilitado mientras no haya una hora seleccionada.
*/
                                disabled={!horaSeleccionada}


                                className="btn-navigation min-w-36 text-base disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Seguir
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}