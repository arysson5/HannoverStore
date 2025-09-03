// Script para testar todos os endpoints do backend
const API_BASE_URL = 'https://hannover-backend.onrender.com';

// Cores para console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json().catch(() => ({}));
    
    if (response.ok) {
      log(`✅ ${method} ${endpoint} - ${response.status}`, 'green');
      return { success: true, data: responseData };
    } else {
      log(`❌ ${method} ${endpoint} - ${response.status}: ${responseData.error || 'Erro desconhecido'}`, 'red');
      return { success: false, error: responseData };
    }
  } catch (error) {
    log(`💥 ${method} ${endpoint} - Erro de conexão: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('🧪 Iniciando testes dos endpoints do backend Hannover Store', 'blue');
  log('=' * 60, 'blue');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Teste 1: Health Check
  log('\n📋 Teste 1: Health Check', 'yellow');
  totalTests++;
  const healthTest = await testEndpoint('GET', '/api/health');
  if (healthTest.success) passedTests++;
  
  // Teste 2: Listar produtos
  log('\n📋 Teste 2: Listar produtos', 'yellow');
  totalTests++;
  const productsTest = await testEndpoint('GET', '/api/products');
  if (productsTest.success) passedTests++;
  
  // Teste 3: Listar categorias
  log('\n📋 Teste 3: Listar categorias', 'yellow');
  totalTests++;
  const categoriesTest = await testEndpoint('GET', '/api/categories');
  if (categoriesTest.success) passedTests++;
  
  // Teste 4: Registrar usuário
  log('\n📋 Teste 4: Registrar usuário', 'yellow');
  totalTests++;
  const registerData = {
    name: 'Teste Usuário',
    email: `teste${Date.now()}@teste.com`,
    password: '123456'
  };
  const registerTest = await testEndpoint('POST', '/api/auth/register', registerData);
  if (registerTest.success) passedTests++;
  
  // Teste 5: Login
  log('\n📋 Teste 5: Login', 'yellow');
  totalTests++;
  const loginData = {
    email: 'admin@hannover.com',
    password: 'password'
  };
  const loginTest = await testEndpoint('POST', '/api/auth/login', loginData);
  if (loginTest.success) passedTests++;
  
  let adminToken = null;
  if (loginTest.success && loginTest.data.token) {
    adminToken = loginTest.data.token;
    log(`🔑 Token admin obtido: ${adminToken.substring(0, 20)}...`, 'green');
  }
  
  // Teste 6: Perfil do usuário (com token)
  if (adminToken) {
    log('\n📋 Teste 6: Perfil do usuário', 'yellow');
    totalTests++;
    const profileTest = await testEndpoint('GET', '/api/auth/profile', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    if (profileTest.success) passedTests++;
  }
  
  // Teste 7: Dashboard admin
  if (adminToken) {
    log('\n📋 Teste 7: Dashboard admin', 'yellow');
    totalTests++;
    const adminStatsTest = await testEndpoint('GET', '/api/admin/stats', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    if (adminStatsTest.success) passedTests++;
  }
  
  // Teste 8: Listar usuários (admin)
  if (adminToken) {
    log('\n📋 Teste 8: Listar usuários (admin)', 'yellow');
    totalTests++;
    const adminUsersTest = await testEndpoint('GET', '/api/auth/users', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    if (adminUsersTest.success) passedTests++;
  }
  
  // Teste 9: Chave API Google AI (admin)
  if (adminToken) {
    log('\n📋 Teste 9: Status da chave API Google AI', 'yellow');
    totalTests++;
    const apiKeyTest = await testEndpoint('GET', '/api/admin/google-ai-key', null, {
      'Authorization': `Bearer ${adminToken}`
    });
    if (apiKeyTest.success) passedTests++;
  }
  
  // Teste 10: Chave API Google AI (pública)
  log('\n📋 Teste 10: Chave API Google AI (pública)', 'yellow');
  totalTests++;
  const publicApiKeyTest = await testEndpoint('GET', '/api/google-ai-key');
  if (publicApiKeyTest.success) passedTests++;
  
  // Resumo dos testes
  log('\n' + '=' * 60, 'blue');
  log(`📊 Resumo dos testes:`, 'blue');
  log(`✅ Testes aprovados: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`❌ Testes falharam: ${totalTests - passedTests}/${totalTests}`, totalTests - passedTests > 0 ? 'red' : 'green');
  
  if (passedTests === totalTests) {
    log('\n🎉 Todos os testes passaram! Backend está 100% funcional!', 'green');
  } else {
    log('\n⚠️ Alguns testes falharam. Verifique os logs acima.', 'yellow');
  }
  
  log('\n🔗 URLs importantes:', 'blue');
  log(`📊 Health Check: ${API_BASE_URL}/api/health`, 'blue');
  log(`📦 Produtos: ${API_BASE_URL}/api/products`, 'blue');
  log(`📂 Categorias: ${API_BASE_URL}/api/categories`, 'blue');
  log(`🔐 Login: ${API_BASE_URL}/api/auth/login`, 'blue');
  log(`⚙️ Admin Stats: ${API_BASE_URL}/api/admin/stats`, 'blue');
}

// Executar testes
runTests().catch(console.error);
