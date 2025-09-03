#!/bin/bash

echo "🔧 Testando build local..."

# Limpar build anterior
rm -rf dist

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer build
echo "🏗️ Fazendo build..."
npm run build

# Verificar se o build foi bem-sucedido
if [ -d "dist" ]; then
    echo "✅ Build bem-sucedido!"
    echo "📁 Arquivos gerados:"
    ls -la dist/
    echo ""
    echo "📁 Assets:"
    ls -la dist/assets/ 2>/dev/null || echo "Pasta assets não encontrada"
else
    echo "❌ Build falhou!"
    exit 1
fi

echo "🎉 Teste concluído!"
