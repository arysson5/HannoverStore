// Script para testar a aplicação local
import fetch from 'node-fetch';

const LOCAL_BACKEND = 'http://localhost:3002';
const LOCAL_FRONTEND = 'http://localhost:3000';

async function testLocalApp() {
  console.log('🧪 Testando aplicação local...\n');
  
  try {
    // 1. Testar backend local
    console.log('1. Testando backend local...');
    const backendResponse = await fetch(`${LOCAL_BACKEND}/api/health`);
    
    if (backendResponse.ok) {
      const backendData = await backendResponse.json();
      console.log('✅ Backend local OK:', backendData.status);
    } else {
      console.log('❌ Backend local não está rodando');
      console.log('Execute: cd hannover-backend && npm start');
      return;
    }
    
    // 2. Testar login local
    console.log('\n2. Testando login local...');
    const loginResponse = await fetch(`${LOCAL_BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@hannover.com',
        password: process.env.ADMIN_PASSWORD || 'your-admin-password-here'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login local OK:', loginData.user.name);
      
      // 3. Testar endpoint admin local
      console.log('\n3. Testando endpoint admin local...');
      const adminResponse = await fetch(`${LOCAL_BACKEND}/api/admin/google-ai-key`, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('✅ Admin endpoint local OK:', adminData);
      } else {
        const errorText = await adminResponse.text();
        console.log('❌ Admin endpoint local falhou:', errorText);
      }
    } else {
      const errorText = await loginResponse.text();
      console.log('❌ Login local falhou:', errorText);
    }
    
    // 4. Testar frontend local
    console.log('\n4. Testando frontend local...');
    try {
      const frontendResponse = await fetch(`${LOCAL_FRONTEND}`);
      if (frontendResponse.ok) {
        console.log('✅ Frontend local OK');
      } else {
        console.log('❌ Frontend local não está rodando');
        console.log('Execute: npm run dev');
      }
    } catch (error) {
      console.log('❌ Frontend local não está rodando');
      console.log('Execute: npm run dev');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
  
  console.log('\n📋 Instruções:');
  console.log('1. Backend: cd hannover-backend && npm start');
  console.log('2. Frontend: npm run dev');
  console.log('3. Acesse: http://localhost:3000');
}

testLocalApp();
