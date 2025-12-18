"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';
import { useUser, useLogout } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function MyAppointments() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useLogout();
  const { data: user, isLoading: userLoading } = useUser();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['my-appointments', user?._id],
    queryFn: async () => {
      if (!user) return [];
      const res = await api.get(`/appointments/my?clientId=${user._id}`);
      return res.data.data;
    },
    enabled: !!user,
    retry: 1
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => await api.patch(`/appointments/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] });
    }
  });

  const handleReprogram = async (apptId: string) => {
    if (confirm('Para cambiar el turno, primero debemos cancelar el actual y luego reservar uno nuevo. ¿Continuar?')) {
      await cancelMutation.mutateAsync(apptId);
      router.push('/reservar');
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--primary-600)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--gray-500)]">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--primary-50)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--gray-900)] mb-2">Inicia sesión</h2>
          <p className="text-[var(--gray-500)] mb-6">Debes iniciar sesión para ver tus turnos.</p>
          <div className="flex flex-col gap-3">
            <Link href="/login">
              <Button fullWidth>Iniciar Sesión</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" fullWidth>Volver al inicio</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--gray-50)] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[var(--error-50)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--error-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--gray-900)] mb-2">Error de conexión</h2>
          <p className="text-[var(--gray-500)] mb-6">No pudimos cargar tus turnos. Intenta nuevamente.</p>
          <Button onClick={() => window.location.reload()} fullWidth>
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--gray-100)] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-[var(--gray-900)]">Kinaf</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--gray-600)]">
              <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" />
              <span>{user.firstName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--gray-900)]">
              Hola, {user.firstName}
            </h1>
            <p className="text-[var(--gray-500)] mt-1">
              Gestiona tus turnos reservados
            </p>
          </div>
          <Link href="/reservar">
            <Button>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Turno
            </Button>
          </Link>
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
        ) : appointments?.length === 0 ? (
          <Card>
            <EmptyState
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="No tienes turnos"
              description="Reserva tu primer turno y aparecerá aquí."
              action={
                <Link href="/reservar">
                  <Button>Reservar mi primer turno</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments?.map((appt: any) => {
              const isCancelled = appt.status === 'cancelled';
              const isPast = new Date(appt.date) < new Date();
              const dateFormatted = new Date(appt.date).toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              });

              return (
                <Card
                  key={appt._id}
                  className={`relative ${isCancelled ? 'opacity-60' : ''}`}
                >
                  {/* Status indicator */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                      isCancelled
                        ? 'bg-[var(--error-500)]'
                        : appt.status === 'confirmed'
                        ? 'bg-[var(--success-500)]'
                        : 'bg-[var(--warning-500)]'
                    }`}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[var(--gray-900)]">
                          {appt.serviceId?.name || 'Servicio'}
                        </h3>
                        <StatusBadge status={appt.status} />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[var(--gray-700)]">
                          <svg className="w-4 h-4 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium capitalize">{dateFormatted}</span>
                          <span className="text-[var(--gray-400)]">•</span>
                          <span className="text-sm">{appt.startTime} hs</span>
                        </div>

                        <div className="flex items-center gap-2 text-[var(--gray-600)]">
                          <svg className="w-4 h-4 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{appt.sedeId?.name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[var(--gray-600)]">
                          <svg className="w-4 h-4 text-[var(--gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm">
                            {appt.professionalId?.firstName} {appt.professionalId?.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!isCancelled && !isPast && (
                      <div className="flex sm:flex-col gap-2 sm:w-auto">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleReprogram(appt._id)}
                          className="flex-1"
                        >
                          Cambiar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('¿Seguro deseas cancelar este turno?')) {
                              cancelMutation.mutate(appt._id);
                            }
                          }}
                          className="flex-1 text-[var(--error-600)] hover:bg-[var(--error-50)]"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Back to home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--gray-500)] hover:text-[var(--gray-700)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
