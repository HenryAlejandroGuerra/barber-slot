/* =====================================================
    mobile/src/services/reservaFirestore.service.ts
    Guarda y consulta en Firestore las reservas asociadas al usuario autenticado.
===================================================== */
import { collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, type Timestamp } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";
import type { CitaCreada } from "@/services/cita.service";

interface DatosReservaFirestore {
    cita: CitaCreada;
    barberoId: string;
    barberoNombre: string;
    servicioId: string;
    servicioNombre: string;
    fecha: string;
    hora: string;
}

export interface ReservaHistorial {
    citaId: string;
    fechaInicio: string;
    estado: "pendiente" | "confirmada" | "cancelada";
    barberoId: string;
    barberoNombre: string;
    servicioId: string;
    servicioNombre: string;
    fecha: string;
    hora: string;
    usuarioUid: string;
    usuarioCorreo: string;
    fechaRegistro?: Timestamp | null;
}

async function guardarReserva(datos: DatosReservaFirestore): Promise<boolean> {
    const usuario = firebaseAuth.currentUser;

    if (!usuario) {
        return false;
    }

    const referencia = doc(
        firestore,
        "usuarios",
        usuario.uid,
        "reservas",
        datos.cita.id
    );

    await setDoc(referencia, 
        {
            citaId: datos.cita.id,
            fechaInicio: datos.cita.fechaInicio,
            estado: datos.cita.estado,
            barberoId: datos.barberoId,
            barberoNombre: datos.barberoNombre,
            servicioId: datos.servicioId,
            servicioNombre: datos.servicioNombre,
            fecha: datos.fecha,
            hora: datos.hora,
            usuarioUid: usuario.uid,
            usuarioCorreo: usuario.email ?? "",
            fechaRegistro: serverTimestamp(),
        }
    );

    return true;
}

async function obtenerReservas(): Promise<ReservaHistorial[]> {
    const usuario = firebaseAuth.currentUser;

    if (!usuario) {
        throw new Error("No hay un usuario autenticado.");
    }

    const referencia = collection(firestore, "usuarios", usuario.uid, "reservas");
    const consulta = query(referencia, orderBy("fechaRegistro", "desc"));
    const resultado = await getDocs(consulta);

    return resultado.docs.map((documento) =>
        documento.data() as ReservaHistorial
    );
}

export const reservaFirestoreService = {
    guardarReserva,
    obtenerReservas
};
