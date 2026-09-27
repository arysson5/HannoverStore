// Script para debugar endpoints específicos
import fetch from 'node-fetch';

const API_BASE_URL = 'https://hannover-backend.onrender.com';

async function debugEndpoints() {
  console.log('🔍 Debugando endpoints específicos...\n');
  
  try {
    // 1. Testar login primeiro
    console.log('1. Testando login...');
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
      const errorData = await loginResponse.json();
      console.log('Erro:', errorData);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido');
    console.log('Token:', loginData.token ? 'Presente' : 'Ausente');
    console.log('Usuário:', loginData.user.name);
    
    const token = loginData.token;
    
    // 2. Testar perfil
    console.log('\n2. Testando perfil...');
    const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', profileResponse.status);
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Perfil:', profileData);
    } else {
      const errorData = await profileResponse.json();
      console.log('❌ Erro perfil:', errorData);
    }
    
    // 3. Testar dashboard admin
    console.log('\n3. Testando dashboard admin...');
    const adminResponse = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', adminResponse.status);
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ Dashboard admin:', adminData);
    } else {
      const errorData = await adminResponse.json();
      console.log('❌ Erro dashboard:', errorData);
    }
    
    // 4. Testar listar usuários
    console.log('\n4. Testando listar usuários...');
    const usersResponse = await fetch(`${API_BASE_URL}/api/auth/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', usersResponse.status);
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Usuários:', usersData.length, 'usuários encontrados');
    } else {
      const errorData = await usersResponse.json();
      console.log('❌ Erro usuários:', errorData);
    }
    
    // 5. Testar chave API admin
    console.log('\n5. Testando chave API admin...');
    const apiKeyResponse = await fetch(`${API_BASE_URL}/api/admin/google-ai-key`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', apiKeyResponse.status);
    if (apiKeyResponse.ok) {
      const apiKeyData = await apiKeyResponse.json();
      console.log('✅ Chave API admin:', apiKeyData);
    } else {
      const errorData = await apiKeyResponse.json();
      console.log('❌ Erro chave API admin:', errorData);
    }
    
    // 6. Testar chave API pública
    console.log('\n6. Testando chave API pública...');
    const publicApiResponse = await fetch(`${API_BASE_URL}/api/google-ai-key`);
    
    console.log('Status:', publicApiResponse.status);
    if (publicApiResponse.ok) {
      const publicApiData = await publicApiResponse.json();
      console.log('✅ Chave API pública:', publicApiData);
    } else {
      const errorData = await publicApiResponse.json();
      console.log('❌ Erro chave API pública:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

debugEndpoints();
