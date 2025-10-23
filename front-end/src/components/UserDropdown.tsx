import React, { useState, useEffect, useRef } from 'react';
import { useCharacter } from '../contexts/CharacterContext';
import { Button } from './ui/button';
import { LogOut, Sun, Moon, Settings } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
  avatarUrl?: string;
}

interface UserDropdownProps {
  onLogout: () => void;
  onSettings?: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onLogout, onSettings }) => {
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
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        
        const response = await fetch(`${apiUrl}/profile`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.id && data.name) {
            setUserData({
              id: data.id,
              username: data.name,
              discriminator: '0000',
              avatar: data.avatar ? data.avatar.split('/').pop()?.split('.')[0] : null,
              global_name: data.name,
              avatarUrl: data.avatar
            });
          } else {
            setUserData({
              id: '123456789',
              username: 'usuario_incompleto',
              discriminator: '0001',
              avatar: null,
              global_name: 'Dados Incompletos'
            });
          }
        } else {
          setUserData({
            id: '123456789',
            username: 'visitante',
            discriminator: '0001',
            avatar: null,
            global_name: 'Visitante'
          });
        }
      } catch (error) {
        setUserData({
          id: '123456789',
          username: 'visitante',
          discriminator: '0001',
          avatar: null,
          global_name: 'Visitante'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getAvatarUrl = (userData: UserData) => {
    if (userData.avatarUrl) {
      return userData.avatarUrl;
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
        <div className="w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
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
            
            {/* Perfil (placeholder para futura implementação) 
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
            */}
            {/* Configurações (placeholder para futura implementação) 
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => {
                onSettings();
                setIsOpen(false);
              }}
            >
              <Settings className="w-4 h-4 mr-3" />
              Configurações
            </Button>
            */}
            {/* Divider 
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            */}

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

            {/* Settings */}
            {onSettings && (
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => {
                  onSettings();
                  setIsOpen(false);
                }}
              >
                <Settings className="w-4 h-4 mr-3" />
                Configurações
              </Button>
            )}

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