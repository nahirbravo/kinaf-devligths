"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", price: "", duration: "" });
  const [showForm, setShowForm] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => (await api.get("/services")).data.data,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => await api.post("/services", data),
    onSuccess: () => {
      setForm({ name: "", price: "", duration: "" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/services/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
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
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">
            Servicios
          </h1>
          <p className="text-sm text-[var(--gray-500)] mt-1">
            Configura los tratamientos disponibles
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            "Cancelar"
          ) : (
            <>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuevo Servicio
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="animate-slide-up">
          <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
            Agregar Servicio
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre del servicio"
              placeholder="Ej: Kinesiología Deportiva"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Precio ($)"
                type="number"
                placeholder="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <Input
                label="Duración (minutos)"
                type="number"
                placeholder="30"
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Agregar Servicio
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      ) : services?.length === 0 ? (
        <Card>
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
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            }
            title="No hay servicios"
            description="Agrega tu primer servicio para que los clientes puedan reservar."
            action={
              <Button size="sm" onClick={() => setShowForm(true)}>
                Agregar Servicio
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map((svc: any) => (
            <Card key={svc._id} hover className="group">
              <div className="flex items-start justify-between mb-4">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar este servicio?"))
                      deleteMutation.mutate(svc._id);
                  }}
                  className="p-2 rounded-lg text-[var(--gray-400)] hover:text-[var(--error-600)] hover:bg-[var(--error-50)] transition-colors opacity-0 group-hover:opacity-100"
                  title="Eliminar"
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
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-3">
                {svc.name}
              </h3>

              <div className="flex items-center gap-2">
                <Badge variant="primary">${svc.price}</Badge>
                <Badge variant="default">
                  <svg
                    className="w-3.5 h-3.5 mr-1"
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
                  {svc.duration} min
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
