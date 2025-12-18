"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AdminSedes() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", address: "" });
  const [showForm, setShowForm] = useState(false);

  const { data: sedes, isLoading } = useQuery({
    queryKey: ["sedes"],
    queryFn: async () => (await api.get("/sedes")).data.data,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => await api.post("/sedes", data),
    onSuccess: () => {
      setForm({ name: "", address: "" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["sedes"] });
    },
    onError: (err: any) =>
      alert(err.response?.data?.message || "Error al crear sede"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await api.delete(`/sedes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sedes"] }),
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
          <h1 className="text-2xl font-bold text-[var(--gray-900)]">Sedes</h1>
          <p className="text-sm text-[var(--gray-500)] mt-1">
            Administra las ubicaciones del consultorio
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
              Nueva Sede
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="animate-slide-up">
          <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
            Agregar Sede
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              placeholder="Ej: Kinaf Centro"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Dirección"
              placeholder="Calle y Altura, Ciudad"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={createMutation.isPending}>
                Agregar Sede
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
      ) : sedes?.length === 0 ? (
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            title="No hay sedes"
            description="Agrega tu primera sede para empezar a recibir reservas."
            action={
              <Button size="sm" onClick={() => setShowForm(true)}>
                Agregar Sede
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sedes?.map((sede: any) => (
            <Card key={sede._id} hover className="group">
              <div className="flex items-start justify-between mb-4">
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
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar esta sede?"))
                      deleteMutation.mutate(sede._id);
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

              <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-1">
                {sede.name}
              </h3>
              <p className="text-sm text-[var(--gray-500)] mb-3">
                {sede.address}
              </p>
              <div className="text-xs text-[var(--gray-400)]">
                sede: {sede.slug}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
