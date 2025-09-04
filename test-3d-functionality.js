// Script para testar funcionalidade 3D
console.log('🧪 Testando funcionalidade 3D...\n');

// Verificar compatibilidade do navegador
function check3DCompatibility() {
  console.log('🔍 Verificação de compatibilidade 3D:');
  
  // 1. Verificar se é dispositivo móvel
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                        window.innerWidth <= 768 ||
                        'ontouchstart' in window;
  
  console.log(`📱 Dispositivo móvel: ${isMobileDevice ? '✅ Sim' : '❌ Não'}`);
  console.log(`   User Agent: ${navigator.userAgent}`);
  console.log(`   Largura da tela: ${window.innerWidth}px`);
  console.log(`   Touch support: ${'ontouchstart' in window ? 'Sim' : 'Não'}`);
  
  // 2. Verificar suporte à câmera
  const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  console.log(`📷 Suporte à câmera: ${hasCamera ? '✅ Sim' : '❌ Não'}`);
  
  // 3. Verificar HTTPS
  const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';
  console.log(`🔒 HTTPS/Localhost: ${isHTTPS ? '✅ Sim' : '❌ Não'}`);
  console.log(`   Protocolo: ${location.protocol}`);
  console.log(`   Hostname: ${location.hostname}`);
  
  // 4. Verificar permissões
  if (navigator.permissions) {
    navigator.permissions.query({ name: 'camera' }).then(result => {
      console.log(`🔐 Permissão de câmera: ${result.state}`);
    }).catch(() => {
      console.log('🔐 Permissão de câmera: Não suportado');
    });
  } else {
    console.log('🔐 Permissão de câmera: API não suportada');
  }
  
  // 5. Verificar WebGL (para renderização 3D)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  console.log(`🎮 WebGL: ${gl ? '✅ Suportado' : '❌ Não suportado'}`);
  
  // 6. Verificar CSS 3D Transforms
  const testElement = document.createElement('div');
  const transforms = [
    'transform',
    'WebkitTransform',
    'MozTransform',
    'msTransform'
  ];
  
  const has3DSupport = transforms.some(prop => {
    return prop in testElement.style;
  });
  
  console.log(`🎨 CSS 3D Transforms: ${has3DSupport ? '✅ Suportado' : '❌ Não suportado'}`);
  
  // Resultado final
  const isCompatible = isMobileDevice && hasCamera && isHTTPS;
  console.log(`\n🎯 Compatibilidade geral: ${isCompatible ? '✅ COMPATÍVEL' : '❌ INCOMPATÍVEL'}`);
  
  if (!isCompatible) {
    console.log('\n📋 Motivos da incompatibilidade:');
    if (!isMobileDevice) {
      console.log('   • Não é um dispositivo móvel');
    }
    if (!hasCamera) {
      console.log('   • Câmera não disponível');
    }
    if (!isHTTPS) {
      console.log('   • Conexão não segura (não é HTTPS)');
    }
  }
  
  return {
    isMobileDevice,
    hasCamera,
    isHTTPS,
    hasWebGL: !!gl,
    has3DSupport,
    isCompatible
  };
}

// Executar verificação
const compatibility = check3DCompatibility();

console.log('\n📱 Instruções para testar:');
console.log('1. Acesse: http://localhost:3000');
console.log('2. Clique em qualquer produto');
console.log('3. Clique no botão "👟 3D"');
console.log('4. Verifique a mensagem de compatibilidade');

if (compatibility.isCompatible) {
  console.log('\n✅ Seu dispositivo é compatível!');
  console.log('   • A câmera deve ser ativada');
  console.log('   • Posicione seu pé na tela');
  console.log('   • O sistema detectará automaticamente');
} else {
  console.log('\n❌ Seu dispositivo não é compatível');
  console.log('   • Use um celular ou tablet');
  console.log('   • Certifique-se de ter câmera');
  console.log('   • Acesse via HTTPS');
}
