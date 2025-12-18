import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useSedes = () => useQuery({
  queryKey: ['sedes'],
  queryFn: async () => (await api.get('/sedes')).data.data
});

export const useServices = () => useQuery({
  queryKey: ['services'],
  queryFn: async () => (await api.get('/services')).data.data
});

export const useSlots = (date: string | null, serviceId: string | null, sedeId: string | null) => useQuery({
  queryKey: ['slots', date, serviceId, sedeId],
  queryFn: async () => {
    if(!date || !serviceId || !sedeId) return [];
    const res = await api.get(`/slots?date=${date}&serviceId=${serviceId}&sedeId=${sedeId}`);
    return res.data.data;
  },
  enabled: !!date && !!serviceId && !!sedeId
});
