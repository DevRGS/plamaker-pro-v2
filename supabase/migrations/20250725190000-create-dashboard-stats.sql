-- Migration para criar a tabela dashboard_stats
create table if not exists public.dashboard_stats (
  id uuid primary key default gen_random_uuid(),
  stat_key text not null unique,
  stat_value jsonb not null,
  updated_at timestamp with time zone default now()
);

-- Inserir dados iniciais para o dashboard
insert into public.dashboard_stats (stat_key, stat_value) values
  ('total_clicks', '{"value": 1250, "label": "Total de Cliques", "icon": "mouse-pointer"}'),
  ('total_revenue', '{"value": 45000.00, "label": "Receita Total", "icon": "dollar-sign"}'),
  ('active_plans', '{"value": 89, "label": "Planos Ativos", "icon": "check-circle"}'),
  ('conversion_rate', '{"value": 12.5, "label": "Taxa de Conversão", "icon": "trending-up"}')
on conflict (stat_key) do nothing;