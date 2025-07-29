# Configuração da Funcionalidade de Vendedores

## 🎯 Problema Resolvido
O sistema agora suporta links específicos para vendedores, onde cada vendedor tem seu próprio número de WhatsApp que será usado quando o cliente clicar em "Comprar".

## 📋 Passos para Configurar

### 1. Criar a Tabela de Vendedores
Execute o seguinte SQL no seu painel do Supabase (SQL Editor):

```sql
-- Copie e cole o conteúdo do arquivo create_vendedores_table.sql
```

### 2. Funcionalidades Implementadas

#### ✅ Dashboard Admin - Nova Aba "Vendedores"
- Acesse o painel administrativo
- Clique na aba "Vendedores"
- Clique em "Novo Vendedor" para criar um vendedor
- Preencha: Nome, Email e WhatsApp
- O sistema gera automaticamente um link único para cada vendedor

#### ✅ Links Específicos dos Vendedores
- Cada vendedor tem um link no formato: `https://seudominio.com/#/plans/{vendedorId}`
- Quando o cliente acessa esse link, o sistema busca o número de WhatsApp específico do vendedor
- Ao clicar em "Comprar", o cliente é direcionado para o WhatsApp correto

#### ✅ Gerenciamento de Vendedores
- Lista todos os vendedores ativos
- Botão "Copiar" para copiar o link do vendedor
- Botão "Deletar" para remover vendedores
- Status ativo/inativo

## 🔧 Como Usar

### Para Administradores:
1. Acesse `/admin`
2. Vá para a aba "Vendedores"
3. Clique em "Novo Vendedor"
4. Preencha os dados:
   - **Nome**: Nome completo do vendedor
   - **Email**: Email único do vendedor
   - **WhatsApp**: Apenas números (ex: 5541999999999)
5. Clique em "Criar Vendedor"
6. Copie o link gerado e compartilhe com o vendedor

### Para Vendedores:
1. Compartilhe o link específico com seus clientes
2. Quando o cliente clicar em "Comprar", será direcionado para o WhatsApp do vendedor
3. O vendedor receberá a mensagem com os detalhes do plano escolhido

### Para Clientes:
1. Acesse o link específico do vendedor
2. Escolha o plano e módulos
3. Clique em "Comprar"
4. Será redirecionado para o WhatsApp do vendedor correto

## 🎨 Exemplo de Uso

### Link Padrão (sem vendedor):
```
https://seudominio.com/#/plans
```
→ Usa o número padrão: 5541991898178

### Link com Vendedor Específico:
```
https://seudominio.com/#/plans/123e4567-e89b-12d3-a456-426614174000
```
→ Usa o número do vendedor específico

## 🔍 Verificação

Para testar se está funcionando:

1. Crie um vendedor no painel admin
2. Copie o link gerado
3. Abra o link em uma aba anônima
4. Escolha um plano e clique em "Comprar"
5. Verifique se abre o WhatsApp com o número correto do vendedor

## 🐛 Solução de Problemas

### Se o link não funcionar:
1. Verifique se a tabela `vendedores` foi criada no Supabase
2. Confirme se o vendedor está ativo (`ativo = true`)
3. Verifique se o número de WhatsApp está no formato correto (apenas números)

### Se o número padrão ainda aparecer:
1. Verifique se o `vendedorId` está sendo passado corretamente na URL
2. Confirme se o console do navegador não mostra erros
3. Verifique se a consulta ao banco está funcionando

## 📝 Notas Técnicas

- O sistema usa React Router para capturar o `vendedorId` da URL
- A consulta ao banco é feita via Supabase
- O número padrão é usado como fallback se o vendedor não for encontrado
- Todos os vendedores são carregados no dashboard admin
- Os links são gerados dinamicamente baseados no `window.location`