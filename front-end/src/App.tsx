import React, { useEffect, useState } from 'react';
import { CharacterProvider, useCharacter } from './contexts/CharacterContext';
import CharacterMenu from './components/CharacterMenu';
import CharacterSheet from './components/CharacterSheet';
import Login from './components/Login';
import { Character } from './types';
import { useAuthBootstrap } from './hooks/useAuthBootstrap';
import './index.css';

const AppContent: React.FC = () => {
  useAuthBootstrap();

  const [currentView, setCurrentView] = useState<'login' | 'menu' | 'character'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const { createCharacter, createDefaultCharacter, characters } = useCharacter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedBackgroundUrl = localStorage.getItem('background-url');
    if (savedBackgroundUrl) {
      document.body.style.backgroundImage = `url('${savedBackgroundUrl}')`;
      document.body.style.backgroundRepeat = 'repeat';
    } else {
      const defaultUrl = 'https://cdn.artstation.com/p/thumbnails/001/253/239/thumb.jpg';
      document.body.style.backgroundImage = `url('${defaultUrl}')`;
      document.body.style.backgroundRepeat = 'repeat';
    }
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/profile`, {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
          setCurrentView('menu');
        } else {
          setIsAuthenticated(false);
          setCurrentView('login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        setCurrentView('login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  const selectedCharacter = selectedCharacterId
    ? characters.find((char) => char.id === selectedCharacterId) || null
    : null;

  const handleLogin = async () => {
    setIsAuthenticated(true);
    setCurrentView('menu');
  };

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacterId(character.id || null);
    setCurrentView('character');
  };

  const handleCreateNew = () => {
    const defaultCharacterData = createDefaultCharacter();
    const newCharacter = createCharacter(defaultCharacterData);
    setSelectedCharacterId(newCharacter.id || null);
    setCurrentView('character');
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
    setSelectedCharacterId(null);
  };

  const handleLogout = () => {
    console.log('🚪 Iniciando logout...');
    console.log('🍪 Cookies antes:', document.cookie);
    
    // Método 1: Limpar todos os cookies encontrados
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name) {
        console.log('🗑️ Limpando cookie:', name);
        // Tentar múltiplas combinações
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.localhost`;
      }
    });
    
    // Método 2: Limpar cookies conhecidos do Express Session
    const knownCookies = ['connect.sid', 'session', 'sessionid'];
    knownCookies.forEach(name => {
      console.log('🗑️ Forçando limpeza de:', name);
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost`;
    });
    
    console.log('🍪 Cookies depois:', document.cookie);
    
    setIsAuthenticated(false);
    setCurrentView('login');
    
    // Aguardar um pouco antes de recarregar
    setTimeout(() => {
      console.log('🔄 Recarregando página...');
      //window.location.reload();
    }, 500);
  };

  if (isCheckingAuth) {
    return (
      <div className="App flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {currentView === 'login' && <Login onLogin={handleLogin} />}
      {currentView === 'menu' && (
        <CharacterMenu
          onSelectCharacter={handleSelectCharacter}
          onCreateNew={handleCreateNew}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'character' && selectedCharacter && (
        <CharacterSheet 
          character={selectedCharacter} 
          onBack={handleBackToMenu} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  );
};

export default App;
