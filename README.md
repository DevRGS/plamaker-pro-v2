# PlanMaker Pro - Sistema de Planos e Vendedores

Um sistema completo para gerenciamento de planos, vendedores e análise de conversões com tracking geográfico.

## 🚀 Funcionalidades

### Dashboard Administrativo
- ✅ **Gestão de Clientes**: Adicione clientes com botão "Novo Cliente" especificando plano e valor
- ✅ **Métricas Completas**: Receita total, receita média, taxa de conversão, plano mais popular
- ✅ **Análise por Período**: Filtros de data para visualizar dados específicos
- ✅ **Cliques por Plano**: Monitoramento em tempo real dos cliques

### Sistema de Vendedores
- ✅ **Gestão de Vendedores**: Cadastro completo com dados pessoais e WhatsApp
- ✅ **Links Personalizados**: Geração automática de links únicos por vendedor
- ✅ **Tracking Automático**: Registro de cliques com localização geográfica
- ✅ **WhatsApp Direcionado**: Clientes são direcionados para o WhatsApp específico do vendedor

### Analytics Geográficos
- ✅ **Coleta de Localização**: Captura automática via IP e GPS (com permissão)
- ✅ **Cliques por Estado**: Visualização da distribuição geográfica
- ✅ **Planos por Região**: Análise de preferências regionais
- ✅ **Dashboards Visuais**: Gráficos e estatísticas em tempo real

### Configuração de Planos
- ✅ **Preços Dinâmicos**: Configuração de preços mensais e anuais
- ✅ **Módulos Personalizados**: Criação de módulos e spinboxes
- ✅ **Templates de Negócio**: Configurações pré-definidas por tipo de negócio
- ✅ **Limites de Planos**: Definição de módulos obrigatórios e opcionais

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Supabase
- **Deployment**: GitHub Pages
- **Analytics**: Geolocalização via APIs gratuitas

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/planmaker-pro.git
cd planmaker-pro
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure o Supabase:
- Crie um projeto no [Supabase](https://supabase.com)
- Execute as migrações SQL da pasta `supabase/migrations/`
- Adicione as credenciais no `.env.local`

5. Execute o projeto:
```bash
npm run dev
```

## 🚀 Deploy no GitHub Pages

### Configuração Automática

O projeto está configurado para deploy automático via GitHub Actions:

1. **Fork/Clone** este repositório
2. **Configure os Secrets** no GitHub:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

3. **Ative o GitHub Pages**:
   - Vá em Settings > Pages
   - Source: GitHub Actions
   - O deploy será automático a cada push na branch `main`

### Deploy Manual

```bash
# Build do projeto
npm run build

# Deploy para GitHub Pages
npm run deploy
```

## 💼 Como Usar

### Para Administradores

1. **Acesse o Admin**: `/admin` (requer autenticação)
2. **Gerencie Vendedores**: Aba "Vendedores" no dashboard
3. **Configure Planos**: Defina preços e módulos
4. **Monitore Analytics**: Visualize conversões e geografia

### Para Vendedores

1. **Receba seu Link**: Administrador gera link personalizado
2. **Compartilhe**: Use o link em suas campanhas
3. **Monitore Resultados**: Veja estatísticas no painel admin

### Para Clientes

1. **Acesse via Link**: Link direto do vendedor (opcional)
2. **Configure Plano**: Escolha segmento e módulos
3. **Finalize no WhatsApp**: Direcionamento automático para vendedor

## 🔗 Estrutura de Links

### Link Geral do Vendedor
```
https://seu-site.github.io/planmaker-pro/#/plans?seller=VENDEDOR_ID
```

### Link Específico por Plano
```
https://seu-site.github.io/planmaker-pro/#/plans?seller=VENDEDOR_ID&plan=PLANO_ID
```

## 📊 Funcionalidades de Analytics

### Dashboard Principal
- Total de cliques por período
- Receita total e média
- Taxa de conversão geral
- Plano mais popular

### Analytics Geográficos
- Distribuição por estado
- Preferências regionais de planos
- Top 5 estados com mais cliques
- Mapa de calor (futuro)

### Métricas por Vendedor
- Cliques totais por vendedor
- Estados de atuação
- Planos mais vendidos
- Taxa de conversão individual

## 🔧 Configuração Avançada

### Módulos Personalizados
1. Acesse "Módulos Custom" no admin
2. Defina nome, preço e configurações
3. Associe a planos específicos

### Templates de Negócio
1. Crie em "Templates Negócio"
2. Configure módulos pré-selecionados
3. Disponibilize para segmentos específicos

### Spinboxes e Limites
1. Configure em "Limites Planos"
2. Defina quantidades base e máximas
3. Marque como somente leitura se necessário

## 🌍 Sistema de Localização

### Detecção Automática
- **GPS**: Primeiro tenta GPS (mais preciso)
- **IP**: Fallback para geolocalização por IP
- **Normalização**: Estados brasileiros padronizados

### APIs Utilizadas
- `ipapi.co`: Geolocalização por IP (gratuita)
- `bigdatacloud.net`: Reverse geocoding (gratuita)
- Navegador: Geolocalização GPS nativa

## 📱 Responsividade

- Design totalmente responsivo
- Mobile-first approach
- Suporte a touch gestures
- Performance otimizada

## 🔒 Segurança e Privacidade

- Dados armazenados no Supabase (GDPR compliant)
- Localização coletada apenas para analytics
- Números de WhatsApp criptografados
- Row Level Security (RLS) no Supabase

## 🚀 Deploy Customizado

Para personalizar o deploy:

1. Altere `base` em `vite.config.ts` para seu domínio
2. Configure CNAME para domínio customizado
3. Ajuste variáveis de ambiente conforme necessário

## 📞 Suporte

- **Issues**: Use o GitHub Issues para bugs
- **Features**: Sugira melhorias via Pull Requests
- **Docs**: Documentação completa em `/docs`

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

**PlanMaker Pro** - Construído com ❤️ para vendas eficientes e analytics precisos.
