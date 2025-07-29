import { Module } from '@/types/plan';

export const modules: Record<string, Module> = {
  'api-dd': {
    id: 'api-dd',
    name: 'API DD',
    price: 49.90,
    allowsDiscount: true
  },
  'app-gestao': {
    id: 'app-gestao',
    name: 'App Gestão CPlug',
    price: 20.00,
    allowsDiscount: true
  },
  'atualizacao-tempo-real': {
    id: 'atualizacao-tempo-real',
    name: 'Atualização em Tempo Real',
    price: 49.00,
    allowsDiscount: true
  },
  'autoatendimento': {
    id: 'autoatendimento',
    name: 'Autoatendimento',
    price: 299.00,
    isSpinbox: true,
    allowsDiscount: false
  },
  'backup-realtime': {
    id: 'backup-realtime',
    name: 'Backup Realtime',
    price: 199.00,
    allowsDiscount: true,
    priceByPlan: {
      'performance': 99.00
    }
  },
  'business-intelligence': {
    id: 'business-intelligence',
    name: 'Business Intelligence (BI)',
    price: 99.00,
    allowsDiscount: true,
    priceByPlan: {
      'gestao': 199.00,
      'performance': 99.00,
      'autoatendimento': 200.00
    }
  },
  'cardapio-digital': {
    id: 'cardapio-digital',
    name: 'Cardápio digital',
    price: 99.00,
    allowsDiscount: true
  },
  'central-telefonica': {
    id: 'central-telefonica',
    name: 'Central Telefônica',
    price: 399.90,
    allowsDiscount: false
  },
  'conciliacao-bancaria': {
    id: 'conciliacao-bancaria',
    name: 'Conciliação Bancária',
    price: 50.00,
    allowsDiscount: true
  },
  'contratos-cartoes': {
    id: 'contratos-cartoes',
    name: 'Contratos de cartões e outros',
    price: 50.00,
    allowsDiscount: true,
    priceByPlan: {
      'bling': 49.90
    }
  },
  'controle-mesas': {
    id: 'controle-mesas',
    name: 'Controle de Mesas',
    price: 49.00,
    allowsDiscount: true
  },
  'delivery': {
    id: 'delivery',
    name: 'Delivery',
    price: 30.00,
    allowsDiscount: true,
    priceByPlan: {
      'bling': 40.00
    }
  },
  'delivery-direto-basico': {
    id: 'delivery-direto-basico',
    name: 'Delivery Direto Básico',
    price: 99.00,
    allowsDiscount: true
  },
  'delivery-direto-profissional': {
    id: 'delivery-direto-profissional',
    name: 'Delivery Direto Profissional',
    price: 200.00,
    allowsDiscount: true
  },
  'delivery-direto-vip': {
    id: 'delivery-direto-vip',
    name: 'Delivery Direto VIP',
    price: 300.00,
    allowsDiscount: true
  },
  'dominio-proprio': {
    id: 'dominio-proprio',
    name: 'Domínio Próprio',
    price: 19.90,
    allowsDiscount: false
  },
  'email-profissional': {
    id: 'email-profissional',
    name: 'E-mail Profissional',
    price: 19.90,
    allowsDiscount: true
  },
  'entrega-facil-ifood': {
    id: 'entrega-facil-ifood',
    name: 'Entrega Fácil iFood',
    price: 49.90,
    allowsDiscount: false
  },
  'estoque-grade': {
    id: 'estoque-grade',
    name: 'Estoque em Grade',
    price: 40.00,
    allowsDiscount: true
  },
  'facilita-nfe': {
    id: 'facilita-nfe',
    name: 'Facilita NFE',
    price: 99.00,
    allowsDiscount: true,
    priceByPlan: {
      'autoatendimento': 50.00
    }
  },
  'financeiro-estoque-relatorios': {
    id: 'financeiro-estoque-relatorios',
    name: 'Financeiro, Estoque e Relatórios',
    price: 0.00,
    allowsDiscount: true
  },
  'gestao-redes-sociais': {
    id: 'gestao-redes-sociais',
    name: 'Gestão de Redes Sociais',
    price: 0.00,
    allowsDiscount: false
  },
  'hub-delivery': {
    id: 'hub-delivery',
    name: 'Hub de Delivery',
    price: 79.00,
    allowsDiscount: true
  },
  'importacao-xml': {
    id: 'importacao-xml',
    name: 'Importação de XML',
    price: 29.00,
    allowsDiscount: true
  },
  'integracao-api': {
    id: 'integracao-api',
    name: 'Integração API',
    price: 199.90,
    allowsDiscount: false
  },
  'integracao-tap': {
    id: 'integracao-tap',
    name: 'Integração TAP',
    price: 299.00,
    allowsDiscount: false
  },
  'marketing': {
    id: 'marketing',
    name: 'Marketing',
    price: 24.50,
    allowsDiscount: true
  },
  'notas-fiscais-ilimitadas': {
    id: 'notas-fiscais-ilimitadas',
    name: 'Notas Fiscais Ilimitadas',
    price: 119.90,
    allowsDiscount: true
  },
  '30-notas-fiscais': {
    id: '30-notas-fiscais',
    name: '30 Notas Fiscais',
    price: 0.00,
    allowsDiscount: true
  },
  'ordem-servico': {
    id: 'ordem-servico',
    name: 'Ordem de Serviço',
    price: 20.00,
    allowsDiscount: true
  },
  'painel-senha-mobile': {
    id: 'painel-senha-mobile',
    name: 'Painel de Senha Mobile',
    price: 49.00,
    allowsDiscount: true
  },
  'painel-senha-tv': {
    id: 'painel-senha-tv',
    name: 'Painel de Senha TV',
    price: 0.00,
    allowsDiscount: true
  },
  'painel-senhas': {
    id: 'painel-senhas',
    name: 'Painel de Senhas',
    price: 49.90,
    allowsDiscount: true
  },
  'painel-multilojas': {
    id: 'painel-multilojas',
    name: 'Painel MultiLojas',
    price: 199.00,
    allowsDiscount: false
  },
  'producao': {
    id: 'producao',
    name: 'Produção',
    price: 30.00,
    allowsDiscount: true
  },
  'programa-fidelidade': {
    id: 'programa-fidelidade',
    name: 'Programa de Fidelidade',
    price: 299.90,
    allowsDiscount: false
  },
  'promocoes': {
    id: 'promocoes',
    name: 'Promoções',
    price: 24.50,
    allowsDiscount: true
  },
  'relatorio-basico': {
    id: 'relatorio-basico',
    name: 'Relatório Básico',
    price: 0.00,
    allowsDiscount: true
  },
  'relatorio-dinamico': {
    id: 'relatorio-dinamico',
    name: 'Relatório Dinâmico',
    price: 50.00,
    allowsDiscount: true
  },
  'relatorio-kds': {
    id: 'relatorio-kds',
    name: 'Relatório KDS',
    price: 29.90,
    allowsDiscount: true
  },
  'relatorios-financeiro-estoque': {
    id: 'relatorios-financeiro-estoque',
    name: 'Relatórios, Financeiro e Estoque',
    price: 0.00,
    allowsDiscount: true
  },
  'robo-whatsapp': {
    id: 'robo-whatsapp',
    name: 'Robô de WhatsApp + Recuperador de Pedido',
    price: 99.00,
    allowsDiscount: false
  },
  'smart-menu': {
    id: 'smart-menu',
    name: 'Smart Menu',
    price: 99.00,
    allowsDiscount: true
  },
  'smart-tef': {
    id: 'smart-tef',
    name: 'Smart TEF',
    price: 49.90,
    isSpinbox: true,
    allowsDiscount: false
  },
  'suporte-tecnico-chamados': {
    id: 'suporte-tecnico-chamados',
    name: 'Suporte Técnico - Via Chamados',
    price: 0.00,
    allowsDiscount: true
  },
  'suporte-tecnico-chat': {
    id: 'suporte-tecnico-chat',
    name: 'Suporte Técnico - Via Chat',
    price: 0.00,
    allowsDiscount: true
  },
  'suporte-tecnico-estendido': {
    id: 'suporte-tecnico-estendido',
    name: 'Suporte Técnico - Estendido',
    price: 99.00,
    allowsDiscount: true,
    priceByPlan: {
      'bling': 99.00
    }
  },
  'tef': {
    id: 'tef',
    name: 'TEF',
    price: 99.90,
    isSpinbox: true,
    allowsDiscount: false
  },
  'pdvs': {
    id: 'pdvs',
    name: 'PDVs',
    price: 0.00,
    isSpinbox: true,
    allowsDiscount: true
  },
  'usuarios': {
    id: 'usuarios',
    name: 'Usuários',
    price: 0.00,
    isSpinbox: true,
    allowsDiscount: true
  },
  'combo-logistica': {
    id: 'combo-logistica',
    name: 'Combo de Logística',
    price: 0.00,
    allowsDiscount: false
  }
};