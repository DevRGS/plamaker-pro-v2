# 🚀 Criar Tabela Sellers no Supabase

## 🐛 Problema Identificado
A tabela `sellers` não existe no Supabase, por isso a funcionalidade de vendedores não está funcionando.

## 📋 Passo a Passo para Criar a Tabela

### 1. Acesse o Supabase
- Vá para: **https://cmntbwbkyxnydojpouyh.supabase.co**
- Faça login na sua conta

### 2. Abra o SQL Editor
- No painel lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova consulta

### 3. Cole e Execute o SQL
Copie e cole o seguinte código SQL:

```sql
-- Create table for sellers
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  whatsappNumber TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (temporário para teste)
CREATE POLICY "Allow public read access" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.sellers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.sellers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.sellers FOR DELETE USING (true);

-- Insert sample data
INSERT INTO public.sellers (id, name, email, phone, whatsappNumber, isActive) VALUES 
('1753805630667', 'Kamila Koehler', 'kamila.koehler@cplug.com.br', '5541991626645', '5541991626645', true);
```

### 4. Execute o SQL
- Clique no botão **"Run"** (▶️) ou pressione **Ctrl+Enter**
- Aguarde a execução completar

### 5. Verifique se Funcionou
- Você deve ver uma mensagem de sucesso
- Vá para **"Table Editor"** no painel lateral
- Procure pela tabela **"sellers"**
- Deve mostrar 1 vendedor (Kamila)

## ✅ Após Criar a Tabela

### 1. Teste a Funcionalidade
- Acesse: `http://localhost:5173/admin`
- Vá na aba "Vendedores"
- Deve mostrar o vendedor Kamila

### 2. Teste o Link Específico
- Copie o link: `http://localhost:5173/#/plans?seller=1753805630667`
- Abra em aba anônima
- Abra o console (F12)
- Deve aparecer:
```
🔍 Plans.tsx - Parâmetros capturados:
  - vendedorId (rota): null
  - sellerId (query): 1753805630667
  - finalSellerId: 1753805630667
🔍 PlanBuilder - vendedorId recebido: 1753805630667
🔍 Buscando vendedor com ID: 1753805630667
✅ Vendedor encontrado: Kamila Koehler - WhatsApp: 5541991626645
```

### 3. Teste o WhatsApp
- Escolha um plano e clique em "Comprar"
- Deve abrir WhatsApp com número: **5541991626645**

## 🎯 Resultado Esperado

### Link com Seller:
```
http://localhost:5173/#/plans?seller=1753805630667
```
→ WhatsApp: **5541991626645** (Kamila)

### Link Padrão:
```
http://localhost:5173/#/plans
```
→ WhatsApp: **5541991898178** (padrão)

## 🐛 Se Houver Problemas

### Tabela não foi criada:
- Verifique se o SQL executou sem erros
- Confirme se está no projeto correto do Supabase
- Tente executar o SQL novamente

### Vendedor não aparece:
- Verifique se o INSERT funcionou
- Confirme se a tabela tem dados no Table Editor
- Verifique as políticas RLS

### Link não funciona:
- Confirme se o ID está correto: `1753805630667`
- Verifique se o console mostra os logs
- Teste com diferentes vendedores

## 📞 Suporte

Se ainda não funcionar:
- Compartilhe os logs do console
- Confirme se a tabela foi criada
- Verifique se o vendedor existe na tabela