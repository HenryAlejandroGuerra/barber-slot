// Importamos el tipo "Servicio" que ya existe en nuestro proyecto.
// Esto nos permite indicarle a TypeScript qué estructura tendra la información de cada servicio.
import type {Servicio} from "@/types/servicio";

// Definimos las propiedades (props) que recibirá nuestro componente.
// "servicio": Contiene toda la información del servicio que queremos mostrar.
// "seleccionado": Indica si actualmente el usuario tiene seleccionado este servicio.
// "onToggle": Es una función que recibimos desde la página de Servicios.
// La utilizaremos cuando el usuario haga clic sobre la tarjeta.
interface ServiciosCardProps {
    servicio: Servicio;
    seleccionado: boolean;
    onToggle: (id: string) => void;
}

// Creamos y exportamos el componente ServiciosCard.
// Este componente se encargará de dibujar UNA tarjeta de servicio.
// La página de Servicios podrá utilizar este componente varias veces: una vez por cada servicio disponible.
export default function ServiciosCard({
    servicio,
    seleccionado,
    onToggle,
}: ServiciosCardProps) {
    return (
// Utilizamos un botón para que toda la tarjeta sea seleccionable al hacer clic.
// "type='button'" evita que el botón se comporte como un botón de envío de formulario.
        <button
            type="button"

// Cuando el usuario hace clic en la tarjeta, ejecutamos la función "onToggle".
// Le enviamos el ID del servicio para que la página sepa cuál servicio fue seleccionado.
            onClick={() => onToggle(servicio.id)}

// "aria-pressed" ayuda a las tecnologías de asistencia a saber si este botón se encuentra seleccionado.
            aria-pressed={seleccionado}

// Clases de Tailwind CSS para construir el diseño.
// "flex": Coloca los elementos de la tarjeta en una fila.
// "w-full": Hace que la tarjeta ocupe todo el ancho disponible.
// "items-center": Centra verticalmente los elementos.
// "gap-5": Deja espacio entre los elementos.
// "rounded-2xl": Redondea las esquinas.
// "bg-brand-dark": Utiliza el color oscuro definido en el tema del proyecto.
// "px-5 py-4": Agrega espacio interno horizontal y vertical.
// "text-left": Alinea el texto hacia la izquierda.
// "text-white": Utiliza texto blanco.
// "shadow-md": Agrega una sombra.
// "transition": Hace más suaves las animaciones.
// "hover:scale-[1.01]": Hace que la tarjeta crezca ligeramente al pasar el mouse.
//La parte que contiene "seleccionado" es condicional:
//Si está seleccionado: aparece un borde/anillo dorado.
// Si no está seleccionado: no aparece ese anillo.
            className={`flex w-full items-center gap-5 rounded-2xl bg-brand-dark px-5 py-4 text-left text-white shadow-md transition hover:scale-[1.01] ${
                seleccionado
                    ? "ring-4 ring-brand-gold"
                    : "ring-0"
            }`}
        >
            {
/* 
======================================================
IMAGEN DEL SERVICIO
======================================================
En este momento utilizamos el logo que ya existe dentro de /public/images/brand/logo.png.
Más adelante las sustituiremos por imágenes específicas para cada servicio.
*/
            }
            <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black">
                <img
// Ruta de la imagen dentro de la carpeta public.
                    src="/images/brand/logo.png"

// No necesitamos texto alternativo porque la imagen es solamente decorativa.
                    alt=""

// "h-full w-full": Ocupa todo el espacio disponible.
// "object-contain": Mantiene las proporciones del logo.
// "opacity-80": Lo hace ligeramente transparente.
// "grayscale": Lo muestra en escala de grises.
                    className="h-full w-full object-contain opacity-80 grayscale"
                />
            </div>

            {
/*
======================================================
INFORMACIÓN DEL SERVICIO
======================================================
Aquí mostramos el nombre y la descripción.
*/
            }
            <div className="min-w-0 flex-1">

                {
/*
Nombre del servicio.
Por ejemplo: "Corte clásico"
*/
                }
                <h2 className="text-xl font-extrabold text-brand-gold">
                    {servicio.nombre}
                </h2>

                {
/*
Descripción del servicio. Este valor viene directamente del objeto "servicio".
*/
                }
                <p className="mt-1 text-xs font-semibold leading-relaxed text-white">
                    {servicio.descripcion}
                </p>
            </div>

            {
/*
======================================================
PRECIO
======================================================
Mostramos el precio del servicio.
El símbolo "$" lo colocamos nosotros.
El número viene de servicio.precio.
*/
            }
            <div className="shrink-0 text-4xl font-extrabold text-brand-gold">
                ${servicio.precio}
            </div>
        </button>
    );
}