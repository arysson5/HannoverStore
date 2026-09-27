// Script para testar se o servidor Render está funcionando
import fetch from 'node-fetch';

const RENDER_URL = 'https://hannover-backend.onrender.com';

async function testRenderServer() {
  console.log('🔍 Testando servidor Render...\n');
  
  try {
    // 1. Testar Health Check
    console.log('1. Testando Health Check...');
    const healthResponse = await fetch(`${RENDER_URL}/api/health`);
    console.log('Status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check OK:', healthData);
    } else {
      const errorText = await healthResponse.text();
      console.log('❌ Health Check falhou:', errorText.substring(0, 200));
    }
    
    // 2. Testar endpoint de produtos
    console.log('\n2. Testando endpoint de produtos...');
    const productsResponse = await fetch(`${RENDER_URL}/api/products`);
    console.log('Status:', productsResponse.status);
    
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Produtos OK:', `${productsData.total} produtos`);
    } else {
      const errorText = await productsResponse.text();
      console.log('❌ Produtos falhou:', errorText.substring(0, 200));
    }
    
    // 3. Testar login
    console.log('\n3. Testando login...');
    const loginResponse = await fetch(`${RENDER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@hannover.com',
        password: process.env.ADMIN_PASSWORD || 'your-admin-password-here'
      })
    });
    
    console.log('Status:', loginResponse.status);
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login OK:', loginData.user.name);
      
      // 4. Testar endpoint admin com token
      console.log('\n4. Testando endpoint admin...');
      const adminResponse = await fetch(`${RENDER_URL}/api/admin/google-ai-key`, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      
      console.log('Status:', adminResponse.status);
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('✅ Admin endpoint OK:', adminData);
      } else {
        const errorText = await adminResponse.text();
        console.log('❌ Admin endpoint falhou:', errorText.substring(0, 200));
      }
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login falhou:', errorText.substring(0, 200));
    }
    
    // 5. Testar chave API pública
    console.log('\n5. Testando chave API pública...');
    const publicApiResponse = await fetch(`${RENDER_URL}/api/google-ai-key`);
    console.log('Status:', publicApiResponse.status);
    
    if (publicApiResponse.ok) {
      const publicApiData = await publicApiResponse.json();
      console.log('✅ Chave API pública OK:', publicApiData);
    } else {
      const errorText = await publicApiResponse.text();
      console.log('❌ Chave API pública falhou:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
  
  console.log('\n📊 Resumo:');
  console.log('Se todos os testes passaram, o servidor Render está funcionando.');
  console.log('Se algum teste falhou, há problemas no servidor Render.');
}

testRenderServer();
