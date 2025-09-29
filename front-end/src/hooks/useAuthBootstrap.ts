import { useEffect } from 'react';

export function useAuthBootstrap() {
  useEffect(() => {
    // Lê #token=... (padrão) ou ?token=... (fallback)
    const fromHash = new URLSearchParams(window.location.hash.slice(1)).get('token');
    const fromQuery = new URLSearchParams(window.location.search).get('token');
    const token = fromHash || fromQuery;

    if (token) {
      localStorage.setItem('auth_token', token);
      // Limpa o token da URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);
}
