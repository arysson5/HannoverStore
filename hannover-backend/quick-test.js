// Teste rápido do backend
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3002';

async function quickTest() {
  console.log('🧪 Teste rápido do backend...\n');
  
  try {
    // Teste 1: Health Check
    console.log('1. Testando Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.status);
    
    // Teste 2: Produtos
    console.log('\n2. Testando endpoint de produtos...');
    const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Produtos:', `${productsData.total} produtos encontrados`);
    
    // Teste 3: Categorias
    console.log('\n3. Testando endpoint de categorias...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categorias:', `${categoriesData.length} categorias encontradas`);
    
    // Teste 4: Login admin
    console.log('\n4. Testando login admin...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.ADMIN_EMAIL || 'admin@hannover.com',
        password: process.env.ADMIN_PASSWORD || 'your-admin-password-here'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login admin:', `Usuário: ${loginData.user.name}`);
      
      // Teste 5: Dashboard admin
      console.log('\n5. Testando dashboard admin...');
      const adminResponse = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${loginData.token}` }
      });
      
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log('✅ Dashboard admin:', adminData);
      } else {
        console.log('❌ Dashboard admin falhou');
      }
    } else {
      console.log('❌ Login admin falhou');
    }
    
    console.log('\n🎉 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

quickTest();
