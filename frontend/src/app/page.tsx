"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUser, useLogout } from "@/hooks/useAuth";

export default function LandingPage() {
  const { data: user } = useUser();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await api.get("/settings")).data.data,
  });

  const { data: services } = useQuery({
    queryKey: ["public-services"],
    queryFn: async () => (await api.get("/services")).data.data,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[var(--gray-100)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-[var(--gray-900)]">
                {settings?.siteName || "Kinaf"}
              </span>
            </Link>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-[var(--gray-600)]">
                    Hola,{" "}
                    <span className="font-medium text-[var(--gray-900)]">
                      {user.firstName}
                    </span>
                  </span>
                  {user.role === "admin" ? (
                    <Link href="/admin">
                      <Button variant="secondary" size="sm">
                        Panel Admin
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/mis-turnos">
                      <Button variant="secondary" size="sm">
                        Mis Turnos
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/reservar">
                    <Button size="sm">Reservar Turno</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--gray-600)] hover:bg-[var(--gray-100)]"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
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
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--gray-100)] bg-white animate-fade-in">
            <div className="px-4 py-4 space-y-2">
              <div className="pt-4 border-t border-[var(--gray-100)] space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-[var(--gray-600)]">
                      Hola,{" "}
                      <span className="font-medium">{user.firstName}</span>
                    </div>
                    {user.role === "admin" ? (
                      <Link href="/admin" className="block">
                        <Button variant="secondary" fullWidth>
                          Panel Admin
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/mis-turnos" className="block">
                        <Button variant="secondary" fullWidth>
                          Mis Turnos
                        </Button>
                      </Link>
                    )}
                    <Button variant="ghost" fullWidth onClick={logout}>
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="secondary" fullWidth>
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/reservar" className="block">
                      <Button fullWidth>Reservar Turno</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--gray-50)] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--gray-900)] leading-tight mb-6">
            {settings?.heroTitle || "Reserva tu turno de forma simple"}
          </h1>
          <p className="text-lg sm:text-xl text-[var(--gray-600)] max-w-2xl mx-auto mb-10">
            {settings?.heroSubtitle ||
              "Sistema de turnos online disponible las 24 horas. Elige el horario que mejor te convenga."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reservar">
              <Button
                size="lg"
                className="shadow-lg shadow-[var(--primary-600)]/25"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Reservar Ahora
              </Button>
            </Link>
            <a href="#servicios">
              <Button variant="secondary" size="lg">
                Ver Servicios
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-[var(--primary-50)] text-[var(--primary-700)] text-sm font-medium rounded-full mb-4">
              Nuestros Servicios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--gray-900)] mb-4">
              Tratamientos Disponibles
            </h2>
            <p className="text-[var(--gray-600)] max-w-2xl mx-auto">
              Selecciona el servicio que necesitas y reserva tu turno en
              minutos.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((svc: any) => (
              <Card key={svc._id} hover className="group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[var(--primary-50)] rounded-xl flex items-center justify-center group-hover:bg-[var(--primary-100)] transition-colors">
                    <svg
                      className="w-6 h-6 text-[var(--primary-600)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold text-[var(--primary-600)]">
                    ${svc.price}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2">
                  {svc.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-[var(--gray-600)]">
                  <svg
                    className="w-4 h-4"
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
                  <span>{svc.duration} minutos</span>
                </div>

                <Link href="/reservar" className="mt-4 block">
                  <Button variant="secondary" fullWidth size="sm">
                    Reservar
                  </Button>
                </Link>
              </Card>
            ))}

            {(!services || services.length === 0) && (
              <div className="col-span-full text-center py-12 text-[var(--gray-600)]">
                Cargando servicios...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[var(--primary-100)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[var(--primary-600)]"
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
              </div>
              <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2">
                Disponible 24/7
              </h3>
              <p className="text-[var(--gray-600)] text-sm">
                Reserva tu turno en cualquier momento desde tu celular o
                computadora.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-[var(--success-100)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-[var(--success-600)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2">
                Confirmación Inmediata
              </h3>
              <p className="text-[var(--gray-600)] text-sm">
                Recibe la confirmación de tu turno al instante en tu email.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--gray-900)] mb-2">
                Recordatorios
              </h3>
              <p className="text-[var(--gray-600)] text-sm">
                Te recordamos tu turno para que no lo olvides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card
            variant="elevated"
            padding="lg"
            className="text-center bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)]"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              ¿Listo para reservar?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Elige el horario que mejor te convenga y reserva tu turno en menos
              de un minuto.
            </p>
            <Link href="/reservar">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-[var(--primary-700)] hover:bg-[var(--gray-100)]"
              >
                Reservar Turno Ahora
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[var(--gray-100)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--primary-600)] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <span className="text-sm text-[var(--gray-600)]">
              © {new Date().getFullYear()} {settings?.siteName || "Kinaf"}.
              Todos los derechos reservados.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[var(--gray-600)] hover:text-[var(--gray-900)]"
            >
              Inicio
            </Link>
            <a
              href="#servicios"
              className="text-sm text-[var(--gray-600)] hover:text-[var(--gray-900)]"
            >
              Servicios
            </a>
            <Link
              href="/reservar"
              className="text-sm text-[var(--gray-600)] hover:text-[var(--gray-900)]"
            >
              Reservar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
