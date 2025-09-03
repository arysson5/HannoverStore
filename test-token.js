// Script para testar se o token está sendo enviado corretamente
import fetch from 'node-fetch';

const API_BASE_URL = 'http://127.0.0.1:3002';

async function testToken() {
  console.log('🧪 Testando token de autenticação...\n');
  
  try {
    // 1. Fazer login
    console.log('1. Fazendo login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@hannover.com',
        password: 'password'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login falhou:', loginResponse.status);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido:', loginData.user.name, loginData.user.role);
    console.log('Token:', loginData.token.substring(0, 20) + '...');
    
    const token = loginData.token;
    
    // 2. Testar perfil
    console.log('\n2. Testando perfil...');
    const profileResponse = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', profileResponse.status);
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Perfil OK:', profileData.name, profileData.role);
    } else {
      const errorText = await profileResponse.text();
      console.log('❌ Erro no perfil:', errorText);
    }
    
    // 3. Testar endpoint admin
    console.log('\n3. Testando endpoint admin...');
    const adminResponse = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Status:', adminResponse.status);
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ Admin endpoint OK:', adminData);
    } else {
      const errorText = await adminResponse.text();
      console.log('❌ Erro no admin:', errorText);
    }
    
    // 4. Testar criar produto
    console.log('\n4. Testando criar produto...');
    const createResponse = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Teste Token',
        description: 'Teste de token',
        price: 99.99,
        category: 'tenis',
        brand: 'Teste',
        images: ['teste.jpg'],
        stock: 5
      })
    });
    
    console.log('Status:', createResponse.status);
    if (createResponse.ok) {
      const productData = await createResponse.json();
      console.log('✅ Produto criado:', productData.name);
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Erro ao criar produto:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testToken();
