"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminSettings() {
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data.data,
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => await api.put("/settings", data),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton" />
        <div className="h-96 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">
          Configuración
        </h1>
        <p className="text-sm text-[var(--gray-500)] mt-1">
          Personaliza la información de tu sitio
        </p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="p-4 bg-[var(--success-50)] border border-[var(--success-100)] rounded-xl animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--success-100)] rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[var(--success-600)]"
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
            </div>
            <p className="text-sm font-medium text-[var(--success-700)]">
              Configuración guardada correctamente
            </p>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <Card>
        <div className="space-y-6">
          <div className=" border-[var(--gray-100)] pt-6">
            <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-4">
              Información General
            </h3>
            <p className="text-sm text-[var(--gray-500)] mb-4">
              Estos textos aparecen en la página principal
            </p>
            <div className="space-y-4">
              <Input
                label="Título Principal"
                placeholder="Reserva tu turno de forma simple"
                value={form.heroTitle || ""}
                onChange={(e) =>
                  setForm({ ...form, heroTitle: e.target.value })
                }
              />
              <div>
                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                  Subtítulo
                </label>
                <textarea
                  className="text-[var(--gray-700)] w-full px-3.5 py-2.5 text-sm rounded-lg border border-[var(--gray-200)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-colors resize-none"
                  rows={3}
                  placeholder="Sistema de turnos online disponible las 24 horas..."
                  value={form.heroSubtitle || ""}
                  onChange={(e) =>
                    setForm({ ...form, heroSubtitle: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--gray-100)] pt-6">
            <Button
              onClick={() => updateMutation.mutate(form)}
              isLoading={updateMutation.isPending}
              size="lg"
            >
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
