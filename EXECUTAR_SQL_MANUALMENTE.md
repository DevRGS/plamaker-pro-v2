# 🚀 Executar SQL Manualmente no Supabase

## 📋 Passo a Passo

### 1. Acesse o Supabase
- Vá para: **https://cmntbwbkyxnydojpouyh.supabase.co**
- Faça login na sua conta

### 2. Abra o SQL Editor
- No painel lateral esquerdo, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova consulta

### 3. Cole o SQL
Copie e cole o seguinte código SQL:

```sql
-- Create table for vendedores (sellers)
CREATE TABLE IF NOT EXISTS public.vendedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  whatsapp TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendedores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only admins can view vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Only admins can insert vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Only admins can update vendedores" ON public.vendedores;
DROP POLICY IF EXISTS "Only admins can delete vendedores" ON public.vendedores;

-- Create policies for admin access only
CREATE POLICY "Only admins can view vendedores" 
ON public.vendedores 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can insert vendedores" 
ON public.vendedores 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can update vendedores" 
ON public.vendedores 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can delete vendedores" 
ON public.vendedores 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_vendedores_updated_at ON public.vendedores;
CREATE TRIGGER update_vendedores_updated_at
BEFORE UPDATE ON public.vendedores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vendedores
INSERT INTO public.vendedores (nome, email, whatsapp) VALUES 
('João Silva', 'joao@exemplo.com', '5541991898178'),
('Maria Santos', 'maria@exemplo.com', '5541999999999'),
('Pedro Costa', 'pedro@exemplo.com', '5541888888888');
```

### 4. Execute o SQL
- Clique no botão **"Run"** (▶️) ou pressione **Ctrl+Enter**
- Aguarde a execução completar

### 5. Verifique se funcionou
- Você deve ver uma mensagem de sucesso
- Vá para **"Table Editor"** no painel lateral
- Procure pela tabela **"vendedores"**
- Deve mostrar 3 vendedores de exemplo

## ✅ Próximos Passos

Após executar o SQL com sucesso:

1. **Acesse o painel admin** do seu projeto: `/admin`
2. **Vá para a aba "Vendedores"**
3. **Verifique se os vendedores aparecem** na lista
4. **Teste os links específicos** dos vendedores

## 🔧 Como Testar

1. **Crie um vendedor** no painel admin
2. **Copie o link** gerado
3. **Abra o link** em uma aba anônima
4. **Escolha um plano** e clique em "Comprar"
5. **Verifique se abre o WhatsApp** com o número correto do vendedor

## 🐛 Se Houver Problemas

- **Verifique se o SQL executou sem erros**
- **Confirme se a tabela foi criada** no Table Editor
- **Verifique se os vendedores aparecem** no painel admin
- **Teste o console do navegador** para ver erros

## 📞 Suporte

Se precisar de ajuda:
- Verifique os logs do console do navegador
- Confirme se todas as políticas RLS foram criadas
- Teste com um vendedor de exemplo primeiro