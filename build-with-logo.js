import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando build com logo...');

try {
  // Executar build do Vite
  console.log('📦 Executando build do Vite...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verificar se o diretório dist existe
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('Diretório dist não encontrado');
  }

  // Copiar logo para o diretório dist
  const logoSource = path.join(__dirname, 'public', 'Hanover logo bg.png');
  const logoDest = path.join(distDir, 'Hanover logo bg.png');

  if (fs.existsSync(logoSource)) {
    fs.copyFileSync(logoSource, logoDest);
    console.log('✅ Logo copiada para o build');
  } else {
    console.warn('⚠️ Logo não encontrada em:', logoSource);
  }

  // Copiar outros assets estáticos se necessário
  const publicDir = path.join(__dirname, 'public');
  const publicFiles = fs.readdirSync(publicDir);
  
  publicFiles.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || 
        file.endsWith('.gif') || file.endsWith('.svg') || file.endsWith('.ico') || 
        file.endsWith('.webp')) {
      const sourcePath = path.join(publicDir, file);
      const destPath = path.join(distDir, file);
      
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ ${file} copiado para o build`);
      }
    }
  });

  console.log('🎉 Build concluído com sucesso!');
  console.log('📁 Arquivos em dist/:');
  const distFiles = fs.readdirSync(distDir);
  distFiles.forEach(file => {
    console.log(`   - ${file}`);
  });

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  // eslint-disable-next-line no-undef
  process.exit(1);
}
