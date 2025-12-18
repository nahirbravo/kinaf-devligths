"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => (await api.get("/appointments")).data.data,
  });

  const { data: schedules } = useQuery({
    queryKey: ["admin-schedules-count"],
    queryFn: async () => (await api.get("/schedules")).data.data,
  });

  const { data: sedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: async () => (await api.get("/sedes")).data.data,
  });

  const { data: pros } = useQuery({
    queryKey: ["pros"],
    queryFn: async () => (await api.get("/users/professionals")).data.data,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      await api.patch(`/appointments/${id}/status`, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] }),
  });

  const pendingCount =
    appointments?.filter((a: any) => a.status === "pending").length || 0;
  const confirmedCount =
    appointments?.filter((a: any) => a.status === "confirmed").length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 skeleton rounded-xl" />
          ))}
        </div>
        <div className="h-96 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--gray-500)] mt-1">
            Resumen de actividad y gestión de turnos
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--gray-500)]">
                Total Turnos
              </p>
              <p className="text-3xl font-bold text-[var(--gray-900)] mt-1">
                {appointments?.length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-[var(--primary-50)] rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--primary-600)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--gray-500)]">
                Pendientes
              </p>
              <p className="text-3xl font-bold text-[var(--warning-600)] mt-1">
                {pendingCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-[var(--warning-50)] rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[var(--warning-600)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Link href="/admin/sedes">
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--gray-500)]">
                  Sedes
                </p>
                <p className="text-3xl font-bold text-[var(--success-600)] mt-1">
                  {sedes?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--success-50)] rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--success-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/admin/profesionales">
          <Card hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--gray-500)]">
                  Profesionales
                </p>
                <p className="text-3xl font-bold text-[var(--primary-600)] mt-1">
                  {pros?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--primary-50)] rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[var(--primary-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Appointments Table */}
      <Card padding="none">
        <div className="p-4 sm:p-6 border-b border-[var(--gray-100)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--gray-900)]">
                Últimos Turnos
              </h2>
              <p className="text-sm text-[var(--gray-500)]">
                Gestiona los turnos recientes
              </p>
            </div>
            <Link href="/admin/horarios">
              <Button variant="secondary" size="sm">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Horarios ({schedules?.length || 0})
              </Button>
            </Link>
          </div>
        </div>

        {appointments?.length === 0 ? (
          <EmptyState
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            title="No hay turnos registrados"
            description="Los turnos aparecerán aquí cuando los clientes reserven."
            action={
              <Link href="/reservar">
                <Button size="sm">Crear primer turno</Button>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--gray-100)] bg-[var(--gray-50)]">
                  <th className="text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3">
                    Fecha/Hora
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3 hidden md:table-cell">
                    Profesional
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3 hidden lg:table-cell">
                    Servicio
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3 hidden lg:table-cell">
                    Sede
                  </th>
                  <th className="text-left text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3">
                    Estado
                  </th>
                  <th className="text-right text-xs font-medium text-[var(--gray-500)] uppercase tracking-wider px-4 sm:px-6 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gray-100)]">
                {appointments?.slice(0, 10).map((appt: any) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-[var(--gray-50)] transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm font-medium text-[var(--gray-900)]">
                        {new Date(appt.date).toLocaleDateString("es-AR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="text-sm text-[var(--gray-500)]">
                        {appt.startTime} hs
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${appt.clientId?.firstName} ${appt.clientId?.lastName}`}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-[var(--gray-900)] truncate">
                            {appt.clientId?.firstName} {appt.clientId?.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-[var(--gray-700)]">
                        {appt.professionalId?.firstName}{" "}
                        {appt.professionalId?.lastName}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-[var(--gray-700)]">
                        {appt.serviceId?.name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-[var(--gray-700)]">
                        {appt.sedeId?.name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      {appt.status === "pending" && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              statusMutation.mutate({
                                id: appt._id,
                                status: "confirmed",
                              })
                            }
                            className="p-2 rounded-lg text-[var(--success-600)] hover:bg-[var(--success-50)] transition-colors"
                            title="Confirmar"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("¿Cancelar este turno?")) {
                                statusMutation.mutate({
                                  id: appt._id,
                                  status: "cancelled",
                                });
                              }
                            }}
                            className="p-2 rounded-lg text-[var(--error-600)] hover:bg-[var(--error-50)] transition-colors"
                            title="Cancelar"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
