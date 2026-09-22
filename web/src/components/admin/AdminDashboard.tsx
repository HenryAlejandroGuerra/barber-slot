"use client";
/* ================================================
    web/src/components/admin/AdminDashboard.tsx
    Panel principal administrativo
================================================ */
import {useEffect, useState} from "react";
import type {PanelDetalle} from "@/types/panel";
import {panelService} from "@/services/panel.service";
import DashboardCard from "@/components/admin/DashboardCard";
import Image from "next/image";

export default function AdminDashboard() {
    const [panel, setPanel,] = useState<PanelDetalle | null>(null);
    const [error, setError,] = useState("");

    useEffect(() => {
        async function cargarPanel() {
            try {
                const detalle = await panelService.obtenerDetalle();
                setPanel(detalle);
            } catch {
                setError("No fue posible cargar la información del panel");
            }
        }
        cargarPanel();
    }, []);

    if (error) {
        return (
            <div className="app-container py-12 text-center text-red-400">
                {error}
            </div>
        );
    }

    if (!panel) {
        return (
            <div className="app-container py-12 text-center text-brand-gray">
                Cargando panel...
            </div>
        );
    }

    return (
        <section className=" app-container py-10">
            {/* Encabezado */}
            <header className="text-center">
                <h1 className=" text-4xl font-extrabold md:text-5xl">
                    Panel de Inicio
                </h1>
                <p className="mt-3 text-lg font-semibold text-brand-gray md:text-xl">
                    Resumen General del Sistema y Citas Recientes
                </p>
            </header>
            {/* Indicadores */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardCard titulo="Citas de Hoy" valor={panel.citasHoy} icono="/images/admin/icons/citas-hoy.svg" />
                <DashboardCard titulo="Nuevas Citas" valor={panel.nuevasCitas} icono="/images/admin/icons/nuevas-citas.svg" />
                <DashboardCard titulo="Canceladas" valor={panel.citasCanceladas} icono="/images/admin/icons/canceladas.svg" />
                <DashboardCard titulo="Servicios Activos" valor={panel.serviciosActivos} icono="/images/admin/icons/servicios-activos.svg" />
            </div>
            {/* Zona inferior */}
            <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_320px]">
                {/* Citas recientes */}
                <section className="overflow-hidden rounded-xl border border-brand-gold bg-brand-dark">
                    <div className="border-b border-gray-800 px-6 py-4">
                        <h2 className="text-2xl font-bold text-brand-gold">
                            Citas Nuevas Agendadas
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px]">
                            <thead>
                                <tr className="text-brand-gray">
                                    <th className="px-6 py-4 text-left font-medium">
                                        Hora
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">
                                        Cliente
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">
                                        Servicio
                                    </th>
                                    <th className="px-6 py-4 text-left font-medium">
                                        Barbero
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    panel.citasRecientes.map((cita) => (
                                        <tr key={cita.id} className="border-t border-gray-800">
                                            <td className="px-6 py-4">
                                                {cita.hora}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cita.nombreCliente}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cita.nombreServicio}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cita.nombreBarbero}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </section>
                {/* Barberos disponibles */}
                <aside className="rounded-xl border border-brand-gold bg-brand-dark p-6">
                    <div className="mb-8 flex items-center gap-3">
                        <Image src="/images/admin/icons/barberos-disponibles.svg" alt="" width={48} height={48} />
                        <h2 className="text-xl font-semibold text-brand-gold">
                            Barberos Disponibles
                        </h2>
                    </div>
                    {
                        panel.barberosDisponibles.length === 0 ? (
                            <p className="text-brand-gray">
                                No hay barberos disponibles.
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {
                                    panel.barberosDisponibles.map((barbero) => (
                                        <div key={barbero.id} className="flex items-center gap-4">
                                            <span className="h-5 w-5 shrink-0 rounded-full bg-green-500" />
                                            <span>{ barbero.nombre}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </aside>
            </div>
        </section>
    );
}
