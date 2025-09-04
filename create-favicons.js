import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Criando favicons da Hannover Store...');

try {
  const publicDir = path.join(__dirname, 'public');
  const logoSource = path.join(publicDir, 'Hanover logo bg.png');
  
  if (!fs.existsSync(logoSource)) {
    throw new Error('Logo da Hannover não encontrada em: ' + logoSource);
  }

  // Como não temos uma biblioteca de processamento de imagem, vamos criar um favicon simples
  // copiando a logo e criando um arquivo HTML que pode ser usado para gerar favicons
  
  const faviconHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Hannover Store Favicon Generator</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px;
            background: #f5f5f5;
        }
        .favicon-container {
            display: inline-block;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 10px;
        }
        .favicon-16 { width: 16px; height: 16px; }
        .favicon-32 { width: 32px; height: 32px; }
        .favicon-48 { width: 48px; height: 48px; }
        .favicon-64 { width: 64px; height: 64px; }
        .favicon-128 { width: 128px; height: 128px; }
        .favicon-180 { width: 180px; height: 180px; }
        .favicon-192 { width: 192px; height: 192px; }
        .favicon-512 { width: 512px; height: 512px; }
        
        .favicon-container img {
            border: 1px solid #ddd;
            border-radius: 4px;
            object-fit: contain;
        }
        
        h1 { color: #db1414; }
        .instructions {
            background: #e8f5e8;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>🏪 Hannover Store - Favicon Generator</h1>
    <p>Use esta página para gerar favicons da logo da Hannover Store</p>
    
    <div class="instructions">
        <h3>📋 Instruções:</h3>
        <ol>
            <li>Clique com o botão direito em cada imagem abaixo</li>
            <li>Selecione "Salvar imagem como..."</li>
            <li>Salve com os nomes: favicon.ico, favicon.png, apple-touch-icon.png</li>
            <li>Coloque os arquivos na pasta public/ do projeto</li>
        </ol>
    </div>

    <div class="favicon-container">
        <h4>Favicon 16x16</h4>
        <img src="/Hanover logo bg.png" class="favicon-16" alt="Favicon 16x16" />
    </div>

    <div class="favicon-container">
        <h4>Favicon 32x32</h4>
        <img src="/Hanover logo bg.png" class="favicon-32" alt="Favicon 32x32" />
    </div>

    <div class="favicon-container">
        <h4>Favicon 48x48</h4>
        <img src="/Hanover logo bg.png" class="favicon-48" alt="Favicon 48x48" />
    </div>

    <div class="favicon-container">
        <h4>Favicon 64x64</h4>
        <img src="/Hanover logo bg.png" class="favicon-64" alt="Favicon 64x64" />
    </div>

    <div class="favicon-container">
        <h4>Apple Touch Icon 180x180</h4>
        <img src="/Hanover logo bg.png" class="favicon-180" alt="Apple Touch Icon" />
    </div>

    <div class="favicon-container">
        <h4>PWA Icon 192x192</h4>
        <img src="/Hanover logo bg.png" class="favicon-192" alt="PWA Icon 192x192" />
    </div>

    <div class="favicon-container">
        <h4>PWA Icon 512x512</h4>
        <img src="/Hanover logo bg.png" class="favicon-512" alt="PWA Icon 512x512" />
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border-radius: 8px;">
        <h3>💡 Dica:</h3>
        <p>Para criar um favicon.ico, use um conversor online como <a href="https://favicon.io/favicon-converter/" target="_blank">favicon.io</a> ou <a href="https://realfavicongenerator.net/" target="_blank">RealFaviconGenerator</a></p>
    </div>
</body>
</html>`;

  // Salvar o gerador de favicon
  const faviconGeneratorPath = path.join(publicDir, 'favicon-generator.html');
  fs.writeFileSync(faviconGeneratorPath, faviconHtml);
  console.log('✅ Gerador de favicon criado em:', faviconGeneratorPath);

  // Criar um favicon simples copiando a logo
  const faviconPath = path.join(publicDir, 'favicon.png');
  fs.copyFileSync(logoSource, faviconPath);
  console.log('✅ favicon.png criado');

  // Criar apple-touch-icon
  const appleTouchIconPath = path.join(publicDir, 'apple-touch-icon.png');
  fs.copyFileSync(logoSource, appleTouchIconPath);
  console.log('✅ apple-touch-icon.png criado');

  console.log('🎉 Favicons criados com sucesso!');
  console.log('📁 Arquivos criados:');
  console.log('   - favicon.png');
  console.log('   - apple-touch-icon.png');
  console.log('   - favicon-generator.html');
  console.log('');
  console.log('🌐 Acesse: http://localhost:3000/favicon-generator.html');
  console.log('   para gerar favicons em diferentes tamanhos');

} catch (error) {
  console.error('❌ Erro ao criar favicons:', error.message);
  // eslint-disable-next-line no-undef
  process.exit(1);
}
