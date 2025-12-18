import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data.data.user;
      } catch (e) {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      queryClient.setQueryData(['user'], null);
      window.location.href = '/';
    } catch (e) {
      console.error(e);
    }
  };
  return logout;
}
