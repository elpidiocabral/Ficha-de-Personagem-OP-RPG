import React, { useEffect, useState } from 'react';

const AuthSuccess: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processando autenticação...');

  useEffect(() => {
    const processAuth = () => {
      try {
        // Extrair token do hash (#token=...) ou query (?token=...)
        const hash = window.location.hash.substring(1);
        const query = new URLSearchParams(window.location.search);
        
        let token = '';
        
        // Tentar pegar do hash primeiro
        if (hash.includes('token=')) {
          token = hash.split('token=')[1]?.split('&')[0] || '';
        }
        // Se não tem no hash, tentar na query
        else if (query.has('token')) {
          token = query.get('token') || '';
        }
        
        console.log('🔍 Token encontrado:', token ? 'Sim' : 'Não');
        console.log('🔗 URL completa:', window.location.href);
        console.log('🔗 Hash:', window.location.hash);
        console.log('🔗 Search:', window.location.search);
        
        if (token && token !== 'undefined') {
          // Salvar token no localStorage
          localStorage.setItem('auth_token', token);
          console.log('✅ Token salvo no localStorage');
          
          setStatus('success');
          setMessage('Login realizado com sucesso! Redirecionando...');
          
          // Redirecionar para a página principal após 2 segundos
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          
        } else {
          console.error('❌ Token não encontrado na URL');
          setStatus('error');
          setMessage('Token de autenticação não encontrado. Tente fazer login novamente.');
        }
        
      } catch (error) {
        console.error('🚨 Erro ao processar autenticação:', error);
        setStatus('error');
        setMessage('Erro ao processar autenticação. Tente novamente.');
      }
    };

    processAuth();
  }, []);

  const handleRetry = () => {
    window.location.href = 'http://localhost:3000/auth/discord';
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <h2>Processando Login...</h2>
            <p>{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={{
              fontSize: '60px',
              color: '#4CAF50',
              marginBottom: '20px'
            }}>✅</div>
            <h2>Login Realizado!</h2>
            <p>{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={{
              fontSize: '60px',
              color: '#f44336',
              marginBottom: '20px'
            }}>❌</div>
            <h2>Erro na Autenticação</h2>
            <p>{message}</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={handleRetry}
                style={{
                  background: '#5865F2',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: '16px'
                }}
              >
                Tentar Novamente
              </button>
              <button 
                onClick={handleGoHome}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Voltar ao Início
              </button>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthSuccess;