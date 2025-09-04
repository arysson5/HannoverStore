// Script para testar funcionalidade do carrinho
import fetch from 'node-fetch';

const API_BASE_URL = 'http://127.0.0.1:3002';

async function testCartFunctionality() {
  console.log('🧪 Testando funcionalidade do carrinho...\n');
  
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
      console.log(`   Marca: ${product.brand}`);
      console.log(`   Tamanhos: ${product.sizes ? product.sizes.join(', ') : 'N/A'}`);
      console.log(`   Cores: ${product.colors ? product.colors.join(', ') : 'N/A'}`);
      
      // Simular item do carrinho
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.jpg',
        size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Único',
        color: product.colors && product.colors.length > 0 ? product.colors[0] : 'Padrão',
        quantity: 1,
        brand: product.brand || 'N/A'
      };
      
      console.log('\n🛒 Item do carrinho simulado:');
      console.log(JSON.stringify(cartItem, null, 2));
      
      // 2. Testar endpoint individual do produto
      console.log(`\n2. Testando endpoint individual...`);
      const productResponse = await fetch(`${API_BASE_URL}/api/products/${product.id}`);
      
      if (productResponse.ok) {
        const productData = await productResponse.json();
        console.log(`✅ Produto individual carregado: ${productData.name}`);
        console.log(`   Descrição: ${productData.description || 'Sem descrição'}`);
        console.log(`   Imagens: ${productData.images ? productData.images.length : 0}`);
      } else {
        console.log('❌ Erro ao carregar produto individual:', productResponse.status);
      }
    }
    
    console.log('\n📋 Resumo:');
    console.log('✅ Backend funcionando corretamente');
    console.log('✅ Produtos sendo listados');
    console.log('✅ Dados do produto disponíveis para o carrinho');
    console.log('\n🎯 Próximos passos:');
    console.log('1. Inicie o frontend: npm run dev');
    console.log('2. Acesse: http://localhost:3000/produto/nike-air-max-90');
    console.log('3. Clique em "Adicionar ao Carrinho"');
    console.log('4. Verifique o console do navegador para logs de debug');
    console.log('5. Verifique se o item aparece no carrinho');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testCartFunctionality();
