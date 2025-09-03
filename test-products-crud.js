// Script para testar CRUDs de produtos
import fetch from 'node-fetch';

const API_BASE_URL = 'http://127.0.0.1:3002';

async function testProductsCRUD() {
  console.log('🧪 Testando CRUDs de produtos...\n');
  
  try {
    // 1. Fazer login como admin
    console.log('1. Fazendo login como admin...');
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
    console.log('✅ Login bem-sucedido:', loginData.user.name);
    
    const token = loginData.token;
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // 2. Testar criar produto
    console.log('\n2. Testando criar produto...');
    const createResponse = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Tênis Teste',
        description: 'Tênis para teste',
        price: 199.99,
        category: 'tenis',
        brand: 'Nike',
        images: ['teste.jpg'],
        stock: 10
      })
    });
    
    console.log('Status:', createResponse.status);
    if (createResponse.ok) {
      const productData = await createResponse.json();
      console.log('✅ Produto criado:', productData.name);
      
      const productId = productData.id;
      
      // 3. Testar atualizar produto
      console.log('\n3. Testando atualizar produto...');
      const updateResponse = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          name: 'Tênis Teste Atualizado',
          price: 249.99
        })
      });
      
      console.log('Status:', updateResponse.status);
      if (updateResponse.ok) {
        const updatedProduct = await updateResponse.json();
        console.log('✅ Produto atualizado:', updatedProduct.name);
      } else {
        const errorText = await updateResponse.text();
        console.log('❌ Erro ao atualizar:', errorText);
      }
      
      // 4. Testar deletar produto
      console.log('\n4. Testando deletar produto...');
      const deleteResponse = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      
      console.log('Status:', deleteResponse.status);
      if (deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        console.log('✅ Produto deletado:', deleteData.message);
      } else {
        const errorText = await deleteResponse.text();
        console.log('❌ Erro ao deletar:', errorText);
      }
      
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Erro ao criar produto:', errorText);
    }
    
    // 5. Testar listar produtos (público)
    console.log('\n5. Testando listar produtos...');
    const listResponse = await fetch(`${API_BASE_URL}/api/products`);
    
    console.log('Status:', listResponse.status);
    if (listResponse.ok) {
      const productsData = await listResponse.json();
      console.log('✅ Produtos listados:', `${productsData.total} produtos`);
    } else {
      const errorText = await listResponse.text();
      console.log('❌ Erro ao listar produtos:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
  
  console.log('\n📋 Resumo:');
  console.log('Se todos os testes passaram, os CRUDs estão funcionando.');
  console.log('Se algum teste falhou, há problemas nos endpoints.');
}

testProductsCRUD();
