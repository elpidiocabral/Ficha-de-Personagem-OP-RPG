// Exemplo de como implementar login com Discord e salvar os dados do usuário

import React, { useState } from 'react';
import { AuthUtils } from '../lib/auth';

const LoginExample: React.FC = () => {
  const [loading, setLoading] = useState(false);

  // Função para fazer login via Discord OAuth
  const handleDiscordLogin = async () => {
    setLoading(true);
    
    try {
      // 1. Redirecionar para OAuth do Discord
      const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI || `${window.location.origin}/auth/callback`;
      const scope = 'identify email';
      
      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
      
      // Redirecionar para Discord
      window.location.href = discordAuthUrl;
      
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false);
    }
  };

  // Função para processar callback do Discord (seria chamada na página de callback)
  const handleDiscordCallback = async (code: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // 2. Trocar code por token no seu backend
      const response = await fetch(`${apiUrl}/auth/discord/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (response.ok) {
        const { token, user } = await response.json();
        
        // 3. Salvar token no localStorage
        AuthUtils.setAuthToken(token);
        
        console.log('✅ Login realizado com sucesso:', user);
        console.log('🎯 Token salvo, UserDropdown vai buscar dados reais agora');
        
        // 4. Redirecionar para a aplicação principal
        window.location.href = '/';
        
      } else {
        console.error('Erro no callback:', response.status);
      }
    } catch (error) {
      console.error('Erro no callback:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login - One Piece RPG</h1>
        
        <button
          onClick={handleDiscordLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Redirecionando...' : '🎮 Entrar com Discord'}
        </button>
        
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Como funciona:</h3>
          <ol className="text-sm space-y-1">
            <li>1. Clique em "Entrar com Discord"</li>
            <li>2. Autorize a aplicação no Discord</li>
            <li>3. Você será redirecionado de volta</li>
            <li>4. O token será salvo automaticamente</li>
            <li>5. O UserDropdown mostrará seus dados reais</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default LoginExample;

/* 
INSTRUÇÕES PARA USO REAL:

1. Configure as variáveis de ambiente no .env:
   VITE_DISCORD_CLIENT_ID=seu_client_id_do_discord
   VITE_DISCORD_REDIRECT_URI=http://localhost:5174/auth/callback
   VITE_API_URL=http://localhost:3000

2. No seu backend, implemente os endpoints:
   POST /auth/discord/callback - recebe o code e retorna { token, user }
   GET /auth/me - recebe Bearer token e retorna dados do usuário

3. Exemplo de resposta do /auth/me:
   {
     "id": "123456789012345678",
     "username": "Usuario123",
     "discriminator": "1234",
     "avatar": "a_1234567890abcdef1234567890abcdef",
     "global_name": "Nome Real do Usuário",
     "email": "usuario@email.com"
   }

4. Para testar sem backend real, você pode simular salvando um token:
   localStorage.setItem('auth_token', 'token_real_do_backend');
   
   E o UserDropdown tentará buscar dados reais primeiro.
*/