// Script para testar autenticação
const API_BASE_URL = 'https://hannover-backend.onrender.com';

async function testAuth() {
  console.log('🔐 Testando autenticação...');
  
  // Dados de login do admin
  // NOTA: Configure as credenciais corretas antes de executar este script
  const adminCredentials = {
    email: process.env.ADMIN_EMAIL || 'admin@hannover.com',
    password: process.env.ADMIN_PASSWORD || 'your-admin-password-here'
  };
  
  try {
    // Fazer login
    console.log('📝 Fazendo login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminCredentials)
    });
    
    if (!loginResponse.ok) {
      const errorData = await loginResponse.json();
      console.error('❌ Erro no login:', errorData);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido!');
    console.log('👤 Usuário:', loginData.user.name);
    console.log('🔑 Token:', loginData.token ? 'Presente' : 'Ausente');
    
    // Testar endpoint admin
    console.log('🔒 Testando endpoint admin...');
    const adminResponse = await fetch(`${API_BASE_URL}/api/admin/google-ai-key`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ Acesso admin bem-sucedido!');
      console.log('📊 Dados:', adminData);
    } else {
      const errorData = await adminResponse.json();
      console.error('❌ Erro no acesso admin:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar teste
testAuth();
