#!/bin/bash

# Script de Deploy Automático - PlanMaker Pro
# Executa deploy a cada alteração no código

echo "🚀 Iniciando deploy automático do PlanMaker Pro..."

# Verificar se há alterações
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  Nenhuma alteração detectada."
    exit 0
fi

# Adicionar todas as alterações
echo "📦 Adicionando alterações..."
git add .

# Commit com timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MSG="🔄 Deploy automático - $TIMESTAMP

Alterações detectadas e enviadas para produção automaticamente.
Site será atualizado em: https://devrgs.github.io/plamaker-pro-v2/"

echo "💾 Fazendo commit..."
git commit -m "$COMMIT_MSG"

# Push para main (ativa GitHub Actions)
echo "🌐 Enviando para GitHub..."
git push origin main

echo "✅ Deploy iniciado!"
echo "🔗 Acompanhe o progresso em: https://github.com/DevRGS/plamaker-pro-v2/actions"
echo "🌐 Site será atualizado em: https://devrgs.github.io/plamaker-pro-v2/"
echo ""
echo "⏱️  O deploy leva cerca de 2-3 minutos para completar."

# Verificar status do último workflow
echo "📊 Verificando status do deploy..."
sleep 5

# Aguardar alguns segundos e verificar novamente
curl -s -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/repos/DevRGS/plamaker-pro-v2/actions/runs?per_page=1 | \
     grep -E '"status"|"conclusion"' | head -2

echo ""
echo "🎉 Deploy automático configurado! A cada alteração, execute:"
echo "   ./deploy.sh"