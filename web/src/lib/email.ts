/* ===========================================
    web/src/lib/email.ts
    Correo de confirmación de citas (Resend)
=========================================== */
import { Resend } from "resend";

interface DatosCorreoConfirmacion {
    correoCliente: string;
    nombreCliente: string;
    nombreBarbero: string;
    nombreServicio: string;
    fechaHoraTexto: string;
}

// Se llama sin "await" desde la ruta que crea la cita: si el correo falla,
// la cita ya quedó confirmada en la base y el error solo se registra aquí.
export async function enviarCorreoConfirmacion(datos: DatosCorreoConfirmacion): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn("RESEND_API_KEY no configurada: se omite el envío del correo de confirmación.");
        return;
    }

    try {
        const resend = new Resend(apiKey);

        await resend.emails.send({
            from: "BarberSlot <onboarding@resend.dev>",
            to: datos.correoCliente,
            subject: "Confirmación de tu cita en BarberSlot",
            html: `
                <p>Hola ${datos.nombreCliente},</p>
                <p>Tu cita quedó registrada:</p>
                <ul>
                    <li>Barbero: ${datos.nombreBarbero}</li>
                    <li>Servicio: ${datos.nombreServicio}</li>
                    <li>Fecha y hora: ${datos.fechaHoraTexto}</li>
                </ul>
                <p>Te esperamos en BarberSlot.</p>
            `,
        });
    } catch (error) {
        console.error("No se pudo enviar el correo de confirmación:", error);
    }
}
