"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function AdminSchedules() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    professionalId: '',
    sedeId: '',
    serviceId: '',
    dayOfWeek: '1',
    startTime: '09:00',
    endTime: '17:00'
  });

  const { data: pros } = useQuery({
    queryKey: ['pros'],
    queryFn: async () => (await api.get('/users/professionals')).data.data
  });

  const { data: sedes } = useQuery({
    queryKey: ['sedes'],
    queryFn: async () => (await api.get('/sedes')).data.data
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => (await api.get('/services')).data.data
  });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => (await api.get('/schedules')).data.data
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => await api.post('/schedules', data),
    onSuccess: () => {
      setShowForm(false);
      setForm({
        professionalId: '',
        sedeId: '',
        serviceId: '',
        dayOfWeek: '1',
        startTime: '09:00',
        endTime: '17:00'
      });
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['admin-schedules-count'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/schedules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['admin-schedules-count'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">Horarios</h1>
          <p className="text-sm text-[var(--gray-500)] mt-1">
            Configura la disponibilidad de los profesionales
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            'Cancelar'
          ) : (
            <>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Horario
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="animate-slide-up">
          <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">Agregar Disponibilidad</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Profesional
                </label>
                <select
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  required
                  value={form.professionalId}
                  onChange={e => setForm({ ...form, professionalId: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {pros?.map((p: any) => (
                    <option key={p._id} value={p._id}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Sede
                </label>
                <select
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  required
                  value={form.sedeId}
                  onChange={e => setForm({ ...form, sedeId: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {sedes?.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Servicio
                </label>
                <select
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  required
                  value={form.serviceId}
                  onChange={e => setForm({ ...form, serviceId: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {services?.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Día
                </label>
                <select
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  value={form.dayOfWeek}
                  onChange={e => setForm({ ...form, dayOfWeek: e.target.value })}
                >
                  {days.map((d, i) => i > 0 && (
                    <option key={i} value={i}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Hora inicio
                </label>
                <input
                  type="time"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Hora fin
                </label>
                <input
                  type="time"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                  value={form.endTime}
                  onChange={e => setForm({ ...form, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Agregar Horario
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      <Card padding="none">
        <div className="p-4 sm:p-6 border-b border-[var(--gray-100)]">
          <h2 className="text-lg font-semibold text-[var(--gray-900)]">
            Horarios Configurados ({schedules?.length || 0})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 skeleton rounded-lg" />
            ))}
          </div>
        ) : schedules?.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="No hay horarios configurados"
            description="Configura horarios para habilitar la reserva de turnos."
            action={
              <Button size="sm" onClick={() => setShowForm(true)}>
                Agregar Horario
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-[var(--gray-100)]">
            {schedules?.map((sch: any) => (
              <div key={sch._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-[var(--gray-50)] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[var(--primary-50)] rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-[var(--primary-600)]">
                      {days[sch.dayOfWeek]?.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--gray-900)]">
                      {days[sch.dayOfWeek]}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary">
                        {sch.startTime} - {sch.endTime}
                      </Badge>
                      <span className="text-sm text-[var(--gray-500)]">
                        {sch.professionalId?.firstName} {sch.professionalId?.lastName}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--gray-400)] mt-1">
                      {sch.serviceId?.name} • {sch.sedeId?.name}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este horario?')) deleteMutation.mutate(sch._id);
                  }}
                  className="p-2 rounded-lg text-[var(--gray-400)] hover:text-[var(--error-600)] hover:bg-[var(--error-50)] transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
