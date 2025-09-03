#!/bin/bash

# 🚀 Script de Build para Produção - Hannover Store

echo "🏗️  Iniciando build para produção..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Build do Frontend
echo "📦 Construindo frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend construído com sucesso!"
else
    echo "❌ Erro ao construir frontend"
    exit 1
fi

# Verificar se o diretório dist foi criado
if [ -d "dist" ]; then
    echo "✅ Diretório dist criado com sucesso"
    echo "📁 Tamanho do build: $(du -sh dist | cut -f1)"
else
    echo "❌ Erro: Diretório dist não foi criado"
    exit 1
fi

echo "🎉 Build concluído com sucesso!"
echo "🚀 Pronto para deploy no Vercel!"
