"use client";

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      window.location.href = '/reservar';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] p-12 flex-col justify-between">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Únete a Kinaf</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Crea tu cuenta y comienza a reservar tus turnos de manera rápida y sencilla.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Reserva turnos 24/7</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Historial de turnos</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Recordatorios automáticos</span>
            </div>
          </div>
        </div>

        <div className="text-white/60 text-sm">
          © {new Date().getFullYear()} Kinaf. Todos los derechos reservados.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--gray-50)]">
        <div className="w-full max-w-md">
          {/* Mobile Home Link */}
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 text-[var(--gray-600)] hover:text-[var(--gray-900)] transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl shadow-[var(--gray-200)]/50 p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[var(--success-100)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[var(--success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--gray-900)]">Crear Cuenta</h2>
              <p className="text-[var(--gray-500)] mt-1">Completa tus datos para registrarte</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[var(--error-50)] border border-[var(--error-100)] rounded-lg">
                <p className="text-sm text-[var(--error-600)] text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  name="firstName"
                  placeholder="Juan"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Apellido"
                  name="lastName"
                  placeholder="Pérez"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <Input
                label="Teléfono"
                name="phone"
                type="tel"
                placeholder="+54 11 1234-5678"
                value={formData.phone}
                onChange={handleChange}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                hint="Opcional"
              />

              <Input
                label="Contraseña"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loading}
              >
                Crear Cuenta
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--gray-100)] text-center">
              <p className="text-sm text-[var(--gray-500)]">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                >
                  Inicia Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
