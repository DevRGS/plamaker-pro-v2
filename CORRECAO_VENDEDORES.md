# 🔧 Correção do Problema dos Vendedores

## 🐛 Problema Identificado
O link estava usando `?seller=` como parâmetro de query, mas o código esperava o parâmetro na rota.

## ✅ Correções Implementadas

### 1. Captura do Parâmetro Seller
- ✅ Modificado `src/pages/Plans.tsx` para capturar `?seller=` da query string
- ✅ Mantém compatibilidade com rota `/plans/:vendedorId`

### 2. Geração de Links Correta
- ✅ Atualizado `generateVendedorLink()` para usar formato `?seller=`
- ✅ Links agora são: `https://devrgs.github.io/plamaker-pro-v2/#/plans?seller=1753805630667`

### 3. Logs de Debug
- ✅ Adicionados logs para debugar o processo
- ✅ Mostra qual número está sendo usado no WhatsApp

## 🧪 Como Testar

### 1. Acesse o Painel Admin
```
http://localhost:5173/admin
```

### 2. Vá na Aba "Vendedores"
- Deve mostrar o vendedor existente
- O link deve ser: `http://localhost:5173/#/plans?seller=1753805630667`

### 3. Teste o Link
- Copie o link do vendedor
- Abra em aba anônima
- Abra o console do navegador (F12)
- Deve aparecer:
```
🔍 PlanBuilder - vendedorId recebido: 1753805630667
🔍 Buscando vendedor com ID: 1753805630667
✅ Vendedor encontrado: [Nome] - WhatsApp: [Número]
```

### 4. Clique em "Comprar"
- Deve aparecer no console:
```
📱 Abrindo WhatsApp com número: [Número do Vendedor]
🔗 URL: https://wa.me/[Número]?text=...
```

## 🎯 Resultado Esperado

### Link com Seller:
```
https://devrgs.github.io/plamaker-pro-v2/#/plans?seller=1753805630667
```
→ Deve usar WhatsApp do vendedor específico

### Link Padrão:
```
https://devrgs.github.io/plamaker-pro-v2/#/plans
```
→ Deve usar WhatsApp padrão (5541991898178)

## 🔍 Verificações no Console

### Se funcionando:
```
🔍 PlanBuilder - vendedorId recebido: 1753805630667
🔍 Buscando vendedor com ID: 1753805630667
✅ Vendedor encontrado: Kamila Koehler - WhatsApp: 5541991626645
📱 Abrindo WhatsApp com número: 5541991626645
```

### Se não funcionando:
```
🔍 PlanBuilder - vendedorId recebido: null
ℹ️ Nenhum vendedorId fornecido, usando número padrão
📱 Abrindo WhatsApp com número: 5541991898178
```

## 🐛 Se Ainda Não Funcionar

### Verifique:
1. **URL está correta?** Deve ter `?seller=ID`
2. **Vendedor existe?** Confirme na tabela `sellers`
3. **Vendedor está ativo?** `isActive: true`
4. **Console mostra logs?** Deve aparecer os logs de debug

### Teste Manual:
1. Acesse: `http://localhost:5173/#/plans?seller=1753805630667`
2. Abra console (F12)
3. Verifique se aparece o log do vendedor
4. Clique em "Comprar" e veja qual número abre

## 📞 Suporte

Se ainda não funcionar:
- Compartilhe os logs do console
- Confirme a URL exata que está usando
- Verifique se o vendedor existe na tabela `sellers`