import { createContext, useContext, useState, type ReactNode } from "react";
import type { Barbero } from "@/types/barbero";
import type { Servicio } from "@/types/servicio";
import type { CitaCreada } from "@/services/cita.service";

export function leerFecha(valor: string): Date | null {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
    if (!partes) return null;
    const [, dia, mes, anio] = partes.map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia ? fecha : null;
}

export function fechaValida(valor: string): boolean {
    const fecha = leerFecha(valor);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Boolean(fecha && fecha >= hoy && fecha.getDay() !== 0);
}

function useReservaState() {
    const [barberos, setBarberos] = useState<Barbero[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [barberoId, setBarberoId] = useState("");
    const [servicioSeleccionado, setServicioSeleccionado] = useState<string | null>(null);
    const [fecha, setFecha] = useState("");
    const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [confirmada, setConfirmada] = useState(false);
    const [citaCreada, setCitaCreada] = useState<CitaCreada | null>(null);
    function cambiarFecha(valor: string) { setFecha(valor); setHoraSeleccionada(null); }
    function reiniciar() {
        setBarberoId(""); setServicioSeleccionado(null); setFecha(""); setHoraSeleccionada(null);
        setNombre(""); setCorreo(""); setTelefono(""); setConfirmada(false); setCitaCreada(null);
    }
    return { barberos, setBarberos, servicios, setServicios, barberoId, setBarberoId, servicioSeleccionado, setServicioSeleccionado, fecha, cambiarFecha,
        horaSeleccionada, setHoraSeleccionada, nombre, setNombre, correo, setCorreo,
        telefono, setTelefono, confirmada, setConfirmada, citaCreada, setCitaCreada, reiniciar };
}
const ReservaContext = createContext<ReturnType<typeof useReservaState> | null>(null);
export function ReservaProvider({ children }: { children: ReactNode }) {
    const reserva = useReservaState();
    return <ReservaContext.Provider value={reserva}>{children}</ReservaContext.Provider>;
}
export function useReserva() {
    const reserva = useContext(ReservaContext);
    if (!reserva) throw new Error("Se requiere ReservaProvider.");
    return reserva;
}
