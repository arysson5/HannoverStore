// Script para testar se o AdminSettings está funcionando
import fetch from 'node-fetch';

const API_BASE_URL = 'http://127.0.0.1:3002';

async function testAdminSettings() {
  console.log('🧪 Testando AdminSettings...\n');
  
  try {
    // 1. Testar login primeiro
    console.log('1. Fazendo login como admin...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@hannover.com',
        password: process.env.ADMIN_PASSWORD || 'your-admin-password-here'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login falhou:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido:', loginData.user.name);
    
    const token = loginData.token;
    
    // 2. Testar endpoint de status da chave API
    console.log('\n2. Testando status da chave API...');
    const statusResponse = await fetch(`${API_BASE_URL}/api/admin/google-ai-key`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', statusResponse.status);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Status da chave API:', statusData);
    } else {
      const errorText = await statusResponse.text();
      console.log('❌ Erro no status:', errorText);
    }
    
    // 3. Testar salvar chave API (simulação)
    console.log('\n3. Testando salvamento da chave API...');
    const saveResponse = await fetch(`${API_BASE_URL}/api/admin/google-ai-key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: 'AIzaTestKey123456789'
      })
    });
    
    console.log('Status:', saveResponse.status);
    if (saveResponse.ok) {
      const saveData = await saveResponse.json();
      console.log('✅ Chave API salva:', saveData);
    } else {
      const errorText = await saveResponse.text();
      console.log('❌ Erro ao salvar:', errorText);
    }
    
    // 4. Testar chave API pública
    console.log('\n4. Testando chave API pública...');
    const publicResponse = await fetch(`${API_BASE_URL}/api/google-ai-key`);
    
    console.log('Status:', publicResponse.status);
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log('✅ Chave API pública:', publicData);
    } else {
      const errorText = await publicResponse.text();
      console.log('❌ Erro na chave pública:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
  
  console.log('\n📋 Instruções:');
  console.log('1. Certifique-se de que o backend está rodando: cd hannover-backend && npm start');
  console.log('2. Certifique-se de que o frontend está rodando: npm run dev');
  console.log('3. Acesse: http://localhost:3000/admin/settings');
}

testAdminSettings();
