"use client";

import { useState } from 'react';
import { useSedes, useServices, useSlots } from '@/hooks/queries/useBookingData';
import { useUser } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { clsx } from 'clsx';

const steps = [
  { id: 1, name: 'Sede' },
  { id: 2, name: 'Servicio' },
  { id: 3, name: 'Fecha' },
  { id: 4, name: 'Confirmar' },
];

export default function BookingWizard() {
  const { data: user, isLoading: userLoading } = useUser();
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState<any>({});
  const [isBooking, setIsBooking] = useState(false);

  const { data: sedes, isLoading: loadingSedes } = useSedes();
  const { data: services, isLoading: loadingServices } = useServices();
  const { data: slots, isLoading: loadingSlots } = useSlots(
    booking.date,
    booking.service?._id,
    booking.sede?._id
  );

  if (userLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--primary-600)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--gray-500)]">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-[var(--primary-50)] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--gray-900)] mb-2">Inicia sesión para reservar</h2>
        <p className="text-[var(--gray-500)] mb-6">Necesitas una cuenta para realizar una reserva.</p>
        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button fullWidth>Iniciar Sesión</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" fullWidth>Crear Cuenta</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const handleBook = async (slot: any) => {
    setIsBooking(true);
    try {
      const payload = {
        sedeId: booking.sede._id,
        serviceId: booking.service._id,
        professionalId: slot.professional._id,
        date: booking.date,
        startTime: slot.time,
        clientId: user._id,
      };
      await api.post('/appointments', payload);
      setBooking({ ...booking, slot });
      setStep(4);
    } catch (e) {
      alert('Error al reservar. Intente nuevamente.');
    } finally {
      setIsBooking(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step >= s.id
                      ? 'bg-[var(--primary-600)] text-white'
                      : 'bg-[var(--gray-100)] text-[var(--gray-400)]'
                  )}
                >
                  {step > s.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.id
                  )}
                </div>
                <span
                  className={clsx(
                    'ml-2 text-sm font-medium hidden sm:block',
                    step >= s.id ? 'text-[var(--gray-900)]' : 'text-[var(--gray-400)]'
                  )}
                >
                  {s.name}
                </span>
                {i < 2 && (
                  <div
                    className={clsx(
                      'w-12 sm:w-24 h-0.5 mx-2 sm:mx-4',
                      step > s.id ? 'bg-[var(--primary-600)]' : 'bg-[var(--gray-200)]'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Sede */}
      {step === 1 && (
        <Card className="animate-fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[var(--gray-900)]">Selecciona una sede</h2>
            <p className="text-sm text-[var(--gray-500)] mt-1">Elige la ubicación donde deseas atenderte</p>
          </div>

          {loadingSedes ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 skeleton rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {sedes?.map((sede: any) => (
                <button
                  key={sede._id}
                  onClick={() => {
                    setBooking({ ...booking, sede });
                    setStep(2);
                  }}
                  className="p-4 text-left border border-[var(--gray-200)] rounded-xl hover:border-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[var(--gray-100)] group-hover:bg-[var(--primary-100)] rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                      <svg className="w-5 h-5 text-[var(--gray-500)] group-hover:text-[var(--primary-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[var(--gray-900)]">{sede.name}</div>
                      <div className="text-sm text-[var(--gray-500)] mt-0.5">{sede.address}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Step 2: Service */}
      {step === 2 && (
        <Card className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--gray-900)]">Selecciona un servicio</h2>
              <p className="text-sm text-[var(--gray-500)] mt-1">
                Sede: <span className="font-medium text-[var(--gray-700)]">{booking.sede?.name}</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Cambiar sede
            </Button>
          </div>

          {loadingServices ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 skeleton rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {services?.map((svc: any) => (
                <button
                  key={svc._id}
                  onClick={() => {
                    setBooking({ ...booking, service: svc });
                    setStep(3);
                  }}
                  className="w-full p-4 text-left border border-[var(--gray-200)] rounded-xl hover:border-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--gray-900)]">{svc.name}</div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-[var(--gray-500)]">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {svc.duration} min
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-[var(--primary-600)]">${svc.price}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <Card className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--gray-900)]">Selecciona fecha y hora</h2>
              <p className="text-sm text-[var(--gray-500)] mt-1">
                {booking.service?.name} en {booking.sede?.name}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              Cambiar servicio
            </Button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--gray-700)] mb-2">
              Fecha
            </label>
            <input
              type="date"
              min={getTodayDate()}
              className="w-full px-4 py-3 border border-[var(--gray-200)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] transition-colors"
              value={booking.date || ''}
              onChange={(e) => setBooking({ ...booking, date: e.target.value })}
            />
          </div>

          {booking.date && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-[var(--gray-700)] mb-3">
                Horarios disponibles
              </label>
              {loadingSlots ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-16 skeleton rounded-lg" />
                  ))}
                </div>
              ) : slots?.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleBook(slot)}
                      disabled={isBooking}
                      className="p-3 border border-[var(--gray-200)] rounded-lg hover:border-[var(--primary-500)] hover:bg-[var(--primary-50)] transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="font-semibold text-[var(--gray-900)]">{slot.time}</div>
                      <div className="text-xs text-[var(--gray-500)] mt-0.5 truncate">
                        {slot.professional.firstName}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--gray-500)]">
                  <svg className="w-12 h-12 mx-auto text-[var(--gray-300)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">No hay horarios disponibles</p>
                  <p className="text-sm mt-1">Intenta con otra fecha</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <Card className="text-center animate-scale-in">
          <div className="w-20 h-20 bg-[var(--success-100)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--success-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--gray-900)] mb-2">¡Turno Confirmado!</h2>
          <p className="text-[var(--gray-500)] mb-8">
            Te esperamos en <span className="font-medium text-[var(--gray-700)]">{booking.sede?.name}</span>
          </p>

          <div className="bg-[var(--gray-50)] rounded-xl p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--gray-500)]">Servicio</span>
                <span className="font-medium text-[var(--gray-900)]">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--gray-500)]">Fecha</span>
                <span className="font-medium text-[var(--gray-900)]">
                  {new Date(booking.date).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--gray-500)]">Hora</span>
                <span className="font-medium text-[var(--gray-900)]">{booking.slot?.time} hs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--gray-500)]">Profesional</span>
                <span className="font-medium text-[var(--gray-900)]">{booking.slot?.professional?.firstName}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/mis-turnos">
              <Button fullWidth>Ver Mis Turnos</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" fullWidth>Volver al Inicio</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Back to home link */}
      {step < 4 && (
        <div className="mt-6 text-center">
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
      )}
    </div>
  );
}
