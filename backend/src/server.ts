/* ================================================
    backend/src/server.ts
    Punto de entrada de BarberSlot API
================================================ */
import "dotenv/config";
import app from "./app";

const PORT = Number( process.env.PORT ) || 4000;

app.listen( PORT, () => {
    console.log(`BarberSlot API ejecutándose en http://localhost:${PORT}`);
});
