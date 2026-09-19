// web/src/app/admin/(panel)/agenda/page.tsx
/* ===========================================
    Página Admin - Agenda
=========================================== */
"use client";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import { citaService } from "@/services/cita.service";
import { barberoService } from "@/services/barbero.service";
import { servicioService } from "@/services/servicio.service";

import type {
    Cita,
    EstadoCita
} from "@/types/cita";

import type { Barbero } from "@/types/barbero";
import type { Servicio } from "@/types/servicio";

import { obtenerFechaLocalISO } from "@/lib/fechas";

export default function AgendaPage() {

    const [citas, setCitas] =
        useState<Cita[]>([]);

    const [barberos, setBarberos] =
        useState<Barbero[]>([]);

    const [servicios, setServicios] =
        useState<Servicio[]>([]);

    const [
        fechaSeleccionada,
        setFechaSeleccionada
    ] = useState(
        obtenerFechaLocalISO()
    );

    const [
        barberoSeleccionado,
        setBarberoSeleccionado
    ] = useState("todos");

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        menuEstadoAbierto,
        setMenuEstadoAbierto
    ] = useState<string | null>(null);


    /* =========================================
       CARGAR DATOS
    ========================================= */

    useEffect(() => {

        async function cargarDatos() {

            try {

                const [
                    citasData,
                    barberosData,
                    serviciosData
                ] = await Promise.all([
                    citaService.obtenerTodas(),
                    barberoService.obtenerTodos(),
                    servicioService.obtenerTodos()
                ]);

                setCitas(citasData);
                setBarberos(barberosData);
                setServicios(serviciosData);

            } catch {

                setError(
                    "No fue posible cargar la agenda."
                );

            } finally {

                setCargando(false);
            }
        }

        cargarDatos();

    }, []);


    /* =========================================
       FILTRAR CITAS
    ========================================= */

    const citasFiltradas =
        useMemo(() => {

            return citas

                .filter(
                    (cita) =>
                        cita.fecha ===
                        fechaSeleccionada
                )

                .filter((cita) => {

                    if (
                        barberoSeleccionado ===
                        "todos"
                    ) {
                        return true;
                    }

                    return (
                        cita.idBarbero ===
                        barberoSeleccionado
                    );
                })

                .sort(
                    (a, b) =>
                        a.hora.localeCompare(
                            b.hora
                        )
                );

        }, [
            citas,
            fechaSeleccionada,
            barberoSeleccionado
        ]);


    /* =========================================
       OBTENER NOMBRES
    ========================================= */

    function obtenerNombreBarbero(
        idBarbero: string
    ) {

        return (
            barberos.find(
                (barbero) =>
                    barbero.id === idBarbero
            )?.nombre ??
            "Sin barbero"
        );
    }


    function obtenerNombreServicio(
        idServicio: string
    ) {

        return (
            servicios.find(
                (servicio) =>
                    servicio.id === idServicio
            )?.nombre ??
            "Sin servicio"
        );
    }


    /* =========================================
       COLORES DE ESTADO
    ========================================= */

    function obtenerClaseEstado(
        estado: EstadoCita
    ) {

        switch (estado) {

            case "confirmado":
                return `
                    border-green-600
                    bg-green-950/40
                    text-green-400
                `;

            case "pendiente":
                return `
                    border-brand-gold
                    bg-yellow-950/30
                    text-brand-gold
                `;

            case "cancelado":
                return `
                    border-red-600
                    bg-red-950/40
                    text-red-400
                `;

            default:
                return "";
        }
    }


    function obtenerTextoEstado(
        estado: EstadoCita
    ) {

        switch (estado) {

            case "confirmado":
                return "Confirmada";

            case "pendiente":
                return "Pendiente";

            case "cancelado":
                return "Cancelada";
        }
    }


    /* =========================================
       CAMBIAR ESTADO
    ========================================= */

    async function cambiarEstado(
        idCita: string,
        nuevoEstado: EstadoCita
    ) {

        try {

            const citaActualizada =
                await citaService.actualizarEstado(
                    idCita,
                    nuevoEstado
                );

            setCitas(
                (citasActuales) =>
                    citasActuales.map(
                        (cita) =>
                            cita.id === idCita
                                ? citaActualizada
                                : cita
                    )
            );

            setMenuEstadoAbierto(null);

        } catch {

            setError(
                "No fue posible actualizar la cita."
            );
        }
    }


    /* =========================================
       CARGANDO
    ========================================= */

    if (cargando) {

        return (
            <div
                className="
                    app-container
                    py-12
                    text-center
                    text-brand-gray
                "
            >
                Cargando agenda...
            </div>
        );
    }


    /* =========================================
       INTERFAZ
    ========================================= */

    return (

        <section className="app-container py-10">

            {/* ENCABEZADO */}

            <header className="text-center">

                <h1
                    className="
                        text-4xl
                        font-extrabold
                        md:text-5xl
                    "
                >
                    Agenda Diaria
                </h1>

                <p
                    className="
                        mt-3
                        text-lg
                        font-semibold
                        text-brand-gray
                    "
                >
                    Consulta y administra las citas del día
                </p>

            </header>


            {/* ERROR */}

            {error && (

                <div
                    className="
                        mx-auto
                        mt-6
                        max-w-3xl
                        rounded-lg
                        border
                        border-red-600
                        bg-red-950/40
                        px-4
                        py-3
                        text-center
                        text-red-400
                    "
                >
                    {error}
                </div>
            )}


            {/* FILTROS */}

            <div
                className="
                    mx-auto
                    mt-10
                    grid
                    max-w-3xl
                    gap-6
                    md:grid-cols-2
                "
            >

                {/* FECHA */}

                <div>

                    <label
                        htmlFor="fecha"
                        className="
                            mb-2
                            block
                            font-semibold
                            text-brand-gold
                        "
                    >
                        Fecha
                    </label>

                    <input
                        id="fecha"
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(event) =>
                            setFechaSeleccionada(
                                event.target.value
                            )
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-admin-border
                            bg-admin-surface
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-brand-gold
                        "
                    />

                </div>


                {/* BARBERO */}

                <div>

                    <label
                        htmlFor="barbero"
                        className="
                            mb-2
                            block
                            font-semibold
                            text-brand-gold
                        "
                    >
                        Barbero
                    </label>

                    <select
                        id="barbero"
                        value={barberoSeleccionado}
                        onChange={(event) =>
                            setBarberoSeleccionado(
                                event.target.value
                            )
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-admin-border
                            bg-admin-surface
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-brand-gold
                        "
                    >

                        <option value="todos">
                            Todos
                        </option>

                        {barberos.map(
                            (barbero) => (

                                <option
                                    key={barbero.id}
                                    value={barbero.id}
                                >
                                    {barbero.nombre}
                                </option>
                            )
                        )}

                    </select>

                </div>

            </div>


            {/* TABLA */}

            <section
                className="
                    relative
                    mt-12
                    overflow-visible
                    rounded-xl
                    border
                    border-brand-gold
                    bg-admin-surface
                "
            >

                <table
                    className="
                        w-full
                        min-w-[800px]
                    "
                >

                    <thead>

                    <tr
                        className="
                                border-b
                                border-gray-700
                                text-brand-gold
                            "
                    >

                        <th className="px-6 py-4 text-left">
                            Hora
                        </th>

                        <th className="px-6 py-4 text-left">
                            Cliente
                        </th>

                        <th className="px-6 py-4 text-left">
                            Servicio
                        </th>

                        <th className="px-6 py-4 text-left">
                            Barbero
                        </th>

                        <th className="px-6 py-4 text-left">
                            Estado
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {citasFiltradas.length === 0 ? (

                        <tr>

                            <td
                                colSpan={5}
                                className="
                                        px-6
                                        py-10
                                        text-center
                                        text-brand-gray
                                    "
                            >
                                No hay citas para los filtros seleccionados.
                            </td>

                        </tr>

                    ) : (

                        citasFiltradas.map(
                            (cita) => (

                                <tr
                                    key={cita.id}
                                    className="
                                            border-t
                                            border-gray-800
                                        "
                                >

                                    {/* HORA */}

                                    <td className="px-6 py-4">
                                        {cita.hora}
                                    </td>


                                    {/* CLIENTE */}

                                    <td className="px-6 py-4">
                                        {cita.nombreCliente}
                                    </td>


                                    {/* SERVICIO */}

                                    <td className="px-6 py-4">

                                        {
                                            obtenerNombreServicio(
                                                cita.idServicio
                                            )
                                        }

                                    </td>


                                    {/* BARBERO */}

                                    <td className="px-6 py-4">

                                        {
                                            obtenerNombreBarbero(
                                                cita.idBarbero
                                            )
                                        }

                                    </td>


                                    {/* ESTADO */}

                                    <td
                                        className="
                                                relative
                                                px-6
                                                py-4
                                            "
                                    >

                                        <div
                                            className="
                                                    relative
                                                    inline-block
                                                    w-[170px]
                                                "
                                        >

                                            {/* BOTÓN */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMenuEstadoAbierto(
                                                        menuEstadoAbierto ===
                                                        cita.id
                                                            ? null
                                                            : cita.id
                                                    )
                                                }
                                                className={`
                                                        flex
                                                        w-full
                                                        items-center
                                                        justify-between
                                                        rounded-full
                                                        border
                                                        px-4
                                                        py-2
                                                        text-sm
                                                        font-semibold
                                                        transition
                                                        hover:brightness-125
                                                        ${obtenerClaseEstado(
                                                    cita.estado
                                                )}
                                                    `}
                                            >

                                                    <span>
                                                        {
                                                            obtenerTextoEstado(
                                                                cita.estado
                                                            )
                                                        }
                                                    </span>

                                                <span
                                                    className="
                                                            text-xs
                                                            opacity-80
                                                        "
                                                >
                                                        {
                                                            menuEstadoAbierto ===
                                                            cita.id
                                                                ? "▲"
                                                                : "▼"
                                                        }
                                                    </span>

                                            </button>


                                            {/* MENÚ FLOTANTE */}

                                            {menuEstadoAbierto ===
                                                cita.id && (

                                                    <div
                                                        className="
                                                            absolute
                                                            right-0
                                                            top-full
                                                            z-50
                                                            mt-2
                                                            w-[170px]
                                                            overflow-hidden
                                                            rounded-xl
                                                            border
                                                            border-brand-gold
                                                            bg-[#111820]
                                                            shadow-[0_10px_30px_rgba(0,0,0,0.65)]
                                                        "
                                                    >

                                                        {/* PENDIENTE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    cita.id,
                                                                    "pendiente"
                                                                )
                                                            }
                                                            className="
                                                                block
                                                                w-full
                                                                px-4
                                                                py-3
                                                                text-left
                                                                font-semibold
                                                                text-brand-gold
                                                                transition
                                                                hover:bg-[#242c36]
                                                            "
                                                        >
                                                            Pendiente
                                                        </button>


                                                        {/* CONFIRMADA */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    cita.id,
                                                                    "confirmado"
                                                                )
                                                            }
                                                            className="
                                                                block
                                                                w-full
                                                                border-t
                                                                border-gray-700
                                                                px-4
                                                                py-3
                                                                text-left
                                                                font-semibold
                                                                text-green-400
                                                                transition
                                                                hover:bg-[#242c36]
                                                            "
                                                        >
                                                            Confirmada
                                                        </button>


                                                        {/* CANCELADA */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                cambiarEstado(
                                                                    cita.id,
                                                                    "cancelado"
                                                                )
                                                            }
                                                            className="
                                                                block
                                                                w-full
                                                                border-t
                                                                border-gray-700
                                                                px-4
                                                                py-3
                                                                text-left
                                                                font-semibold
                                                                text-red-400
                                                                transition
                                                                hover:bg-[#242c36]
                                                            "
                                                        >
                                                            Cancelada
                                                        </button>

                                                    </div>
                                                )}

                                        </div>

                                    </td>

                                </tr>
                            )
                        )
                    )}

                    </tbody>

                </table>

            </section>

        </section>
    );
}