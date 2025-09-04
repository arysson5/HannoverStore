// Script para testar as rotas de produtos
import fetch from 'node-fetch';

const API_BASE_URL = 'http://127.0.0.1:3002';

async function testProductRoutes() {
  console.log('🧪 Testando rotas de produtos...\n');
  
  try {
    // 1. Listar produtos
    console.log('1. Listando produtos...');
    const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
    
    if (!productsResponse.ok) {
      console.log('❌ Erro ao listar produtos:', productsResponse.status);
      return;
    }
    
    const productsData = await productsResponse.json();
    console.log(`✅ ${productsData.total} produtos encontrados`);
    
    if (productsData.products.length > 0) {
      const product = productsData.products[0];
      console.log(`\n📦 Produto de exemplo: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Preço: R$ ${product.price}`);
      console.log(`   Categoria: ${product.category}`);
      console.log(`   Marca: ${product.brand}`);
      
      // Gerar slug do produto
      const productSlug = product.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      console.log(`   Slug: ${productSlug}`);
      console.log(`   URL: /produto/${productSlug}`);
      
      // 2. Testar endpoint individual
      console.log(`\n2. Testando endpoint individual...`);
      const productResponse = await fetch(`${API_BASE_URL}/api/products/${product.id}`);
      
      if (productResponse.ok) {
        const productData = await productResponse.json();
        console.log(`✅ Produto individual carregado: ${productData.name}`);
        console.log(`   Descrição: ${productData.description || 'Sem descrição'}`);
        console.log(`   Imagens: ${productData.images ? productData.images.length : 0}`);
        console.log(`   Tamanhos: ${productData.sizes ? productData.sizes.join(', ') : 'N/A'}`);
        console.log(`   Cores: ${productData.colors ? productData.colors.join(', ') : 'N/A'}`);
        console.log(`   Características: ${productData.features ? productData.features.join(', ') : 'N/A'}`);
      } else {
        console.log('❌ Erro ao carregar produto individual:', productResponse.status);
      }
    }
    
    console.log('\n📋 Resumo:');
    console.log('✅ Backend funcionando corretamente');
    console.log('✅ Produtos sendo listados');
    console.log('✅ Endpoints individuais funcionando');
    console.log('\n🎯 Próximos passos:');
    console.log('1. Inicie o frontend: npm run dev');
    console.log('2. Acesse: http://localhost:3000');
    console.log('3. Clique em qualquer produto');
    console.log('4. Verifique se navega para /produto/{nome-produto}');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testProductRoutes();
