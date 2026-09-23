/* ===========================================
    web/src/lib/rateLimit.ts
    Límite de solicitudes por IP
=========================================== */

// Limitador en memoria por instancia del servidor: suficiente para frenar
// abuso básico en un proyecto de cátedra. No se comparte entre instancias
// serverless distintas; si eso llega a importar, el siguiente paso es un
// almacén externo (Redis/Upstash).
const intentosPorClave = new Map<string, { conteo: number; reinicioEn: number }>();

export function obtenerIp(request: Request): string {
    const reenviada = request.headers.get("x-forwarded-for");
    return reenviada?.split(",")[0]?.trim() ?? "desconocida";
}

export function limiteExcedido(
    clave: string,
    { limite, ventanaMs }: { limite: number; ventanaMs: number }
): boolean {
    const ahora = Date.now();
    const registro = intentosPorClave.get(clave);

    if (!registro || registro.reinicioEn < ahora) {
        intentosPorClave.set(clave, { conteo: 1, reinicioEn: ahora + ventanaMs });
        return false;
    }

    registro.conteo += 1;

    return registro.conteo > limite;
}
