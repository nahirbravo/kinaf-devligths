import BookingWizard from '@/components/features/booking/BookingWizard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Reserva tu Turno</h1>
         <BookingWizard />
      </div>
    </div>
  );
}
