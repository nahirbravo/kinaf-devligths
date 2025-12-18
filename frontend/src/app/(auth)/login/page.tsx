"use client";

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const user = res.data.data.user;

      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/reservar';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
      setLoading(false);
    }
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
          <h1 className="text-4xl font-bold text-white mb-4">Kinaf</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Sistema de gestión de turnos simple y eficiente para tu negocio.
          </p>
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
              <div className="w-12 h-12 bg-[var(--primary-100)] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[var(--gray-900)]">Bienvenido</h2>
              <p className="text-[var(--gray-500)] mt-1">Ingresa a tu cuenta para continuar</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-[var(--error-50)] border border-[var(--error-100)] rounded-lg">
                <p className="text-sm text-[var(--error-600)] text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--gray-100)] text-center">
              <p className="text-sm text-[var(--gray-500)]">
                ¿No tienes cuenta?{' '}
                <Link
                  href="/register"
                  className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
