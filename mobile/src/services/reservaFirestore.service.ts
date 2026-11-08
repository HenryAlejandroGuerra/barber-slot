/* =====================================================
    mobile/src/services/reservaFirestore.service.ts
    Guarda en Firestore una referencia de las reservas asociadas al usuario autenticado en BarberSlot Mobile.
===================================================== */
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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
        fechaRegistro: serverTimestamp()
    });

    return true;
}

export const reservaFirestoreService = { guardarReserva };
