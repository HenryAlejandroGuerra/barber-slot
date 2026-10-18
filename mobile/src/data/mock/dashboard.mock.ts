export const dashboardMock = {
    resumen: {
        citasHoy: 12,
        nuevasCitas: 4,
        canceladas: 2,
        serviciosActivos: 4
    },
    citasNuevas: [
        {
            id: "1",
            hora: "09:00 AM",
            cliente: "Carlos Mendoza",
            servicio: "Solo Corte",
            barbero: "Andres"
        },
        {
            id: "2",
            hora: "10:30 AM",
            cliente: "Victor Flores",
            servicio: "Corte y Barba",
            barbero: "Luis"
        },
        {
            id: "3",
            hora: "12:00 PM",
            cliente: "Elias Quinteros",
            servicio: "Solo Barba",
            barbero: "Carlos"
        },
        {
            id: "4",
            hora: "02:00 PM",
            cliente: "Samuel Anaya",
            servicio: "Corte y Barba",
            barbero: "Miguel"
        }
    ],
    barberosDisponibles: [
        "Miguel Salguero",
        "Andres Portillo",
        "Luis Enrique",
        "Carlos Mancia"
    ]
};
