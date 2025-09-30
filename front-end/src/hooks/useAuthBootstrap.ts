import { useEffect } from 'react';

export function useAuthBootstrap(onToken?: (token: string) => void) {
  useEffect(() => {
    // Lê #token=... (padrão) ou ?token=... (fallback)
    const token =
      new URLSearchParams(location.hash.slice(1)).get('token') ||
      new URLSearchParams(location.search).get('token');

    if (token) {
      localStorage.setItem('auth_token', token);
      history.replaceState(null, '', location.pathname);
      onToken?.(token);
    }
  }, [onToken]);
}
