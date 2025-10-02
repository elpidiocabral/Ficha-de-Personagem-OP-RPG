// Utilitário para gerenciar autenticação do usuário
import React from 'react';

export interface AuthUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
  display_name?: string;
}

export const AuthUtils = {
  // Salvar token após login bem-sucedido
  setAuthToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
    console.log('✅ Token de autenticação salvo');
  },

  // Obter token atual
  getAuthToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  // Remover token (logout)
  clearAuthToken: (): void => {
    localStorage.removeItem('auth_token');
    console.log('🚪 Token removido - usuário deslogado');
  },

  // Verificar se usuário está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return token !== null && token !== 'mock_token_for_testing';
  },

  // Buscar dados do usuário usando token
  fetchUserData: async (): Promise<AuthUser | null> => {
    const token = AuthUtils.getAuthToken();
    
    if (!token || token === 'mock_token_for_testing') {
      console.log('⚠️ Token inválido ou mock');
      return null;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dados do usuário obtidos via AuthUtils:', data);
        return data;
      } else {
        console.error('❌ Erro ao buscar dados do usuário:', response.status);
        return null;
      }
    } catch (error) {
      console.error('🚨 Erro de rede:', error);
      return null;
    }
  }
};

// Hook personalizado para usar dados do usuário autenticado
export const useAuthUser = () => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadUser = async () => {
      const userData = await AuthUtils.fetchUserData();
      setUser(userData);
      setLoading(false);
    };

    loadUser();
  }, []);

  return { user, loading, refetch: () => AuthUtils.fetchUserData().then(setUser) };
};