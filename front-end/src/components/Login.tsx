import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import logoImg from '../img/logo.png';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleDiscordLogin = () => {
    const api = import.meta.env.VITE_API_URL;
    window.location.href = `${api}/auth/discord`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500/30 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-orange-500/30 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-green-500/30 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border border-purple-500/30 rounded-full"></div>
        
        {/* Animated waves */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-900/20 to-transparent wave-animation"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400/60 rounded-full floating-particle-${i % 3 + 1}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <Card className="w-full max-w-md mx-4 bg-gray-800/80 backdrop-blur-xl border-gray-700/50 shadow-2xl relative z-10">
        <CardContent className="p-8">
          {/* Logo Area */}
          <div className="text-center mb-8">
            {/* One Piece RPG Logo */}
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-500/20 overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="One Piece RPG Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              ONE PIECE RPG
            </h1>
            <p className="text-gray-400 text-lg font-medium">
              A Vontade dos Mares
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Gerencie suas fichas de personagem
            </p>
          </div>

          {/* Login Section */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-300 mb-6">Entre para começar sua aventura!</p>
            </div>

            {/* Discord Login Button */}
            <Button
              onClick={handleDiscordLogin}
              className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Entrar com Discord
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">ou</span>
              </div>
            </div>

            {/* Guest Access */}
            <Button
              onClick={onLogin}
              variant="outline"
              className="w-full h-12 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <span className="mr-2">👤</span>
              Continuar como Visitante
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              Sistema de Fichas - A Vontade dos Mares RPG
            </p>
            <p className="text-gray-600 text-xs mt-1">
              v3.0
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="m-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="waves">
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(59, 130, 246, 0.1)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(249, 115, 22, 0.05)"
            />
            <use
              xlinkHref="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(59, 130, 246, 0.05)"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Login;