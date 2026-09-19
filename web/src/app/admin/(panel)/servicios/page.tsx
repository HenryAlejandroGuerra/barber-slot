// web/src/app/admin/(panel)/servicios/page.tsx
/* ===========================================
    Página Admin - Servicios
=========================================== */
"use client";

import {
    FormEvent,
    useEffect,
    useState
} from "react";

import { servicioService } from "@/services/servicio.service";

import type { Servicio } from "@/types/servicio";


interface FormularioServicio {
    nombre: string;
    descripcion: string;
    precio: string;
    duracionMinutos: string;
}


const formularioInicial: FormularioServicio = {
    nombre: "",
    descripcion: "",
    precio: "",
    duracionMinutos: ""
};


export default function ServiciosPage() {

    const [servicios, setServicios] =
        useState<Servicio[]>([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");

    const [mensaje, setMensaje] =
        useState("");

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [servicioEditando, setServicioEditando] =
        useState<Servicio | null>(null);

    const [formulario, setFormulario] =
        useState<FormularioServicio>(
            formularioInicial
        );


    /* =========================================
       CARGAR SERVICIOS
    ========================================= */

    useEffect(() => {

        async function cargarServicios() {

            try {

                const datos =
                    await servicioService.obtenerTodos();

                setServicios(datos);

            } catch {

                setError(
                    "No fue posible cargar los servicios."
                );

            } finally {

                setCargando(false);
            }
        }

        cargarServicios();

    }, []);


    /* =========================================
       ABRIR NUEVO SERVICIO
    ========================================= */

    function abrirNuevoServicio() {

        setServicioEditando(null);

        setFormulario(
            formularioInicial
        );

        setError("");
        setMensaje("");

        setMostrarFormulario(true);
    }


    /* =========================================
       ABRIR EDICIÓN
    ========================================= */

    function abrirEdicion(
        servicio: Servicio
    ) {

        setServicioEditando(servicio);

        setFormulario({
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            precio: servicio.precio.toString(),
            duracionMinutos:
                servicio.duracionMinutos.toString()
        });

        setError("");
        setMensaje("");

        setMostrarFormulario(true);
    }


    /* =========================================
       CERRAR FORMULARIO
    ========================================= */

    function cerrarFormulario() {

        setMostrarFormulario(false);

        setServicioEditando(null);

        setFormulario(
            formularioInicial
        );

        setError("");
    }


    /* =========================================
       GUARDAR
    ========================================= */

    async function guardarServicio(
        event: FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");
        setMensaje("");

        const nombre =
            formulario.nombre.trim();

        const descripcion =
            formulario.descripcion.trim();

        const precio =
            Number(formulario.precio);

        const duracion =
            Number(
                formulario.duracionMinutos
            );


        /* VALIDACIONES */

        if (!nombre) {

            setError(
                "El nombre del servicio es obligatorio."
            );

            return;
        }

        if (
            Number.isNaN(precio) ||
            precio <= 0
        ) {

            setError(
                "Ingresa un precio válido mayor que cero."
            );

            return;
        }

        if (
            Number.isNaN(duracion) ||
            duracion <= 0
        ) {

            setError(
                "Ingresa una duración válida mayor que cero."
            );

            return;
        }


        try {

            if (servicioEditando) {

                const actualizado =
                    await servicioService.actualizar(
                        servicioEditando.id,
                        {
                            nombre,
                            descripcion,
                            precio,
                            duracionMinutos:
                            duracion,
                            activo:
                            servicioEditando.activo
                        }
                    );

                setServicios(
                    (actuales) =>
                        actuales.map(
                            (servicio) =>
                                servicio.id ===
                                actualizado.id
                                    ? actualizado
                                    : servicio
                        )
                );

                setMensaje(
                    "Servicio actualizado correctamente."
                );

            } else {

                const nuevo =
                    await servicioService.crear({
                        nombre,
                        descripcion,
                        precio,
                        duracionMinutos:
                        duracion,
                        activo: true
                    });

                setServicios(
                    (actuales) => [
                        ...actuales,
                        nuevo
                    ]
                );

                setMensaje(
                    "Servicio agregado correctamente."
                );
            }

            cerrarFormulario();

        } catch (errorDesconocido) {

            if (
                errorDesconocido
                instanceof Error
            ) {

                setError(
                    errorDesconocido.message
                );

            } else {

                setError(
                    "No fue posible guardar el servicio."
                );
            }
        }
    }


    /* =========================================
       ACTIVAR / DESACTIVAR
    ========================================= */

    async function cambiarEstado(
        servicio: Servicio
    ) {

        setError("");
        setMensaje("");

        try {

            const actualizado =
                await servicioService
                    .cambiarEstado(
                        servicio.id,
                        !servicio.activo
                    );

            setServicios(
                (actuales) =>
                    actuales.map(
                        (item) =>
                            item.id ===
                            actualizado.id
                                ? actualizado
                                : item
                    )
            );

            setMensaje(
                actualizado.activo
                    ? "Servicio activado correctamente."
                    : "Servicio desactivado correctamente."
            );

        } catch {

            setError(
                "No fue posible cambiar el estado del servicio."
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
                Cargando servicios...
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
                    Gestión de Servicios
                </h1>

                <p
                    className="
                        mt-3
                        text-lg
                        font-semibold
                        text-brand-gray
                    "
                >
                    Alta, baja y edición de servicios ofrecidos
                </p>

            </header>


            {/* MENSAJES */}

            {error && (

                <div
                    className="
                        mx-auto
                        mt-6
                        max-w-4xl
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


            {mensaje && (

                <div
                    className="
                        mx-auto
                        mt-6
                        max-w-4xl
                        rounded-lg
                        border
                        border-green-600
                        bg-green-950/40
                        px-4
                        py-3
                        text-center
                        text-green-400
                    "
                >
                    {mensaje}
                </div>
            )}


            {/* BOTÓN AGREGAR */}

            <div
                className="
                    mx-auto
                    mt-10
                    flex
                    max-w-6xl
                    justify-end
                "
            >

                <button
                    type="button"
                    onClick={
                        abrirNuevoServicio
                    }
                    className="
                        rounded-lg
                        border
                        border-brand-gold
                        bg-brand-gold
                        px-5
                        py-3
                        font-bold
                        text-black
                        transition
                        hover:brightness-110
                    "
                >
                    + AGREGAR SERVICIO
                </button>

            </div>


            {/* TABLA */}

            <section
                className="
                    mx-auto
                    mt-6
                    max-w-6xl
                    overflow-hidden
                    rounded-xl
                    border
                    border-brand-gold
                    bg-admin-surface
                "
            >

                <div className="overflow-x-auto">

                    <table
                        className="
                            w-full
                            min-w-[900px]
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

                            <th className="px-5 py-4 text-left">
                                Servicio
                            </th>

                            <th className="px-5 py-4 text-left">
                                Descripción
                            </th>

                            <th className="px-5 py-4 text-left">
                                Precio
                            </th>

                            <th className="px-5 py-4 text-left">
                                Duración
                            </th>

                            <th className="px-5 py-4 text-left">
                                Estado
                            </th>

                            <th className="px-5 py-4 text-center">
                                Acciones
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {servicios.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="
                                            px-6
                                            py-10
                                            text-center
                                            text-brand-gray
                                        "
                                >
                                    No hay servicios registrados.
                                </td>

                            </tr>

                        ) : (

                            servicios.map(
                                (servicio) => (

                                    <tr
                                        key={
                                            servicio.id
                                        }
                                        className="
                                                border-t
                                                border-gray-800
                                            "
                                    >

                                        {/* NOMBRE */}

                                        <td
                                            className="
                                                    px-5
                                                    py-4
                                                    font-semibold
                                                    text-white
                                                "
                                        >
                                            {
                                                servicio.nombre
                                            }
                                        </td>


                                        {/* DESCRIPCIÓN */}

                                        <td
                                            className="
                                                    max-w-[300px]
                                                    px-5
                                                    py-4
                                                    text-brand-gray
                                                "
                                        >
                                            {
                                                servicio.descripcion ||
                                                "Sin descripción"
                                            }
                                        </td>


                                        {/* PRECIO */}

                                        <td
                                            className="
                                                    px-5
                                                    py-4
                                                "
                                        >
                                            $
                                            {
                                                servicio.precio
                                                    .toFixed(
                                                        2
                                                    )
                                            }
                                        </td>


                                        {/* DURACIÓN */}

                                        <td
                                            className="
                                                    px-5
                                                    py-4
                                                "
                                        >
                                            {
                                                servicio.duracionMinutos
                                            }
                                            {" min"}
                                        </td>


                                        {/* ESTADO */}

                                        <td
                                            className="
                                                    px-5
                                                    py-4
                                                "
                                        >

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-full
                                                        border
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold

                                                        ${
                                                        servicio.activo
                                                            ? `
                                                                    border-green-600
                                                                    bg-green-950/40
                                                                    text-green-400
                                                                `
                                                            : `
                                                                    border-red-600
                                                                    bg-red-950/40
                                                                    text-red-400
                                                                `
                                                    }
                                                    `}
                                                >

                                                    {
                                                        servicio.activo
                                                            ? "Activo"
                                                            : "Inactivo"
                                                    }

                                                </span>

                                        </td>


                                        {/* ACCIONES */}

                                        <td
                                            className="
                                                    px-5
                                                    py-4
                                                "
                                        >

                                            <div
                                                className="
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-3
                                                    "
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirEdicion(
                                                            servicio
                                                        )
                                                    }
                                                    className="
                                                            rounded-lg
                                                            border
                                                            border-brand-gold
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-brand-gold
                                                            transition
                                                            hover:bg-yellow-950/40
                                                        "
                                                >
                                                    EDITAR
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        cambiarEstado(
                                                            servicio
                                                        )
                                                    }
                                                    className={`
                                                            rounded-lg
                                                            border
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            transition

                                                            ${
                                                        servicio.activo
                                                            ? `
                                                                        border-red-600
                                                                        text-red-400
                                                                        hover:bg-red-950/40
                                                                    `
                                                            : `
                                                                        border-green-600
                                                                        text-green-400
                                                                        hover:bg-green-950/40
                                                                    `
                                                    }
                                                        `}
                                                >

                                                    {
                                                        servicio.activo
                                                            ? "DESACTIVAR"
                                                            : "ACTIVAR"
                                                    }

                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                )
                            )
                        )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* =================================
                MODAL AGREGAR / EDITAR
            ================================= */}

            {mostrarFormulario && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/75
                        px-4
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-lg
                            rounded-2xl
                            border
                            border-brand-gold
                            bg-[#111820]
                            p-6
                            shadow-2xl
                        "
                    >

                        {/* CABECERA */}

                        <div
                            className="
                                mb-6
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        text-white
                                    "
                                >
                                    {
                                        servicioEditando
                                            ? "Editar Servicio"
                                            : "Agregar Servicio"
                                    }
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-brand-gray
                                    "
                                >
                                    {
                                        servicioEditando
                                            ? "Modifica los datos del servicio seleccionado."
                                            : "Ingresa los datos del nuevo servicio."
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    cerrarFormulario
                                }
                                className="
                                    text-2xl
                                    text-brand-gray
                                    transition
                                    hover:text-white
                                "
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                guardarServicio
                            }
                            className="
                                space-y-5
                            "
                        >

                            {/* NOMBRE */}

                            <div>

                                <label
                                    htmlFor="nombre"
                                    className="
                                        mb-2
                                        block
                                        font-semibold
                                        text-brand-gold
                                    "
                                >
                                    Nombre
                                </label>

                                <input
                                    id="nombre"
                                    type="text"
                                    value={
                                        formulario.nombre
                                    }
                                    onChange={
                                        (event) =>
                                            setFormulario(
                                                {
                                                    ...formulario,
                                                    nombre:
                                                    event
                                                        .target
                                                        .value
                                                }
                                            )
                                    }
                                    placeholder="Ej. Corte Premium"
                                    className="
                                        w-full
                                        rounded-lg
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


                            {/* DESCRIPCIÓN */}

                            <div>

                                <label
                                    htmlFor="descripcion"
                                    className="
                                        mb-2
                                        block
                                        font-semibold
                                        text-brand-gold
                                    "
                                >
                                    Descripción
                                </label>

                                <textarea
                                    id="descripcion"
                                    rows={3}
                                    value={
                                        formulario.descripcion
                                    }
                                    onChange={
                                        (event) =>
                                            setFormulario(
                                                {
                                                    ...formulario,
                                                    descripcion:
                                                    event
                                                        .target
                                                        .value
                                                }
                                            )
                                    }
                                    placeholder="Descripción breve del servicio"
                                    className="
                                        w-full
                                        resize-none
                                        rounded-lg
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


                            {/* PRECIO + DURACIÓN */}

                            <div
                                className="
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                "
                            >

                                <div>

                                    <label
                                        htmlFor="precio"
                                        className="
                                            mb-2
                                            block
                                            font-semibold
                                            text-brand-gold
                                        "
                                    >
                                        Precio ($)
                                    </label>

                                    <input
                                        id="precio"
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={
                                            formulario.precio
                                        }
                                        onChange={
                                            (event) =>
                                                setFormulario(
                                                    {
                                                        ...formulario,
                                                        precio:
                                                        event
                                                            .target
                                                            .value
                                                    }
                                                )
                                        }
                                        placeholder="7.00"
                                        className="
                                            w-full
                                            rounded-lg
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


                                <div>

                                    <label
                                        htmlFor="duracion"
                                        className="
                                            mb-2
                                            block
                                            font-semibold
                                            text-brand-gold
                                        "
                                    >
                                        Duración (min)
                                    </label>

                                    <input
                                        id="duracion"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={
                                            formulario.duracionMinutos
                                        }
                                        onChange={
                                            (event) =>
                                                setFormulario(
                                                    {
                                                        ...formulario,
                                                        duracionMinutos:
                                                        event
                                                            .target
                                                            .value
                                                    }
                                                )
                                        }
                                        placeholder="30"
                                        className="
                                            w-full
                                            rounded-lg
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

                            </div>


                            {/* BOTONES */}

                            <div
                                className="
                                    flex
                                    justify-end
                                    gap-3
                                    pt-3
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        cerrarFormulario
                                    }
                                    className="
                                        rounded-lg
                                        border
                                        border-gray-600
                                        px-5
                                        py-3
                                        font-semibold
                                        text-brand-gray
                                        transition
                                        hover:bg-gray-800
                                    "
                                >
                                    CANCELAR
                                </button>


                                <button
                                    type="submit"
                                    className="
                                        rounded-lg
                                        border
                                        border-brand-gold
                                        bg-brand-gold
                                        px-5
                                        py-3
                                        font-bold
                                        text-black
                                        transition
                                        hover:brightness-110
                                    "
                                >

                                    {
                                        servicioEditando
                                            ? "GUARDAR CAMBIOS"
                                            : "AGREGAR SERVICIO"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </section>
    );
}