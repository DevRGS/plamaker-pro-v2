import { Plan, PlanTemplate } from '@/types/plan';

// Plan base prices and configurations
export const planPrices = {
  'pdv-food': { monthly: 110.00, annual: 99.00 },
  'gestao-food': { monthly: 277.67, annual: 249.00 },
  'performance-food': { monthly: 443.33, annual: 399.00 },
  'autoatendimento-food': { monthly: 332.50, annual: 299.00 },
  'pdv-varejo': { monthly: 110.00, annual: 99.00 },
  'gestao-varejo': { monthly: 277.67, annual: 249.00 },
  'performance-varejo': { monthly: 443.33, annual: 399.00 },
  'autoatendimento-varejo': { monthly: 332.50, annual: 299.00 },
  'bling': { monthly: 210.00, annual: 189.00 }
};

// Spinbox configurations for each plan
export const planSpinboxConfig = {
  'pdv-food': {
    'pdvs': { base: 1, max: 1, readonly: true },
    'usuarios': { base: 2, max: 3, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  },
  'gestao-food': {
    'pdvs': { base: 2, max: 5, readonly: false },
    'usuarios': { base: 3, max: 5, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  },
  'performance-food': {
    'pdvs': { base: 3, max: 8, readonly: false },
    'usuarios': { base: 5, max: 10, readonly: false },
    'smart-tef': { base: 3, max: 99, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  },
  'autoatendimento-food': {
    'usuarios': { base: 1, max: 11, readonly: false },
    'autoatendimento': { base: 1, max: 999, readonly: false },
    'pdvs': { base: 0, max: 99, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false }
  },
  'pdv-varejo': {
    'pdvs': { base: 1, max: 1, readonly: true },
    'usuarios': { base: 2, max: 3, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  },
  'gestao-varejo': {
    'pdvs': { base: 2, max: 5, readonly: false },
    'usuarios': { base: 3, max: 5, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  },
  'performance-varejo': {
    'pdvs': { base: 3, max: 8, readonly: false },
    'usuarios': { base: 5, max: 10, readonly: false },
    'smart-tef': { base: 3, max: 99, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  },
  'autoatendimento-varejo': {
    'usuarios': { base: 1, max: 1, readonly: true },
    'autoatendimento': { base: 1, max: 999, readonly: false },
    'pdvs': { base: 0, max: 99, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false }
  },
  'bling': {
    'pdvs': { base: 1, max: 6, readonly: false },
    'usuarios': { base: 2, max: 7, readonly: false },
    'tef': { base: 0, max: 99, readonly: false },
    'smart-tef': { base: 0, max: 99, readonly: false },
    'autoatendimento': { base: 0, max: 999, readonly: false }
  }
};

export const plans: Record<string, Plan> = {
  'pdv-food': {
    id: 'pdv-food',
    name: 'Plano PDV',
    segment: 'food',
    mandatoryModules: [
      '30-notas-fiscais',
      'controle-mesas',
      'relatorio-basico',
      'suporte-tecnico-chamados'
    ],
    optionalModules: [
      'autoatendimento',
      'cardapio-digital',
      'conciliacao-bancaria',
      'contratos-cartoes',
      'delivery',
      'delivery-direto-profissional',
      'delivery-direto-vip',
      'estoque-grade',
      'hub-delivery',
      'importacao-xml',
      'ordem-servico',
      'smart-menu',
      'tef'
    ]
  },
  'gestao-food': {
    id: 'gestao-food',
    name: 'Plano Gestão',
    segment: 'food',
    mandatoryModules: [
      'controle-mesas',
      'delivery',
      'estoque-grade',
      'financeiro-estoque-relatorios',
      'importacao-xml',
      'notas-fiscais-ilimitadas',
      'painel-senha-tv',
      'producao',
      'relatorio-kds',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'api-dd',
      'app-gestao',
      'atualizacao-tempo-real',
      'backup-realtime',
      'business-intelligence',
      'cardapio-digital',
      'central-telefonica',
      'combo-logistica',
      'conciliacao-bancaria',
      'contratos-cartoes',
      'delivery-direto-basico',
      'delivery-direto-profissional',
      'delivery-direto-vip',
      'dominio-proprio',
      'email-profissional',
      'entrega-facil-ifood',
      'estoque-grade',
      'facilita-nfe',
      'gestao-redes-sociais',
      'hub-delivery',
      'integracao-api',
      'marketing',
      'ordem-servico',
      'painel-senha-mobile',
      'painel-senha-tv',
      'painel-multilojas',
      'producao',
      'promocoes',
      'relatorio-dinamico',
      'relatorio-kds',
      'robo-whatsapp',
      'smart-menu',
      'suporte-tecnico-estendido'
    ]
  },
  'performance-food': {
    id: 'performance-food',
    name: 'Plano Performance',
    segment: 'food',
    mandatoryModules: [
      'app-gestao',
      'atualizacao-tempo-real',
      'conciliacao-bancaria',
      'contratos-cartoes',
      'controle-mesas',
      'delivery',
      'estoque-grade',
      'facilita-nfe',
      'hub-delivery',
      'importacao-xml',
      'marketing',
      'notas-fiscais-ilimitadas',
      'ordem-servico',
      'painel-senha-mobile',
      'painel-senha-tv',
      'producao',
      'promocoes',
      'relatorio-basico',
      'relatorio-dinamico',
      'relatorio-kds',
      'suporte-tecnico-estendido',
      'suporte-tecnico-chamados',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'api-dd',
      'backup-realtime',
      'business-intelligence',
      'cardapio-digital',
      'central-telefonica',
      'combo-logistica',
      'delivery-direto-basico',
      'delivery-direto-profissional',
      'delivery-direto-vip',
      'dominio-proprio',
      'email-profissional',
      'entrega-facil-ifood',
      'gestao-redes-sociais',
      'integracao-api',
      'integracao-tap',
      'painel-multilojas',
      'programa-fidelidade',
      'robo-whatsapp',
      'smart-menu'
    ]
  },
  'autoatendimento-food': {
    id: 'autoatendimento-food',
    name: 'Plano Autoatendimento',
    segment: 'food',
    mandatoryModules: [
      'contratos-cartoes',
      'financeiro-estoque-relatorios',
      'notas-fiscais-ilimitadas',
      'suporte-tecnico-estendido',
      'suporte-tecnico-chamados',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'business-intelligence',
      'estoque-grade',
      'facilita-nfe',
      'importacao-xml',
      'promocoes'
    ]
  },
  'pdv-varejo': {
    id: 'pdv-varejo',
    name: 'Plano PDV',
    segment: 'varejo',
    mandatoryModules: [
      '30-notas-fiscais',
      'estoque-grade',
      'relatorio-basico',
      'suporte-tecnico-chamados'
    ],
    optionalModules: [
      'autoatendimento',
      'conciliacao-bancaria',
      'contratos-cartoes',
      'delivery',
      'delivery-direto-profissional',
      'delivery-direto-vip',
      'hub-delivery',
      'importacao-xml',
      'ordem-servico',
      'smart-menu',
      'tef'
    ]
  },
  'gestao-varejo': {
    id: 'gestao-varejo',
    name: 'Plano Gestão',
    segment: 'varejo',
    mandatoryModules: [
      'contratos-cartoes',
      'estoque-grade',
      'facilita-nfe',
      'financeiro-estoque-relatorios',
      'importacao-xml',
      'notas-fiscais-ilimitadas',
      'promocoes',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'api-dd',
      'app-gestao',
      'atualizacao-tempo-real',
      'backup-realtime',
      'business-intelligence',
      'cardapio-digital',
      'central-telefonica',
      'combo-logistica',
      'conciliacao-bancaria',
      'controle-mesas',
      'delivery',
      'delivery-direto-basico',
      'delivery-direto-profissional',
      'delivery-direto-vip',
      'dominio-proprio',
      'email-profissional',
      'entrega-facil-ifood',
      'facilita-nfe',
      'gestao-redes-sociais',
      'hub-delivery',
      'integracao-api',
      'marketing',
      'ordem-servico',
      'painel-senha-mobile',
      'painel-senha-tv',
      'painel-multilojas',
      'producao',
      'relatorio-dinamico',
      'relatorio-kds',
      'robo-whatsapp',
      'smart-menu',
      'suporte-tecnico-estendido'
    ]
  },
  'performance-varejo': {
    id: 'performance-varejo',
    name: 'Plano Performance',
    segment: 'varejo',
    mandatoryModules: [
      'app-gestao',
      'atualizacao-tempo-real',
      'conciliacao-bancaria',
      'contratos-cartoes',
      'controle-mesas',
      'delivery',
      'estoque-grade',
      'facilita-nfe',
      'importacao-xml',
      'marketing',
      'notas-fiscais-ilimitadas',
      'ordem-servico',
      'painel-senha-mobile',
      'painel-senha-tv',
      'producao',
      'promocoes',
      'relatorio-dinamico',
      'relatorios-financeiro-estoque',
      'suporte-tecnico-estendido',
      'suporte-tecnico-chamados',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'api-dd',
      'backup-realtime',
      'business-intelligence',
      'cardapio-digital',
      'central-telefonica',
      'combo-logistica',
      'delivery-direto-basico',
      'delivery-direto-profissional',
      'delivery-direto-vip',
      'dominio-proprio',
      'email-profissional',
      'entrega-facil-ifood',
      'gestao-redes-sociais',
      'hub-delivery',
      'integracao-api',
      'integracao-tap',
      'painel-senhas',
      'painel-multilojas',
      'programa-fidelidade',
      'relatorio-kds',
      'robo-whatsapp',
      'smart-menu'
    ]
  },
  'autoatendimento-varejo': {
    id: 'autoatendimento-varejo',
    name: 'Plano Autoatendimento',
    segment: 'varejo',
    mandatoryModules: [
      'contratos-cartoes',
      'financeiro-estoque-relatorios',
      'notas-fiscais-ilimitadas',
      'suporte-tecnico-estendido',
      'suporte-tecnico-chamados',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'business-intelligence',
      'estoque-grade',
      'facilita-nfe',
      'importacao-xml',
      'promocoes'
    ]
  },
  'bling': {
    id: 'bling',
    name: 'Plano Bling',
    segment: 'common',
    mandatoryModules: [
      'estoque-grade',
      'financeiro-estoque-relatorios',
      'notas-fiscais-ilimitadas',
      'suporte-tecnico-chamados',
      'suporte-tecnico-chat'
    ],
    optionalModules: [
      'contratos-cartoes',
      'controle-mesas',
      'delivery',
      'suporte-tecnico-estendido'
    ]
  }
};

export const planTemplates: Record<string, PlanTemplate> = {
  'loja-roupa': {
    id: 'loja-roupa',
    name: 'Loja de Roupa',
    description: 'Configuração ideal para lojas de vestuário e moda',
    planId: 'gestao-varejo',
    segment: 'varejo',
    preSelectedModules: {
      'estoque-grade': 1,
      'promocoes': 1,
      'marketing': 1,
      'facilita-nfe': 1,
      'pdvs': 2,
      'usuarios': 3
    }
  },
  'restaurante': {
    id: 'restaurante',
    name: 'Restaurante',
    description: 'Configuração completa para restaurantes e lanchonetes',
    planId: 'gestao-food',
    segment: 'food',
    preSelectedModules: {
      'controle-mesas': 1,
      'delivery': 1,
      'cardapio-digital': 1,
      'producao': 1,
      'pdvs': 3,
      'usuarios': 5
    }
  },
  'lanchonete': {
    id: 'lanchonete',
    name: 'Lanchonete',
    description: 'Ideal para lanchonetes e fast food',
    planId: 'pdv-food',
    segment: 'food',
    preSelectedModules: {
      'delivery': 1,
      'cardapio-digital': 1,
      'pdvs': 2,
      'usuarios': 3
    }
  },
  'farmacia': {
    id: 'farmacia',
    name: 'Farmácia',
    description: 'Configuração específica para farmácias',
    planId: 'gestao-varejo',
    segment: 'varejo',
    preSelectedModules: {
      'estoque-grade': 1,
      'facilita-nfe': 1,
      'relatorio-dinamico': 1,
      'pdvs': 2,
      'usuarios': 4
    }
  },
  'mercado': {
    id: 'mercado',
    name: 'Mercado/Supermercado',
    description: 'Solução completa para mercados e supermercados',
    planId: 'performance-varejo',
    segment: 'varejo',
    preSelectedModules: {
      'estoque-grade': 1,
      'marketing': 1,
      'promocoes': 1,
      'relatorio-dinamico': 1,
      'pdvs': 5,
      'usuarios': 8
    }
  }
};