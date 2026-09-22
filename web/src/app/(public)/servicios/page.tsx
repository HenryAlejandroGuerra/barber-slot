/*
web/src/app/(public)/servicios/page.tsx
============================================================================
Página para seleccionar los servicios disponibles antes de elegir un horario.
============================================================================
*/

/*
"use client" le indica a Next.js que esta página necesita ejecutarse del lado del cliente.
Lo necesitamos porque vamos a utilizar:
- useState
- useEffect
- useMemo
- useRouter
- useSearchParams
y además vamos a leer los servicios desde
LocalStorage mediante servicioService.
*/
"use client";

/*
Importamos varios hooks de React.
useState: permite guardar información que puede cambiar
useEffect: permite ejecutar código cuando la página se carga.
useMemo: permite calcular el total de los servicios seleccionados.
useRouter: permite cambiar de una página a otra mediante código.
useSearchParams: permite leer información que venga en la URL.
*/
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useRouter,
    useSearchParams,
} from "next/navigation";

/*
Importamos el tipo Servicio: permite indicarle a TypeScript qué estructura tiene cada servicio.
*/
import type {Servicio} from "@/types/servicio";

/*
Importamos el servicio que ya estaba preparado en nuestro proyecto.
servicioService.obtenerActivos(): Esa función ya obtiene todos los servicios y filtra solamente los que tienen: activo: true
*/
import {servicioService} from "@/services/servicio.service";

/*
Importamos la tarjeta: Cada servicio aparecerá utilizando este componente.
*/
import ServiciosCard from "@/components/ServiciosCard";


/*
================================================
COMPONENTE PRINCIPAL
================================================
representa toda la página: /servicios
*/
export default function ServiciosPage() {

/*
router: permite navegar entre páginas.
*/
    const router = useRouter();

/*
searchParams: permite leer parámetros que vengan en la URL.
*/
    const searchParams = useSearchParams();

/*
ESTADO: SERVICIOS
Aquí almacenaremos todos los servicios activos que obtengamos del servicio.
*/
    const [servicios, setServicios] = useState<Servicio[]>([]);

/*
ESTADO: SERVICIOS SELECCIONADOS
Aquí guardaremos los IDs de los servicios que el usuario haya seleccionado.
*/
    const [seleccionados, setSeleccionados] =
        useState<string[]>([]);

/*
ESTADO: CARGANDO
Mientras estamos obteniendo los servicios desde LocalStorage mostramos un mensaje de carga.
Comienza siendo: true
y después cambia a: false
*/
    const [cargando, setCargando] = useState(true);

/*
OBTENER EL BARBERO
Intentamos obtener de la URL un parámetro llamado "barbero".
*/
    const nombreBarbero = searchParams.get("barbero");

/*
CARGAR SERVICIOS
useEffect se ejecuta cuando el componente se carga.
llamamos a: servicioService.obtenerActivos() para obtener únicamente los servicios activos.
*/
    useEffect(() => {

/*
Creamos una función asíncrona porque obtenerActivos() devuelve una Promise.
*/
        async function cargarServicios() {

            try {
/*
Llamamos al servicio que ya existe en nuestro proyecto.
El resultado será un arreglo de servicios activos.
*/
                const serviciosActivos =
                    await servicioService.obtenerActivos();

/*
Guardamos los servicios obtenidos en nuestro estado.
*/
                setServicios(serviciosActivos);

            } finally {

/*
Independientemente de si la carga termina correctamente, dejamos de mostrar "Cargando servicios...".
*/
                setCargando(false);
            }
        }

/*
Ejecutamos la función que acabamos de crear.
*/
        cargarServicios();

    }, []);

 /*
========================================================
SELECCIONAR / DESELECCIONAR SERVICIO
========================================================
se ejecuta cuando el usuario hace clic sobre una tarjeta.
Recibe: id que corresponde al ID del servicio.
*/
    function manejarSeleccion(id: string) {

/*
setSeleccionados recibe una función.
"actuales" representa el arreglo actual de servicios seleccionados.
*/
        setSeleccionados((actuales) => {

/*
Comprobamos si el servicio ya estaba seleccionado.
*/
            if (actuales.includes(id)) {

/*
Si ya estaba seleccionado, lo eliminamos. filter conserva todos los demás IDs.
*/
                return actuales.filter(
                    (actual) => actual !== id
                );
            }

/*
Si no estaba seleccionado, agregamos el nuevo ID al arreglo.
Usamos los tres puntos "..." para conservar los servicios que ya estaban seleccionados.
*/
            return [...actuales, id];
        });
    }

 /*
========================================================
CALCULAR TOTAL
========================================================
useMemo calcula el precio total de los servicios seleccionados.
*/
    const total = useMemo(() => {

/*
Primero buscamos únicamente los servicios cuyos IDs estén dentro de "seleccionados".
*/
        return servicios
            .filter(
                (servicio) =>
                    seleccionados.includes(servicio.id)
            )

/*
Después sumamos sus precios. "suma" comienza en 0. En cada servicio agregamos: servicio.precio
*/
            .reduce(
                (suma, servicio) =>
                    suma + servicio.precio,
                0
            );

/*
Estas variables son las que necesitamos para realizar el cálculo.
Si cambia cualquiera de ellas, el total se vuelve a calcular.
*/
    }, [servicios, seleccionados]);

/*
========================================================
BOTÓN REGRESAR
========================================================
*/
    function regresar() {

/*
utilizamos router.push(). Navegamos a la ruta: /barberos
*/
        router.push("/barberos");
    }

/*
========================================================
BOTÓN SEGUIR
========================================================
*/
    function seguir() {

/*
Antes de avanzar comprobamos que exista por lo menos un servicio seleccionado.
Si no hay ninguno: seleccionados.length === 0 simplemente salimos de la función.
*/
        if (seleccionados.length === 0) {
            return;
        }

/*
URLSearchParams nos ayuda a construir correctamente los parámetros que enviaremos a la siguiente página.
*/
        const parametros = new URLSearchParams();

/*
Convertimos el arreglo de IDs en un texto.
Ejemplo: ["1", "3", "5"] se convierte en: "1,3,5"
*/
        parametros.set(
            "servicios",
            seleccionados.join(",")
        );

/*
Si tenemos información del barbero, también la enviamos a Horarios.
*/
        if (nombreBarbero) {

            parametros.set(
                "barbero",
                nombreBarbero
            );
        }

/*
Finalmente navegamos a: /horarios llevando los parámetros.
*/
        router.push(
            `/horarios?${parametros.toString()}`
        );
    }

 /*
========================================================
INTERFAZ VISUAL
========================================================
*/
    return (

/*
"section" representa la sección principal de nuestra página.
*/
        <section className="section-spacing">

            {
/*
"app-container" es una clase que ya existe en globals.css
Nos ayuda a mantener el contenido centrado y con márgenes apropiados.
*/
            }
            <div className="app-container max-w-6xl">

                {
/*
=================================================
TÍTULO
=================================================
Corresponde al título de la pantalla mostrado en el diseño.
*/
                }
                <h1 className="section-title text-2xl md:text-3xl">
                    Selecciona los servicios que necesitas
                </h1>


                {
/*
Contenedor donde estará todo el contenido de la selección de servicios.
*/
                }
                <div className="mx-auto mt-10 max-w-5xl">


                    {
/*
=================================================
ESTADO DE CARGA
=================================================
Mientras obtenemos los servicios, mostramos: Cargando servicios...
*/
                    }
                    {cargando ? (

                        <div className="py-16 text-center text-lg font-semibold">
                            Cargando servicios...
                        </div>

                    ) : servicios.length === 0 ? (

/*
=================================================
NO HAY SERVICIOS
=================================================
Si terminamos de cargar pero no existen servicios activos, mostramos este mensaje.
*/
                        <div className="card-dark p-8 text-center">

                            <p className="text-lg font-semibold">
                                No hay servicios disponibles.
                            </p>

                        </div>

                    ) : (

/*
=================================================
LISTA DE SERVICIOS
=================================================
Si sí existen servicios, usamos "map" para crear una tarjeta por cada servicio.
*/
                        <div className="space-y-4">

                            {servicios.map((servicio) => (

/*
ServiciosCard representa una tarjeta individual.
"key": Identificador que React necesita para manejar correctamente la lista.
"servicio": Enviamos toda la información del servicio.
"seleccionado": Indicamos si está seleccionado.
"onToggle": Enviamos la función que permite seleccionar o deseleccionar.
*/
                                <ServiciosCard
                                    key={servicio.id}
                                    servicio={servicio}
                                    seleccionado={
                                        seleccionados.includes(
                                            servicio.id
                                        )
                                    }
                                    onToggle={
                                        manejarSeleccion
                                    }
                                />

                            ))}

                        </div>
                    )}

                    {
/*
=================================================
RESUMEN
=================================================
Esta barra muestra información resumida antes de continuar.
*/
                    }
                    <div className="mt-7 flex min-h-12 items-center justify-between rounded-2xl bg-[#55565b] px-4 py-3 text-sm font-bold text-white md:px-5">

                        <span>
                            Barbero:{" "}

                            {
/*
Si tenemos el parámetro "barbero", mostramos su valor.
Si no existe todavía, mostramos un texto provisional.
*/
                            }
                            {nombreBarbero ??
                                "Barbero seleccionado"}
                        </span>


                        <span>
                            Total: ${total}
                        </span>

                    </div>

                    {
/*
=================================================
BOTONES DE NAVEGACIÓN
=================================================
Tenemos dos botones:
Regresar → /barberos
Seguir   → /horarios
*/
                    }
                    <div className="mt-5 flex items-center justify-between gap-4">


                        {
/*
BOTÓN REGRESAR
*/
                        }
                        <button
                            type="button"
                            onClick={regresar}
                            className="btn-navigation min-w-32 text-base md:min-w-40"
                        >
                            Regresar
                        </button>

                        {
/*
BOTÓN SEGUIR
*/
                        }
                        <button
                            type="button"

/*
Cuando el usuario haga clic, ejecutamos la función "seguir".
*/
                            onClick={seguir}

/*
Si no hay servicios seleccionados, el botón queda deshabilitado.
Esto evita que el usuario avance sin escoger un servicio.
*/
                            disabled={
                                seleccionados.length === 0
                            }

                            className="btn-navigation min-w-32 text-base md:min-w-40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Seguir
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}