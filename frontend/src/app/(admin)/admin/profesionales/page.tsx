"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminProfessionals() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { data: pros, isLoading } = useQuery({
    queryKey: ["pros"],
    queryFn: async () => (await api.get("/users/professionals")).data.data,
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) =>
      await api.post("/users/professionals", data),
    onSuccess: () => {
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setError("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["pros"] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Error al crear profesional");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      await api.delete(`/users/professionals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pros"] }),
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
            Profesionales
          </h1>
          <p className="text-sm text-[var(--gray-500)] mt-1">
            Gestiona el equipo de profesionales
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
              Nuevo Profesional
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="animate-slide-up">
          <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
            Agregar Profesional
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-[var(--error-50)] border border-[var(--error-100)] rounded-lg">
              <p className="text-sm text-[var(--error-600)]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Juan"
                required
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <Input
                label="Apellido"
                placeholder="Pérez"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="profesional@kinaf.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                Agregar Profesional
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      {isLoading ? (
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-lg" />
          ))}
        </div>
      ) : pros?.length === 0 ? (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
          title="No hay profesionales"
          description="Agrega tu primer profesional para empezar."
          action={
            <Button size="sm" onClick={() => setShowForm(true)}>
              Agregar Profesional
            </Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pros?.map((p: any) => (
            <Card key={p._id} hover className="group">
              <div className="flex items-start justify-between mb-4">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar este profesional?"))
                      deleteMutation.mutate(p._id);
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
                {p.firstName} {p.lastName}
              </h3>
              <p className="text-sm text-[var(--gray-500)] mb-3">{p.email}</p>
              <div className="text-xs text-[var(--gray-400)]">{p.slug}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
