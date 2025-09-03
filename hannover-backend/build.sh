#!/bin/bash

# 🚀 Script de Build para Produção - Backend Hannover Store

echo "🏗️  Iniciando build do backend para produção..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório hannover-backend"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install --production

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

# Verificar se os arquivos de dados existem
echo "🔍 Verificando arquivos de dados..."
if [ -f "data/products.json" ] && [ -f "data/users.json" ] && [ -f "data/categories.json" ] && [ -f "data/settings.json" ]; then
    echo "✅ Todos os arquivos de dados estão presentes"
else
    echo "⚠️  Alguns arquivos de dados podem estar ausentes"
fi

# Verificar se o servidor principal existe
if [ -f "src/server-simple.js" ]; then
    echo "✅ Servidor principal encontrado"
else
    echo "❌ Erro: src/server-simple.js não encontrado"
    exit 1
fi

echo "🎉 Backend pronto para deploy no Render!"
echo "🚀 Execute 'npm start' para iniciar o servidor"
