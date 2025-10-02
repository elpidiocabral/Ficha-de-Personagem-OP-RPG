// Utilitário para testar autenticação com dados reais de exemplo

export const TestAuth = {
  // Simular login com dados reais de exemplo
  simulateRealLogin: () => {
    // Simular um token JWT real (sem dados sensíveis)
    const mockRealToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4NzY1NDMyMTI3ODk0NTQzMjEiLCJ1c2VybmFtZSI6IkNhcGl0YW9Mb2ZmeSIsImRpc2NyaW1pbmF0b3IiOiIxMjM0IiwiaWF0IjoxNjk4ODU5MjAwfQ.fake_signature_for_testing';
    
    localStorage.setItem('auth_token', mockRealToken);
    console.log('🎯 Token real simulado salvo!');
    console.log('📝 Dados que serão mostrados: Monkey D. Luffy (CapitaoLoffy#1234)');
    console.log('💡 Recarregue a página para ver o resultado!');
    
    // Mostrar instruções
    setTimeout(() => {
      console.log('🔄 Para recarregar automaticamente, digite: location.reload()');
    }, 1000);
  },

  // Limpar dados de teste
  clearTestData: () => {
    localStorage.removeItem('auth_token');
    console.log('🧹 Dados de teste limpos.');
  },

  // Simular dados que viriam do seu backend
  getMockBackendData: () => {
    return {
      id: '876543212789454321',
      username: 'CapitaoLoffy',
      discriminator: '1234', 
      avatar: 'a_1234567890abcdef1234567890abcdef', // Avatar animado do Discord
      global_name: 'Monkey D. Luffy',
      email: 'luffy@onepiece.com'
    };
  },

  // Função para testar diferentes cenários
  testScenario: (scenario: 'success' | 'error' | 'offline' | 'invalid_token') => {
    switch(scenario) {
      case 'success':
        TestAuth.simulateRealLogin();
        break;
      case 'error':
        localStorage.setItem('auth_token', 'token_que_causa_erro_500');
        console.log('🔴 Cenário de erro configurado - UserDropdown mostrará "Erro API"');
        break;
      case 'offline':
        localStorage.setItem('auth_token', 'token_servidor_offline');
        console.log('📡 Cenário offline configurado - UserDropdown mostrará erro de conectividade');
        break;
      case 'invalid_token':
        localStorage.setItem('auth_token', 'token_invalido_401');
        console.log('🚫 Token inválido configurado - UserDropdown mostrará "Token Inválido"');
        break;
    }
    console.log(`🧪 Cenário '${scenario}' configurado.`);
    console.log('🔄 Recarregando automaticamente em 2 segundos...');
    
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  },

  // Função para recarga rápida
  reloadNow: () => {
    console.log('🔄 Recarregando página...');
    window.location.reload();
  }
};

// Disponibilizar globalmente para testes no console
(window as any).TestAuth = TestAuth;

console.log(`
🧪 UTILITÁRIOS DE TESTE DISPONÍVEIS:

No console do navegador, você pode usar:

TestAuth.simulateRealLogin()         - ✅ Simula login real com Monkey D. Luffy
TestAuth.clearTestData()             - 🧹 Limpa dados e volta para modo desenvolvimento  
TestAuth.testScenario('success')     - 🎯 Testa login bem-sucedido (recarrega automaticamente)
TestAuth.testScenario('error')       - 🔴 Testa erro de API (recarrega automaticamente)
TestAuth.testScenario('offline')     - 📡 Testa servidor offline (recarrega automaticamente)
TestAuth.testScenario('invalid_token') - 🚫 Testa token inválido (recarrega automaticamente)
TestAuth.reloadNow()                 - 🔄 Recarrega a página imediatamente

🔍 RESULTADO ESPERADO:
- O dropdown do usuário no canto superior direito mudará conforme o cenário
- Você verá diferentes nomes/estados baseados no teste escolhido
- Os logs do console mostrarão o processo de autenticação

📝 EXEMPLO DE USO:
1. Digite: TestAuth.simulateRealLogin()
2. Aguarde 2 segundos para recarga automática  
3. Veja "Monkey D. Luffy" no dropdown!
`);