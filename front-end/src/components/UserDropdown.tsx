import React, { useState, useEffect, useRef } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { Button } from './ui/button';
import { LogOut, Sun, Moon, User, Settings } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
  avatarUrl?: string; // Adicionada para compatibilidade com nova API
}

interface UserDropdownProps {
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useCharacter();

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      let token = localStorage.getItem('auth_token');
      
      console.log('🔍 Token encontrado:', !!token);
      console.log('🔍 Token value:', token ? token.substring(0, 20) + '...' : 'null');
      
      // Se não há token, criar um mock apenas para desenvolvimento
      if (!token) {
        console.log('⚠️ Sem token real - usando dados mock para desenvolvimento');
        const mockData = {
          id: '123456789',
          username: 'dev_user',
          discriminator: '0001',
          avatar: null,
          global_name: 'Usuário de Desenvolvimento'
        };
        setUserData(mockData);
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        console.log('🌐 Fazendo requisição para:', `${apiUrl}/api/user/me`);
        
        const response = await fetch(`${apiUrl}/api/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Dados reais do usuário recebidos:', data);
          
          // Usar a estrutura da nova API (/api/user/me)
          if (data.success && data.user) {
            const user = data.user;
            setUserData({
              id: user.id,
              username: user.username,
              discriminator: user.discriminator || '0000',
              avatar: user.avatar,
              global_name: user.displayName || user.username,
              avatarUrl: user.avatarUrl // Nova API já retorna avatarUrl formatada
            });
          } else {
            console.log('⚠️ Dados do usuário incompletos, usando mock');
            setUserData({
              id: '123456789',
              username: 'usuario_incompleto',
              discriminator: '0001',
              avatar: null,
              global_name: 'Dados Incompletos'
            });
          }
        } else if (response.status === 401) {
          console.log('❌ Token inválido (401) - usando mock para desenvolvimento');
          setUserData({
            id: '876543212789454321',
            username: 'token_invalido',
            discriminator: '0401',
            avatar: null,
            global_name: 'Token Inválido (Mock)'
          });
        } else if (response.status === 404) {
          console.log('❌ Endpoint não encontrado (404) - usando mock');
          setUserData({
            id: '876543212789454321',
            username: 'endpoint_404',
            discriminator: '0404',
            avatar: null,
            global_name: 'Endpoint Não Encontrado'
          });
        } else {
          console.log('⚠️ Erro na resposta:', response.status);
          setUserData({
            id: '876543212789454321',
            username: 'erro_api',
            discriminator: '0500',
            avatar: null,
            global_name: `Erro API (${response.status})`
          });
        }
      } catch (error) {
        console.error('🚨 Erro de rede ao buscar dados do usuário:', error);
        
        // Verificar diferentes tipos de erro
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.log('🌐 Erro de CORS/Conectividade - usando mock');
          setUserData({
            id: '876543212789454321',
            username: 'CapitaoLoffy',
            discriminator: '1234',
            avatar: 'a_1234567890abcdef1234567890abcdef',
            global_name: 'Monkey D. Luffy (CORS Error)'
          });
        } else if (error instanceof Error && error.message.includes('CORS')) {
          console.log('🚫 Erro de CORS - servidor precisa configurar CORS');
          setUserData({
            id: '876543212789454321',
            username: 'cors_error',
            discriminator: '0999',
            avatar: null,
            global_name: 'Erro CORS - Configure Backend'
          });
        } else {
          console.log('🎭 Erro de rede geral, usando mock de desenvolvimento');
          setUserData({
            id: '876543212789454321',
            username: 'dev_offline',
            discriminator: '0000',
            avatar: null,
            global_name: 'Modo Desenvolvimento (Offline)'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [onLogout]);

  const getAvatarUrl = (userData: UserData) => {
    // Usar avatarUrl da nova API se disponível
    if (userData.avatarUrl) {
      return userData.avatarUrl;
    }
    
    // Fallback para o formato antigo
    if (userData.avatar) {
      return `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=128`;
    }
    // Avatar padrão do Discord
    const defaultAvatar = (parseInt(userData.discriminator) || 0) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
  };

  const getDisplayName = (userData: UserData) => {
    return userData.global_name || userData.username;
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Se não há dados do usuário, mostrar botões simples
  if (!userData) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="h-8"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="h-8 text-red-600 border-red-300 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar e botão */}
      <Button
        variant="ghost"
        className="relative h-14 w-14 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={getAvatarUrl(userData)}
          alt={`Avatar de ${getDisplayName(userData)}`}
          className="h-12 w-12 rounded-full object-cover"
          onError={(e) => {
            // Fallback para avatar padrão se a imagem falhar
            const defaultAvatar = (parseInt(userData.discriminator) || 0) % 5;
            (e.target as HTMLImageElement).src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
          }}
        />
        {/* Indicador online */}
        <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          {/* Header do usuário */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(userData)}
                alt={`Avatar de ${getDisplayName(userData)}`}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {getDisplayName(userData)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  @{userData.username}#{userData.discriminator}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Perfil (placeholder para futura implementação) */}
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => {
                setIsOpen(false);
                // TODO: Implementar perfil
              }}
            >
              <User className="w-4 h-4 mr-3" />
              Perfil
            </Button>

            {/* Configurações (placeholder para futura implementação) */}
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => {
                setIsOpen(false);
                // TODO: Implementar configurações
              }}
            >
              <Settings className="w-4 h-4 mr-3" />
              Configurações
            </Button>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Toggle Theme */}
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={handleThemeToggle}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 mr-3" />
                  Modo Claro
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-3" />
                  Modo Escuro
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Logout */}
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;