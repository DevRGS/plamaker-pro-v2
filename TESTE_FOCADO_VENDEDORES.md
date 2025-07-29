# 🎯 Teste Focado - Sistema de Vendedores

## ❌ **Problema Atual:**
Os erros que você está vendo são de outras funcionalidades (`admin_settings`, `dashboard_stats`) que não afetam o sistema de vendedores. Vamos focar no que importa!

## 🧪 **Teste Rápido:**

### 1. **Abra o arquivo de teste:**
```
file:///workspace/teste-vendedores.html
```

### 2. **Execute os testes na ordem:**
- ✅ **Teste 1:** Conexão Supabase
- ✅ **Teste 2:** Buscar Vendedores  
- ✅ **Teste 3:** Vendedor Específico
- ✅ **Teste 4:** WhatsApp

## 🔍 **Verificações no Console do Navegador:**

### Acesse: `http://localhost:5173/#/plans?seller=1753805630667`

**Se funcionando, deve aparecer:**
```
🔍 Plans.tsx - Parâmetros capturados:
  - sellerId (query): 1753805630667
🔍 PlanBuilder - vendedorId recebido: 1753805630667
🔍 Buscando vendedor com ID: 1753805630667
✅ Vendedor encontrado: Kamila Koehler - WhatsApp: 5541991626645
🎯 Vendedor ativo: 5541991626645
📱 Abrindo WhatsApp com número: 5541991626645
```

**Se NÃO funcionando, deve aparecer:**
```
🔍 PlanBuilder - vendedorId recebido: null
ℹ️ Nenhum vendedorId fornecido, usando número padrão
📱 Abrindo WhatsApp com número: 5541991898178
```

## 🎯 **Perguntas para Você:**

### 1. **No painel admin (`/admin` → Aba "Vendedores"):**
- ❓ Aparece o vendedor "Kamila Koehler"?
- ❓ Mostra o status "Ativo"?
- ❓ Mostra o WhatsApp: 5541991626645?

### 2. **No link específico:**
- ❓ O console mostra "Vendedor encontrado: Kamila Koehler"?
- ❓ O WhatsApp abre com o número 5541991626645?

### 3. **Comparação de links:**
- **Link com seller:** `?seller=1753805630667` → WhatsApp da Kamila?
- **Link padrão:** `/plans` → WhatsApp padrão (5541991898178)?

## 🚨 **Se ainda não funcionar:**

### Verifique se:
1. ✅ O servidor está rodando (`npm run dev`)
2. ✅ Está acessando o link correto
3. ✅ O console do navegador está aberto (F12)
4. ✅ Não há erros de JavaScript

### Me diga exatamente:
- ❓ O que aparece no console quando acessa o link?
- ❓ O WhatsApp abre com qual número?
- ❓ Os vendedores aparecem no painel admin?

## 🎉 **Resultado Esperado:**

### Link Específico:
```
http://localhost:5173/#/plans?seller=1753805630667
```
→ **WhatsApp: 5541991626645** (Kamila)

### Link Padrão:
```
http://localhost:5173/#/plans
```
→ **WhatsApp: 5541991898178** (padrão)

## 📞 **Próximos Passos:**

1. **Teste o arquivo HTML** primeiro
2. **Teste o link específico** no React
3. **Me informe os resultados** exatos
4. **Se funcionar:** Vamos resolver os outros erros
5. **Se não funcionar:** Vamos debugar mais

**Foque apenas no sistema de vendedores por enquanto!** 🎯