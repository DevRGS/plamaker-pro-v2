import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { modules } from '@/data/modules';
import { plans } from '@/data/plans';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, BarChart3, DollarSign, Save, Eye, Plus, Trash2, X, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminSettings {
  annualDiscount: number;
  planPrices: Record<string, { monthly: number; annual: number }>;
  moduleDiscountRules: Record<string, boolean>;
  planClicks: Record<string, number>;
  moduleHelpLinks: Record<string, string>;
  planLimits: Record<string, {
    mandatoryModules: string[];
    optionalModules: string[];
  }>;
  businessTemplates: Record<string, {
    name: string;
    description: string;
    planId: string;
    segment: 'food' | 'varejo';
    preSelectedModules: Record<string, number>;
  }>;
  spinboxLimits: Record<string, Record<string, { base: number; max: number; readonly: boolean }>>;
  planModuleConfig: Record<string, {
    mandatoryModules: string[];
    optionalModules: string[];
  }>;
  customModules: Record<string, {
    id: string;
    name: string;
    description: string;
    price: number;
    allowsDiscount: boolean;
    isSpinbox: boolean;
    availablePlans: string[];
  }>;
}

export const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  
  // Estado inicial dos dados administrativos
  const [settings, setSettings] = useState<AdminSettings>({
    annualDiscount: 10,
    planPrices: {
      'pdv-food': { monthly: 110.00, annual: 99.00 },
      'gestao-food': { monthly: 277.67, annual: 249.00 },
      'performance-food': { monthly: 443.33, annual: 399.00 },
      'autoatendimento-food': { monthly: 332.50, annual: 299.00 },
      'pdv-varejo': { monthly: 110.00, annual: 99.00 },
      'gestao-varejo': { monthly: 277.67, annual: 249.00 },
      'performance-varejo': { monthly: 443.33, annual: 399.00 },
      'autoatendimento-varejo': { monthly: 332.50, annual: 299.00 },
      'bling': { monthly: 210.00, annual: 189.00 }
    },
    moduleDiscountRules: {},
    planClicks: {
      'pdv-food': 45,
      'gestao-food': 78,
      'performance-food': 34,
      'autoatendimento-food': 12,
      'pdv-varejo': 56,
      'gestao-varejo': 89,
      'performance-varejo': 67,
      'autoatendimento-varejo': 23,
      'bling': 31
    },
    moduleHelpLinks: {},
    planLimits: {
      'pdv': { mandatoryModules: [], optionalModules: [] },
      'gestao': { mandatoryModules: [], optionalModules: [] },
      'performance': { mandatoryModules: [], optionalModules: [] },
      'autoatendimento': { mandatoryModules: [], optionalModules: [] },
      'bling': { mandatoryModules: [], optionalModules: [] }
    },
    businessTemplates: {
      'loja-roupa': {
        name: 'Loja de Roupa',
        description: 'Configuração ideal para lojas de vestuário e moda',
        planId: 'gestao-varejo',
        segment: 'varejo',
        preSelectedModules: { 'promocoes': 1, 'marketing': 1 }
      }
    },
    spinboxLimits: {
      'pdv-food': { 'pdvs': { base: 1, max: 1, readonly: true }, 'usuarios': { base: 2, max: 3, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } },
      'gestao-food': { 'pdvs': { base: 2, max: 5, readonly: false }, 'usuarios': { base: 3, max: 5, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } },
      'performance-food': { 'pdvs': { base: 3, max: 8, readonly: false }, 'usuarios': { base: 5, max: 10, readonly: false }, 'smart-tef': { base: 3, max: 99, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } },
      'autoatendimento-food': { 'usuarios': { base: 1, max: 11, readonly: false }, 'autoatendimento': { base: 1, max: 999, readonly: false }, 'pdvs': { base: 0, max: 99, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false } },
      'pdv-varejo': { 'pdvs': { base: 1, max: 1, readonly: true }, 'usuarios': { base: 2, max: 3, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } },
      'gestao-varejo': { 'pdvs': { base: 2, max: 5, readonly: false }, 'usuarios': { base: 3, max: 5, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } },
      'performance-varejo': { 'pdvs': { base: 3, max: 8, readonly: false }, 'usuarios': { base: 5, max: 10, readonly: false }, 'smart-tef': { base: 3, max: 99, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } },
      'autoatendimento-varejo': { 'usuarios': { base: 1, max: 1, readonly: true }, 'autoatendimento': { base: 1, max: 999, readonly: false }, 'pdvs': { base: 0, max: 99, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false } },
      'bling': { 'pdvs': { base: 1, max: 6, readonly: false }, 'usuarios': { base: 2, max: 7, readonly: false }, 'tef': { base: 0, max: 99, readonly: false }, 'smart-tef': { base: 0, max: 99, readonly: false }, 'autoatendimento': { base: 0, max: 999, readonly: false } }
    },
    planModuleConfig: {
      'pdv-food': { mandatoryModules: ['30-notas-fiscais', 'controle-mesas', 'relatorio-basico', 'suporte-tecnico-chamados'], optionalModules: ['autoatendimento', 'cardapio-digital', 'conciliacao-bancaria', 'contratos-cartoes', 'delivery', 'delivery-direto-profissional', 'delivery-direto-basico', 'fidelidade', 'marketing', 'promocoes', 'relatorio-avancado', 'suporte-tecnico-prioritario'] },
      'gestao-food': { mandatoryModules: ['30-notas-fiscais', 'controle-mesas', 'relatorio-basico', 'relatorio-avancado', 'suporte-tecnico-chamados', 'suporte-tecnico-prioritario'], optionalModules: ['autoatendimento', 'backup-realtime', 'business-intelligence', 'cardapio-digital', 'central-telefonica', 'conciliacao-bancaria', 'contratos-cartoes', 'delivery', 'delivery-direto-profissional', 'delivery-direto-basico', 'fidelidade', 'marketing', 'promocoes'] },
      'performance-food': { mandatoryModules: ['30-notas-fiscais', 'atualizacao-tempo-real', 'backup-realtime', 'business-intelligence', 'controle-mesas', 'relatorio-basico', 'relatorio-avancado', 'suporte-tecnico-chamados', 'suporte-tecnico-prioritario'], optionalModules: ['autoatendimento', 'cardapio-digital', 'central-telefonica', 'conciliacao-bancaria', 'contratos-cartoes', 'delivery', 'delivery-direto-profissional', 'delivery-direto-basico', 'fidelidade', 'marketing', 'promocoes'] },
      'autoatendimento-food': { mandatoryModules: ['autoatendimento', 'relatorio-basico', 'suporte-tecnico-chamados'], optionalModules: ['cardapio-digital', 'conciliacao-bancaria', 'contratos-cartoes', 'delivery', 'delivery-direto-profissional', 'delivery-direto-basico', 'fidelidade', 'marketing', 'promocoes', 'relatorio-avancado', 'suporte-tecnico-prioritario'] },
      'pdv-varejo': { mandatoryModules: ['30-notas-fiscais', 'relatorio-basico', 'suporte-tecnico-chamados'], optionalModules: ['autoatendimento', 'conciliacao-bancaria', 'contratos-cartoes', 'fidelidade', 'marketing', 'promocoes', 'relatorio-avancado', 'suporte-tecnico-prioritario'] },
      'gestao-varejo': { mandatoryModules: ['30-notas-fiscais', 'relatorio-basico', 'relatorio-avancado', 'suporte-tecnico-chamados', 'suporte-tecnico-prioritario'], optionalModules: ['autoatendimento', 'backup-realtime', 'business-intelligence', 'central-telefonica', 'conciliacao-bancaria', 'contratos-cartoes', 'fidelidade', 'marketing', 'promocoes'] },
      'performance-varejo': { mandatoryModules: ['30-notas-fiscais', 'atualizacao-tempo-real', 'backup-realtime', 'business-intelligence', 'relatorio-basico', 'relatorio-avancado', 'suporte-tecnico-chamados', 'suporte-tecnico-prioritario'], optionalModules: ['autoatendimento', 'central-telefonica', 'conciliacao-bancaria', 'contratos-cartoes', 'fidelidade', 'marketing', 'promocoes'] },
      'autoatendimento-varejo': { mandatoryModules: ['autoatendimento', 'relatorio-basico', 'suporte-tecnico-chamados'], optionalModules: ['conciliacao-bancaria', 'contratos-cartoes', 'fidelidade', 'marketing', 'promocoes', 'relatorio-avancado', 'suporte-tecnico-prioritario'] },
      'bling': { mandatoryModules: ['30-notas-fiscais', 'relatorio-basico', 'suporte-tecnico-chamados'], optionalModules: ['autoatendimento', 'conciliacao-bancaria', 'contratos-cartoes', 'delivery', 'fidelidade', 'marketing', 'promocoes', 'relatorio-avancado', 'suporte-tecnico-prioritario'] }
    },
    customModules: {}
  });

  const [moduleEditingPrices, setModuleEditingPrices] = useState<Record<string, Record<string, number>>>({});
  const [selectedModuleForPricing, setSelectedModuleForPricing] = useState<string>('');
  const [selectedTemplateForEdit, setSelectedTemplateForEdit] = useState<string>('');
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [selectedPlanForModuleConfig, setSelectedPlanForModuleConfig] = useState<string>('');
  const [dashboardStats, setDashboardStats] = useState<Record<string, any>>({});
  const [newCustomModule, setNewCustomModule] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    allowsDiscount: true,
    isSpinbox: false,
    availablePlans: [] as string[]
  });
  const [editingCustomModule, setEditingCustomModule] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Array<{
    id: string;
    name: string;
    planId: string;
    planType: 'monthly' | 'annual';
    value: number;
    createdAt: string;
  }>>([]);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    planId: '',
    planType: 'monthly' as 'monthly' | 'annual',
    value: 0
  });
  const [showNewVendedorModal, setShowNewVendedorModal] = useState(false);
  const [newVendedor, setNewVendedor] = useState({
    name: '',
    email: '',
    whatsappNumber: ''
  });
  const [vendedores, setVendedores] = useState<Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    isactive: boolean;
    createdat: string;
    updatedat: string;
    whatsappnumber: string;
  }>>([]);
  const [dateFilter, setDateFilter] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Primeiro dia do mês atual
    endDate: new Date().toISOString().split('T')[0] // Hoje
  });
  const [planClicksWithDate, setPlanClicksWithDate] = useState<Array<{
    planId: string;
    timestamp: string;
  }>>([]);
  const [newTemplateDescription, setNewTemplateDescription] = useState<string>('');
  const [newTemplatePlan, setNewTemplatePlan] = useState<string>('');
  const [newTemplateSegment, setNewTemplateSegment] = useState<'food' | 'varejo'>('food');
  const [newTemplateModules, setNewTemplateModules] = useState<Record<string, number>>({});


  const handleSaveSettings = () => {
    // Aqui você salvaria as configurações no backend
    toast({
      title: "Configurações salvas!",
      description: "Todas as alterações foram aplicadas com sucesso.",
    });
  };

  const handleModulePriceChange = (moduleId: string, planId: string, price: number) => {
    if (isNaN(price) || price === null) return;
    setModuleEditingPrices(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [planId]: price
      }
    }));
    toast({
      title: 'Preço atualizado',
      description: `Preço do módulo atualizado para R$ ${price.toFixed(2)}`
    });
  };

  const handleModuleConfigChange = (planId: string, moduleId: string, isMandatory: boolean, isChecked: boolean) => {
    setSettings(prev => {
      const currentConfig = prev.planModuleConfig[planId] || { mandatoryModules: [], optionalModules: [] };
      
      if (isChecked) {
        // Adicionar módulo
        if (isMandatory) {
          const newMandatory = [...currentConfig.mandatoryModules, moduleId];
          const newOptional = currentConfig.optionalModules.filter(id => id !== moduleId);
          return {
            ...prev,
            planModuleConfig: {
              ...prev.planModuleConfig,
              [planId]: {
                mandatoryModules: newMandatory,
                optionalModules: newOptional
              }
            }
          };
        } else {
          const newOptional = [...currentConfig.optionalModules, moduleId];
          const newMandatory = currentConfig.mandatoryModules.filter(id => id !== moduleId);
          return {
            ...prev,
            planModuleConfig: {
              ...prev.planModuleConfig,
              [planId]: {
                mandatoryModules: newMandatory,
                optionalModules: newOptional
              }
            }
          };
        }
      } else {
        // Remover módulo
        const newMandatory = currentConfig.mandatoryModules.filter(id => id !== moduleId);
        const newOptional = currentConfig.optionalModules.filter(id => id !== moduleId);
        return {
          ...prev,
          planModuleConfig: {
            ...prev.planModuleConfig,
            [planId]: {
              mandatoryModules: newMandatory,
              optionalModules: newOptional
            }
          }
        };
      }
    });
  };

  const handleDiscountRuleToggle = (moduleId: string, allowDiscount: boolean) => {
    setSettings(prev => ({
      ...prev,
      moduleDiscountRules: {
        ...prev.moduleDiscountRules,
        [moduleId]: allowDiscount
      }
    }));
  };

  // 1. Persistência dos links de ajuda dos módulos
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'moduleHelpLinks')
        .single();
      if (data && data.setting_value) {
        setSettings(prev => ({
          ...prev,
          moduleHelpLinks: data.setting_value as Record<string, string>
        }));
      }
    })();
  }, []);

  // Salvar moduleHelpLinks no localStorage sempre que mudar
  useEffect(() => {
    (async () => {
      await supabase.from('admin_settings').upsert({
        setting_key: 'moduleHelpLinks',
        setting_value: settings.moduleHelpLinks
      }, { onConflict: 'setting_key' });
    })();
  }, [settings.moduleHelpLinks]);

  // Carregar preços dos módulos por plano da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'modulePlanPrices')
        .single();
      if (data && data.setting_value) {
        setModuleEditingPrices(data.setting_value as Record<string, Record<string, number>>);
      }
    })();
  }, []);

  // Salvar preços dos módulos por plano na Supabase sempre que mudar
  useEffect(() => {
    (async () => {
      await supabase.from('admin_settings').upsert({
        setting_key: 'modulePlanPrices',
        setting_value: moduleEditingPrices
      }, { onConflict: 'setting_key' });
    })();
  }, [moduleEditingPrices]);

  // Carregar configuração de módulos por plano da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planModuleConfig')
        .single();
      if (data && data.setting_value) {
        setSettings(prev => ({
          ...prev,
          planModuleConfig: data.setting_value as Record<string, { mandatoryModules: string[]; optionalModules: string[] }>
        }));
      }
    })();
  }, []);

  // Salvar configuração de módulos por plano na Supabase sempre que mudar
  useEffect(() => {
    (async () => {
      await supabase.from('admin_settings').upsert({
        setting_key: 'planModuleConfig',
        setting_value: settings.planModuleConfig
      }, { onConflict: 'setting_key' });
    })();
  }, [settings.planModuleConfig]);

  // Carregar configuração de spinbox da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'spinboxLimits')
        .single();
      if (data && data.setting_value) {
        setSettings(prev => ({
          ...prev,
          spinboxLimits: data.setting_value as Record<string, Record<string, { base: number; max: number; readonly: boolean }>>
        }));
      }
    })();
  }, []);

  // Salvar configuração de spinbox na Supabase sempre que mudar
  useEffect(() => {
    (async () => {
      await supabase.from('admin_settings').upsert({
        setting_key: 'spinboxLimits',
        setting_value: settings.spinboxLimits
      }, { onConflict: 'setting_key' });
    })();
  }, [settings.spinboxLimits]);

  // Carregar vendedores da Supabase
  useEffect(() => {
    (async () => {
      try {
        console.log('🔍 Carregando vendedores da tabela sellers...');
        
        const { data, error } = await supabase
          .from('sellers')
          .select('*')
          .order('createdat', { ascending: false });
        
        if (error) {
          console.error('❌ Erro ao carregar vendedores:', error);
          return;
        }
        
        if (data) {
          console.log('✅ Vendedores carregados:', data.length);
          setVendedores(data);
        }
      } catch (error) {
        console.error('❌ Erro ao carregar vendedores:', error);
      }
    })();
  }, []);
        setting_value: settings.spinboxLimits
      }, { onConflict: 'setting_key' });
    })();
  }, [settings.spinboxLimits]);



  // Carregar cliques reais dos planos
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planClicks')
        .single();
      
      if (error) {
        console.error('Erro ao carregar cliques:', error);
      } else if (data && data.setting_value) {
        console.log('Cliques carregados:', data.setting_value);
        setSettings(prev => ({
          ...prev,
          planClicks: data.setting_value as Record<string, number>
        }));
      } else {
        console.log('Nenhum clique encontrado');
      }
    })();
  }, []);



  // Carregar clientes
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'customers')
        .single();
      
      if (error) {
        console.error('Erro ao carregar clientes:', error);
      } else if (data && data.setting_value) {
        console.log('Clientes carregados:', data.setting_value);
        setCustomers(data.setting_value);
      } else {
        console.log('Nenhum cliente encontrado');
      }
    })();
  }, []);

  // Salvar clientes
  useEffect(() => {
    if (customers.length > 0) {
      (async () => {
        const { error } = await supabase.from('admin_settings').upsert({
          setting_key: 'customers',
          setting_value: customers
        }, { onConflict: 'setting_key' });
        
        if (error) {
          console.error('Erro ao salvar clientes:', error);
        }
      })();
    }
  }, [customers]);

  // Carregar cliques com data
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planClicksWithDate')
        .single();
      
      if (error) {
        console.error('Erro ao carregar cliques com data:', error);
      } else if (data && data.setting_value) {
        console.log('Cliques com data carregados:', data.setting_value);
        setPlanClicksWithDate(data.setting_value);
      } else {
        console.log('Nenhum clique com data encontrado');
      }
    })();
  }, []);

  // Salvar cliques com data
  useEffect(() => {
    if (planClicksWithDate.length > 0) {
      (async () => {
        const { error } = await supabase.from('admin_settings').upsert({
          setting_key: 'planClicksWithDate',
          setting_value: planClicksWithDate
        }, { onConflict: 'setting_key' });
        
        if (error) {
          console.error('Erro ao salvar cliques com data:', error);
        }
      })();
    }
  }, [planClicksWithDate]);

  // Atualizar dados do dashboard a cada minuto
  useEffect(() => {
    const interval = setInterval(async () => {
      // Atualizar cliques
      const { data: clicksData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planClicks')
        .single();
      if (clicksData && clicksData.setting_value) {
        setSettings(prev => ({
          ...prev,
          planClicks: clicksData.setting_value as Record<string, number>
        }));
      }

      // Atualizar cliques com data
      const { data: clicksWithDateData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planClicksWithDate')
        .single();
      if (clicksWithDateData && clicksWithDateData.setting_value) {
        setPlanClicksWithDate(clicksWithDateData.setting_value);
      }

      // Atualizar clientes
      const { data: customersData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'customers')
        .single();
      if (customersData && customersData.setting_value) {
        setCustomers(customersData.setting_value);
      }

      console.log('Dashboard atualizado:', new Date().toLocaleTimeString());
    }, 10000); // 10 segundos para atualização mais frequente

    return () => clearInterval(interval);
  }, []);

  // Carregar templates de negócio da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'businessTemplates')
        .single();
      if (data && data.setting_value) {
        setSettings(prev => ({
          ...prev,
          businessTemplates: data.setting_value as Record<string, {
            name: string;
            description: string;
            planId: string;
            segment: 'food' | 'varejo';
            preSelectedModules: Record<string, number>;
          }>
        }));
      }
    })();
  }, []);

  // Salvar templates de negócio na Supabase sempre que mudar
  useEffect(() => {
    (async () => {
      await supabase.from('admin_settings').upsert({
        setting_key: 'businessTemplates',
        setting_value: settings.businessTemplates
      }, { onConflict: 'setting_key' });
    })();
  }, [settings.businessTemplates]);

  // Carregar módulos customizados da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'customModules')
        .single();
      if (data && data.setting_value) {
        setSettings(prev => ({
          ...prev,
          customModules: data.setting_value as Record<string, {
            id: string;
            name: string;
            description: string;
            price: number;
            allowsDiscount: boolean;
            isSpinbox: boolean;
            availablePlans: string[];
          }>
        }));
      }
    })();
  }, []);

  // Salvar módulos customizados na Supabase sempre que mudar
  useEffect(() => {
    (async () => {
      await supabase.from('admin_settings').upsert({
        setting_key: 'customModules',
        setting_value: settings.customModules
      }, { onConflict: 'setting_key' });
    })();
  }, [settings.customModules]);

  const planList = Object.values(plans);
  const moduleList = Object.values(modules);

  const handleCreateCustomModule = () => {
    if (!newCustomModule.id || !newCustomModule.name) {
      toast({
        title: "Erro",
        description: "ID e Nome são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setSettings(prev => ({
      ...prev,
      customModules: {
        ...prev.customModules,
        [newCustomModule.id]: { ...newCustomModule }
      }
    }));

    setNewCustomModule({
      id: '',
      name: '',
      description: '',
      price: 0,
      allowsDiscount: true,
      isSpinbox: false,
      availablePlans: []
    });

    toast({
      title: "Módulo criado!",
      description: "Módulo customizado criado com sucesso."
    });
  };

  const handleUpdateCustomModule = (moduleId: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      customModules: {
        ...prev.customModules,
        [moduleId]: { ...prev.customModules[moduleId], ...updates }
      }
    }));
  };

  const handleDeleteCustomModule = (moduleId: string) => {
    setSettings(prev => {
      const newCustomModules = { ...prev.customModules };
      delete newCustomModules[moduleId];
      return { ...prev, customModules: newCustomModules };
    });

    toast({
      title: "Módulo excluído!",
      description: "Módulo customizado excluído com sucesso."
    });
  };

  const handleUpdateSystemModule = (moduleId: string, updates: any) => {
    setSettings(prev => ({
      ...prev,
      customModules: {
        ...prev.customModules,
        [moduleId]: {
          ...prev.customModules[moduleId],
          ...updates
        }
      }
    }));
  };

  const handleDeleteSystemModule = (moduleId: string) => {
    // Remover de todas as configurações de planos
    setSettings(prev => {
      const newSettings = { ...prev };
      
      // Remover de planModuleConfig
      Object.keys(newSettings.planModuleConfig).forEach(planId => {
        newSettings.planModuleConfig[planId] = {
          mandatoryModules: newSettings.planModuleConfig[planId].mandatoryModules.filter(id => id !== moduleId),
          optionalModules: newSettings.planModuleConfig[planId].optionalModules.filter(id => id !== moduleId)
        };
      });

      // Remover de spinboxLimits
      Object.keys(newSettings.spinboxLimits).forEach(planId => {
        if (newSettings.spinboxLimits[planId][moduleId]) {
          delete newSettings.spinboxLimits[planId][moduleId];
        }
      });

      // Remover de businessTemplates
      Object.keys(newSettings.businessTemplates).forEach(templateId => {
        if (newSettings.businessTemplates[templateId].preSelectedModules[moduleId]) {
          delete newSettings.businessTemplates[templateId].preSelectedModules[moduleId];
        }
      });

      // Remover de customModules
      if (newSettings.customModules[moduleId]) {
        delete newSettings.customModules[moduleId];
      }

      return newSettings;
    });

    toast({
      title: "Módulo excluído!",
      description: "Módulo excluído de todas as configurações do sistema."
    });
  };

  // Funções para calcular métricas dos clientes
  const calculateCustomerMetrics = () => {
    // Filtrar clientes por data
    const filteredCustomers = customers.filter(customer => {
      const customerDate = new Date(customer.createdAt);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Incluir o dia inteiro
      
      return customerDate >= startDate && customerDate <= endDate;
    });

    const totalCustomers = filteredCustomers.length;
    const totalRevenueValue = filteredCustomers.reduce((sum, customer) => sum + customer.value, 0);
    const averageRevenue = totalCustomers > 0 ? totalRevenueValue / totalCustomers : 0;
    
    // Calcular planos com mais clientes
    const planCounts = filteredCustomers.reduce((acc, customer) => {
      acc[customer.planId] = (acc[customer.planId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularPlan = Object.entries(planCounts).sort(([,a], [,b]) => b - a)[0];
    
    // Calcular taxa de conversão por plano
    const planConversionRates = Object.entries(plans).map(([planId, plan]) => {
      const planCustomers = filteredCustomers.filter(c => c.planId === planId).length;
      const planClicks = calculateFilteredClicks().clicksByPlan[planId] || 0;
      const conversionRate = planClicks > 0 ? (planCustomers / planClicks) * 100 : 0;
      return { planId, planName: plan.name, conversionRate, customers: planCustomers, clicks: planClicks };
    });
    
    // Calcular receita média por plano
    const planAverageRevenue = Object.entries(plans).map(([planId, plan]) => {
      const planCustomers = filteredCustomers.filter(c => c.planId === planId);
      const planRevenue = planCustomers.reduce((sum, c) => sum + c.value, 0);
      const averageRevenue = planCustomers.length > 0 ? planRevenue / planCustomers.length : 0;
      return { planId, planName: plan.name, averageRevenue, customers: planCustomers.length };
    });
    
    return {
      totalCustomers,
      totalRevenue: totalRevenueValue,
      averageRevenue,
      mostPopularPlan: mostPopularPlan ? { planId: mostPopularPlan[0], count: mostPopularPlan[1] } : null,
      planConversionRates,
      planAverageRevenue,
      filteredCustomers
    };
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.planId || newCustomer.value <= 0) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    const customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      planId: newCustomer.planId,
      planType: newCustomer.planType,
      value: newCustomer.value,
      createdAt: new Date().toISOString()
    };
    
    setCustomers(prev => [...prev, customer]);
    setNewCustomer({
      name: '',
      planId: '',
      planType: 'monthly',
      value: 0
    });
    setShowNewCustomerModal(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const handleAddVendedor = async () => {
    if (!newVendedor.name || !newVendedor.email || !newVendedor.whatsappNumber) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('📝 Criando novo vendedor:', newVendedor);
      
      // Gerar ID único baseado no timestamp
      const newId = Date.now().toString();
      
              const { data, error } = await supabase
          .from('sellers')
          .insert([{
            id: newId,
            name: newVendedor.name,
            email: newVendedor.email,
            phone: newVendedor.whatsappNumber,
            whatsappnumber: newVendedor.whatsappNumber,
            isactive: true
          }])
          .select()
          .single();
      
      if (error) {
        console.error('❌ Erro ao criar vendedor:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar vendedor: " + error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ Vendedor criado:', data);
      setVendedores(prev => [data, ...prev]);
      setNewVendedor({ name: '', email: '', whatsappNumber: '' });
      setShowNewVendedorModal(false);
      
      toast({
        title: "Sucesso",
        description: "Vendedor criado com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro ao criar vendedor:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar vendedor.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVendedor = async (vendedorId: string) => {
    try {
      console.log('🗑️ Deletando vendedor:', vendedorId);
      
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id', vendedorId);
      
      if (error) {
        console.error('❌ Erro ao deletar vendedor:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar vendedor: " + error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('✅ Vendedor deletado com sucesso');
      setVendedores(prev => prev.filter(v => v.id !== vendedorId));
      
      toast({
        title: "Sucesso",
        description: "Vendedor deletado com sucesso!",
      });
    } catch (error) {
      console.error('❌ Erro ao deletar vendedor:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar vendedor.",
        variant: "destructive"
      });
    }
  };

  const generateVendedorLink = (vendedorId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#/plans?seller=${vendedorId}`;
  };

  // Função para calcular cliques filtrados por data
  const calculateFilteredClicks = () => {
    const filteredClicks = planClicksWithDate.filter(click => {
      const clickDate = new Date(click.timestamp);
      const startDate = new Date(dateFilter.startDate + 'T00:00:00.000Z');
      const endDate = new Date(dateFilter.endDate + 'T23:59:59.999Z');
      
      return clickDate >= startDate && clickDate <= endDate;
    });

    // Agrupar cliques por plano
    const clicksByPlan = filteredClicks.reduce((acc, click) => {
      acc[click.planId] = (acc[click.planId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClicks: filteredClicks.length,
      clicksByPlan
    };
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-lg text-muted-foreground">
            Gerencie preços, configurações e analise performance dos planos
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-primary to-primary-glow">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="plan-templates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Preços
          </TabsTrigger>
          <TabsTrigger value="business-templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates Negócio
          </TabsTrigger>
          <TabsTrigger value="module-help" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Links Módulos
          </TabsTrigger>
          <TabsTrigger value="module-plan-prices" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Preço módulo plano
          </TabsTrigger>
          <TabsTrigger value="plan-limits" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Limites Planos
          </TabsTrigger>
          <TabsTrigger value="custom-modules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Módulos Custom
          </TabsTrigger>
          <TabsTrigger value="vendedores" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vendedores
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {/* Filtro de Datas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filtro de Período</CardTitle>
              <CardDescription>
                Selecione o período para filtrar os dados do dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Data Inicial</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Data Final</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateFilter({
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  })}
                >
                  Este Mês
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateFilter({
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
                    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0]
                  })}
                >
                  Mês Passado
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateFilter({
                    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  })}
                >
                  Este Ano
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDateFilter({
                    startDate: '2020-01-01',
                    endDate: new Date().toISOString().split('T')[0]
                  })}
                >
                  Todos
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateFilteredClicks().totalClicks.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Período: {new Date(dateFilter.startDate).toLocaleDateString('pt-BR')} a {new Date(dateFilter.endDate).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {calculateCustomerMetrics().totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Receita acumulada
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Média</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {calculateCustomerMetrics().averageRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Receita média por cliente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateCustomerMetrics().totalCustomers}
                </div>
                <p className="text-xs text-muted-foreground">
                  Clientes cadastrados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {calculateCustomerMetrics().totalCustomers > 0 && calculateFilteredClicks().totalClicks > 0 ? 
                    ((calculateCustomerMetrics().totalCustomers / calculateFilteredClicks().totalClicks) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-xs text-muted-foreground">
                  taxa de conversão
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cliques por Plano</CardTitle>
                <CardDescription>
                  Dados reais dos cliques em cada plano (atualizado automaticamente)
                </CardDescription>
              </div>
              <Button onClick={() => setShowNewCustomerModal(true)} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </CardHeader>
            <CardContent>
              {Object.entries(calculateFilteredClicks().clicksByPlan).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(calculateFilteredClicks().clicksByPlan)
                    .sort(([,a], [,b]) => b - a) // Ordenar por cliques (maior para menor)
                    .map(([planId, clicks]) => {
                      const plan = plans[planId];
                      if (!plan) return null;
                      
                      return (
                        <div key={planId} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{plan.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {plan.segment === 'food' ? 'Food Service' : plan.segment === 'varejo' ? 'Varejo' : 'Comum'}
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              {clicks.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-lg font-medium mb-2">
                    {Object.values(settings.planClicks).reduce((a, b) => a + b, 0) > 0 ? 'Nenhum clique no período selecionado' : 'Nenhum clique registrado ainda'}
                  </div>
                  <div className="text-sm">
                    {Object.values(settings.planClicks).reduce((a, b) => a + b, 0) > 0 
                      ? 'Tente ajustar o filtro de datas ou aguarde novos cliques'
                      : 'Os cliques serão registrados automaticamente quando os clientes selecionarem planos'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Métricas Detalhadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão por Plano</CardTitle>
                <CardDescription>
                  Conversão baseada em clientes reais vs cliques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calculateCustomerMetrics().planConversionRates
                    .filter(plan => plan.clicks > 0 || plan.customers > 0)
                    .map(plan => (
                      <div key={plan.planId} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{plan.planName}</div>
                          <div className="text-sm text-muted-foreground">
                            {plan.customers} clientes / {plan.clicks} cliques
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {plan.conversionRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita Média por Plano</CardTitle>
                <CardDescription>
                  Valor médio por cliente em cada plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {calculateCustomerMetrics().planAverageRevenue
                    .filter(plan => plan.customers > 0)
                    .map(plan => (
                      <div key={plan.planId} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{plan.planName}</div>
                          <div className="text-sm text-muted-foreground">
                            {plan.customers} cliente{plan.customers > 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            R$ {plan.averageRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plano com Mais Clientes */}
          {calculateCustomerMetrics().mostPopularPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Plano Mais Popular</CardTitle>
                <CardDescription>
                  Plano com maior número de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div>
                    <div className="text-lg font-bold text-blue-900">
                      {plans[calculateCustomerMetrics().mostPopularPlan!.planId]?.name}
                    </div>
                    <div className="text-sm text-blue-700">
                      {calculateCustomerMetrics().mostPopularPlan!.count} cliente{calculateCustomerMetrics().mostPopularPlan!.count > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    🏆
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes Cadastrados</CardTitle>
              <CardDescription>
                Lista de clientes no período selecionado ({new Date(dateFilter.startDate).toLocaleDateString('pt-BR')} a {new Date(dateFilter.endDate).toLocaleDateString('pt-BR')})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {calculateCustomerMetrics().filteredCustomers.length > 0 ? (
                <div className="space-y-3">
                  {calculateCustomerMetrics().filteredCustomers.map(customer => (
                    <div key={customer.id} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {plans[customer.planId]?.name} - {customer.planType === 'monthly' ? 'Mensal' : 'Anual'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            R$ {customer.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-lg font-medium mb-2">
                    {customers.length > 0 ? 'Nenhum cliente no período selecionado' : 'Nenhum cliente cadastrado'}
                  </div>
                  <div className="text-sm">
                    {customers.length > 0 
                      ? 'Tente ajustar o filtro de datas ou clique em "Novo Cliente" para adicionar um cliente'
                      : 'Clique em "Novo Cliente" para adicionar o primeiro cliente'
                    }
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


        </TabsContent>

        <TabsContent value="plan-templates">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {planList.map(plan => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    <Badge variant={plan.segment === 'food' ? 'default' : plan.segment === 'varejo' ? 'secondary' : 'outline'}>
                      {plan.segment === 'food' ? 'Food' : plan.segment === 'varejo' ? 'Varejo' : 'Comum'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`${plan.id}-monthly`}>Preço Mensal (R$)</Label>
                    <Input
                      id={`${plan.id}-monthly`}
                      type="number"
                      step="0.01"
                      value={settings.planPrices[plan.id]?.monthly || 0}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        planPrices: {
                          ...prev.planPrices,
                          [plan.id]: {
                            ...prev.planPrices[plan.id],
                            monthly: parseFloat(e.target.value) || 0
                          }
                        }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${plan.id}-annual`}>Valor Mensal do Plano Anual (R$)</Label>
                    <Input
                      id={`${plan.id}-annual`}
                      type="number"
                      step="0.01"
                      value={settings.planPrices[plan.id]?.annual || 0}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        planPrices: {
                          ...prev.planPrices,
                          [plan.id]: {
                            ...prev.planPrices[plan.id],
                            annual: parseFloat(e.target.value) || 0
                          }
                        }
                      }))}
                      className="mt-1"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Valor mensal cobrado no plano anual
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground">
                      Cliques: {settings.planClicks[plan.id] || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="business-templates">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Template de Negócio</CardTitle>
                <CardDescription>
                  Configure templates pré-definidos por tipo de negócio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="template-name">Nome do Template</Label>
                    <Input
                      id="template-name"
                      placeholder="Ex: Loja de Roupa"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="template-segment">Segmento</Label>
                    <Select value={newTemplateSegment} onValueChange={(value: 'food' | 'varejo') => setNewTemplateSegment(value)}>
                      <SelectTrigger id="template-segment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food Service</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="template-description">Descrição</Label>
                  <Input
                    id="template-description"
                    placeholder="Configuração ideal para..."
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="template-plan">Plano Base</Label>
                  <Select value={newTemplatePlan} onValueChange={setNewTemplatePlan}>
                    <SelectTrigger id="template-plan">
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      {planList.filter(plan => plan.segment === newTemplateSegment || plan.segment === 'common').map(plan => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => {
                    if (newTemplateName && newTemplateDescription && newTemplatePlan) {
                      const templateId = newTemplateName.toLowerCase().replace(/\s+/g, '-');
                      setSettings(prev => ({
                        ...prev,
                        businessTemplates: {
                          ...prev.businessTemplates,
                          [templateId]: {
                            name: newTemplateName,
                            description: newTemplateDescription,
                            planId: newTemplatePlan,
                            segment: newTemplateSegment,
                            preSelectedModules: newTemplateModules
                          }
                        }
                      }));
                      setNewTemplateName('');
                      setNewTemplateDescription('');
                      setNewTemplatePlan('');
                      setNewTemplateModules({});
                      toast({
                        title: "Template criado!",
                        description: "Novo template de negócio foi adicionado.",
                      });
                    }
                  }}
                  className="w-full"
                >
                  Criar Template
                </Button>
              </CardContent>
            </Card>

            {/* 2. Edição e exclusão de templates de negócio */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Templates Existentes</h4>
              {Object.entries(settings.businessTemplates).length === 0 && (
                <div className="text-muted-foreground text-sm">Nenhum template cadastrado.</div>
              )}
              {Object.entries(settings.businessTemplates).map(([templateId, template]) => (
                <div key={templateId} className="mb-4 p-3 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <Input
                        className="mb-1"
                        value={template.name}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          businessTemplates: {
                            ...prev.businessTemplates,
                            [templateId]: { ...prev.businessTemplates[templateId], name: e.target.value }
                          }
                        }))}
                        placeholder="Nome do template"
                      />
                      <Input
                        className="mb-1"
                        value={template.description}
                        onChange={e => setSettings(prev => ({
                          ...prev,
                          businessTemplates: {
                            ...prev.businessTemplates,
                            [templateId]: { ...prev.businessTemplates[templateId], description: e.target.value }
                          }
                        }))}
                        placeholder="Descrição"
                      />
                      <Select value={template.planId} onValueChange={value => setSettings(prev => ({
                        ...prev,
                        businessTemplates: {
                          ...prev.businessTemplates,
                          [templateId]: { ...prev.businessTemplates[templateId], planId: value }
                        }
                      }))}>
                        <SelectTrigger><SelectValue placeholder="Plano" /></SelectTrigger>
                        <SelectContent>
                          {Object.values(plans).map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={template.segment} onValueChange={value => setSettings(prev => ({
                        ...prev,
                        businessTemplates: {
                          ...prev.businessTemplates,
                          [templateId]: { ...prev.businessTemplates[templateId], segment: value as 'food' | 'varejo' }
                        }
                      }))}>
                        <SelectTrigger><SelectValue placeholder="Segmento" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="varejo">Varejo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="destructive" onClick={() => {
                      setSettings(prev => {
                        const newTemplates = { ...prev.businessTemplates };
                        delete newTemplates[templateId];
                        return { ...prev, businessTemplates: newTemplates };
                      });
                    }}>Excluir</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="module-help">
          <Card>
            <CardHeader>
              <CardTitle>Links de Ajuda dos Módulos</CardTitle>
              <CardDescription>
                Configure os links de ajuda que aparecem nos módulos com o ícone "?"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {moduleList.map(module => (
                  <div key={module.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{module.name}</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {module.price.toFixed(2)}/mês
                      </div>
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="https://exemplo.com/ajuda-modulo"
                        value={settings.moduleHelpLinks[module.id] || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          moduleHelpLinks: {
                            ...prev.moduleHelpLinks,
                            [module.id]: e.target.value
                          }
                        }))}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="module-plan-prices">
          <Card>
            <CardHeader>
              <CardTitle>Preço dos Módulos por Plano</CardTitle>
              <CardDescription>
                Selecione um plano para editar o preço dos módulos obrigatórios e opcionais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Plano</Label>
                <Select value={selectedModuleForPricing} onValueChange={setSelectedModuleForPricing}>
                  <SelectTrigger><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdv-food">Plano PDV Food</SelectItem>
                    <SelectItem value="gestao-food">Plano Gestão Food</SelectItem>
                    <SelectItem value="performance-food">Plano Performance Food</SelectItem>
                    <SelectItem value="autoatendimento-food">Plano Autoatendimento Food</SelectItem>
                    <SelectItem value="pdv-varejo">Plano PDV Varejo</SelectItem>
                    <SelectItem value="gestao-varejo">Plano Gestão Varejo</SelectItem>
                    <SelectItem value="performance-varejo">Plano Performance Varejo</SelectItem>
                    <SelectItem value="autoatendimento-varejo">Plano Autoatendimento Varejo</SelectItem>
                    <SelectItem value="bling">Plano Bling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedModuleForPricing && (
                <>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Módulos Obrigatórios</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {settings.planModuleConfig[selectedModuleForPricing]?.mandatoryModules.map(moduleId => (
                        <div key={moduleId} className="flex items-center gap-2 p-2 border rounded">
                          <span className="flex-1">{modules[moduleId]?.name || moduleId}</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={moduleEditingPrices[moduleId]?.[selectedModuleForPricing] === undefined ? '' : moduleEditingPrices[moduleId]?.[selectedModuleForPricing]}
                            onChange={e => handleModulePriceChange(moduleId, selectedModuleForPricing, parseFloat(e.target.value) || 0)}
                            placeholder="Preço"
                            className="w-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Módulos Opcionais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {settings.planModuleConfig[selectedModuleForPricing]?.optionalModules.map(moduleId => (
                        <div key={moduleId} className="flex items-center gap-2 p-2 border rounded">
                          <span className="flex-1">{modules[moduleId]?.name || moduleId}</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={moduleEditingPrices[moduleId]?.[selectedModuleForPricing] === undefined ? '' : moduleEditingPrices[moduleId]?.[selectedModuleForPricing]}
                            onChange={e => handleModulePriceChange(moduleId, selectedModuleForPricing, parseFloat(e.target.value) || 0)}
                            placeholder="Preço"
                            className="w-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Spinbox Adicionais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(settings.spinboxLimits[selectedModuleForPricing] || {}).map(([spinboxKey, config]) => (
                        <div key={spinboxKey} className="flex items-center gap-2 p-2 border rounded">
                          <span className="flex-1">{spinboxKey.charAt(0).toUpperCase() + spinboxKey.slice(1)}</span>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={moduleEditingPrices[spinboxKey]?.[selectedModuleForPricing] === undefined ? '' : moduleEditingPrices[spinboxKey]?.[selectedModuleForPricing]}
                            onChange={e => handleModulePriceChange(spinboxKey, selectedModuleForPricing, parseFloat(e.target.value) || 0)}
                            placeholder="Preço por unidade"
                            className="w-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan-limits">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Limites dos Planos</CardTitle>
                <CardDescription>
                  Defina quais módulos são obrigatórios, opcionais e seus limites para cada tipo de plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Seleção de Plano */}
                  <div className="space-y-4">
                    <Label htmlFor="plan-select">Selecione o Plano</Label>
                    <Select value={selectedPlanForModuleConfig} onValueChange={setSelectedPlanForModuleConfig}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um plano para configurar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdv-food">Plano PDV Food</SelectItem>
                        <SelectItem value="gestao-food">Plano Gestão Food</SelectItem>
                        <SelectItem value="performance-food">Plano Performance Food</SelectItem>
                        <SelectItem value="autoatendimento-food">Plano Autoatendimento Food</SelectItem>
                        <SelectItem value="pdv-varejo">Plano PDV Varejo</SelectItem>
                        <SelectItem value="gestao-varejo">Plano Gestão Varejo</SelectItem>
                        <SelectItem value="performance-varejo">Plano Performance Varejo</SelectItem>
                        <SelectItem value="autoatendimento-varejo">Plano Autoatendimento Varejo</SelectItem>
                        <SelectItem value="bling">Plano Bling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Configuração de Módulos */}
                  {selectedPlanForModuleConfig && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Módulos Obrigatórios</h3>
                        <div className="p-3 border rounded-lg min-h-32 space-y-2">
                          {moduleList.map(module => (
                            <div key={module.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={settings.planModuleConfig[selectedPlanForModuleConfig]?.mandatoryModules.includes(module.id) || false}
                                onCheckedChange={(checked) => {
                                  handleModuleConfigChange(selectedPlanForModuleConfig, module.id, true, checked as boolean);
                                }}
                              />
                              <label className="text-sm">{module.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Módulos Opcionais</h3>
                        <div className="p-3 border rounded-lg min-h-32 space-y-2">
                          {moduleList.map(module => (
                            <div key={module.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={settings.planModuleConfig[selectedPlanForModuleConfig]?.optionalModules.includes(module.id) || false}
                                onCheckedChange={(checked) => {
                                  handleModuleConfigChange(selectedPlanForModuleConfig, module.id, false, checked as boolean);
                                }}
                              />
                              <label className="text-sm">{module.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Configuração de Spinbox */}
                  {selectedPlanForModuleConfig && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Configuração de Spinbox</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(settings.spinboxLimits[selectedPlanForModuleConfig] || {}).map(([spinboxKey, config]) => (
                          <div key={spinboxKey} className="p-4 border rounded-lg space-y-3">
                            <Label className="font-medium">{spinboxKey.charAt(0).toUpperCase() + spinboxKey.slice(1)}</Label>
                            <div className="space-y-2">
                              <div>
                                <Label htmlFor={`${spinboxKey}-base`} className="text-xs">Quantidade Base</Label>
                                <Input
                                  id={`${spinboxKey}-base`}
                                  type="number"
                                  value={config.base}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setSettings(prev => ({
                                      ...prev,
                                      spinboxLimits: {
                                        ...prev.spinboxLimits,
                                        [selectedPlanForModuleConfig]: {
                                          ...prev.spinboxLimits[selectedPlanForModuleConfig],
                                          [spinboxKey]: {
                                            ...config,
                                            base: value
                                          }
                                        }
                                      }
                                    }));
                                  }}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`${spinboxKey}-max`} className="text-xs">Quantidade Máxima</Label>
                                <Input
                                  id={`${spinboxKey}-max`}
                                  type="number"
                                  value={config.max}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setSettings(prev => ({
                                      ...prev,
                                      spinboxLimits: {
                                        ...prev.spinboxLimits,
                                        [selectedPlanForModuleConfig]: {
                                          ...prev.spinboxLimits[selectedPlanForModuleConfig],
                                          [spinboxKey]: {
                                            ...config,
                                            max: value
                                          }
                                        }
                                      }
                                    }));
                                  }}
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={config.readonly}
                                  onCheckedChange={(checked) => {
                                    setSettings(prev => ({
                                      ...prev,
                                      spinboxLimits: {
                                        ...prev.spinboxLimits,
                                        [selectedPlanForModuleConfig]: {
                                          ...prev.spinboxLimits[selectedPlanForModuleConfig],
                                          [spinboxKey]: {
                                            ...config,
                                            readonly: checked
                                          }
                                        }
                                      }
                                    }));
                                  }}
                                />
                                <Label className="text-xs">Somente Leitura</Label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom-modules">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Módulo/Spinbox</CardTitle>
                <CardDescription>
                  Crie módulos e spinboxes customizados para usar nos planos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="module-id">ID do Módulo</Label>
                    <Input
                      id="module-id"
                      value={newCustomModule.id}
                      onChange={(e) => setNewCustomModule(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="ex: meu-modulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="module-name">Nome do Módulo</Label>
                    <Input
                      id="module-name"
                      value={newCustomModule.name}
                      onChange={(e) => setNewCustomModule(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do módulo"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="module-description">Descrição</Label>
                    <Input
                      id="module-description"
                      value={newCustomModule.description}
                      onChange={(e) => setNewCustomModule(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descrição do módulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="module-price">Preço Base</Label>
                    <Input
                      id="module-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newCustomModule.price}
                      onChange={(e) => setNewCustomModule(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Configurações</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newCustomModule.allowsDiscount}
                        onCheckedChange={(checked) => setNewCustomModule(prev => ({ ...prev, allowsDiscount: checked }))}
                      />
                      <Label className="text-sm">Permite Desconto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newCustomModule.isSpinbox}
                        onCheckedChange={(checked) => setNewCustomModule(prev => ({ ...prev, isSpinbox: checked }))}
                      />
                      <Label className="text-sm">É Spinbox</Label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Planos Disponíveis</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {Object.keys(settings.planPrices).map(planId => (
                        <div key={planId} className="flex items-center space-x-2">
                          <Checkbox
                            checked={newCustomModule.availablePlans.includes(planId)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewCustomModule(prev => ({
                                  ...prev,
                                  availablePlans: [...prev.availablePlans, planId]
                                }));
                              } else {
                                setNewCustomModule(prev => ({
                                  ...prev,
                                  availablePlans: prev.availablePlans.filter(p => p !== planId)
                                }));
                              }
                            }}
                          />
                          <Label className="text-sm">{planId}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Button onClick={handleCreateCustomModule} className="w-full">
                      Criar Módulo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Módulos Customizados Existentes</CardTitle>
                <CardDescription>
                  Gerencie os módulos e spinboxes customizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(settings.customModules).map(([moduleId, module]) => (
                    <div key={moduleId} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{module.name}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">R$ {module.price.toFixed(2)}</Badge>
                            {module.allowsDiscount && <Badge variant="secondary">Com Desconto</Badge>}
                            {module.isSpinbox && <Badge variant="secondary">Spinbox</Badge>}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCustomModule(moduleId)}
                        >
                          Excluir
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={module.name}
                            onChange={(e) => handleUpdateCustomModule(moduleId, { name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Preço</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={module.price}
                            onChange={(e) => handleUpdateCustomModule(moduleId, { price: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Descrição</Label>
                          <Input
                            value={module.description}
                            onChange={(e) => handleUpdateCustomModule(moduleId, { description: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Configurações</Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={module.allowsDiscount}
                              onCheckedChange={(checked) => handleUpdateCustomModule(moduleId, { allowsDiscount: checked })}
                            />
                            <Label className="text-sm">Permite Desconto</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={module.isSpinbox}
                              onCheckedChange={(checked) => handleUpdateCustomModule(moduleId, { isSpinbox: checked })}
                            />
                            <Label className="text-sm">É Spinbox</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Todos os Módulos e Spinboxes do Sistema</CardTitle>
                <CardDescription>
                  Edite ou exclua módulos existentes. As alterações afetarão todas as partes do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleList.map(module => {
                    const isEditing = editingCustomModule === module.id;
                    const editedModule = settings.customModules[module.id] || module;
                    
                    return (
                      <div key={module.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{editedModule.name}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline">R$ {editedModule.price.toFixed(2)}</Badge>
                              {editedModule.allowsDiscount !== false && <Badge variant="secondary">Com Desconto</Badge>}
                              {editedModule.isSpinbox && <Badge variant="secondary">Spinbox</Badge>}
                              <Badge variant="outline">Sistema</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setEditingCustomModule(null);
                                    // Reverter mudanças
                                    setSettings(prev => {
                                      const newCustomModules = { ...prev.customModules };
                                      delete newCustomModules[module.id];
                                      return { ...prev, customModules: newCustomModules };
                                    });
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingCustomModule(null)}
                                >
                                  Salvar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingCustomModule(module.id)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteSystemModule(module.id)}
                                >
                                  Excluir
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={editedModule.name}
                              onChange={(e) => handleUpdateSystemModule(module.id, { name: e.target.value })}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </div>
                          <div>
                            <Label>Preço Base</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editedModule.price}
                              onChange={(e) => handleUpdateSystemModule(module.id, { price: parseFloat(e.target.value) || 0 })}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted" : ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Configurações</Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editedModule.allowsDiscount !== false}
                                onCheckedChange={(checked) => handleUpdateSystemModule(module.id, { allowsDiscount: checked })}
                                disabled={!isEditing}
                              />
                              <Label className="text-sm">Permite Desconto</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={editedModule.isSpinbox || false}
                                onCheckedChange={(checked) => handleUpdateSystemModule(module.id, { isSpinbox: checked })}
                                disabled={!isEditing}
                              />
                              <Label className="text-sm">É Spinbox</Label>
                            </div>
                          </div>
                          <div>
                            <Label>Preços por Plano (se aplicável)</Label>
                            {editedModule.priceByPlan ? (
                              <div className="space-y-1 mt-2">
                                {Object.entries(editedModule.priceByPlan).map(([planId, price]) => (
                                  <div key={planId} className="flex justify-between text-sm">
                                    <span>{planId}:</span>
                                    <span>R$ {price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground mt-2">
                                Preço único para todos os planos
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendedores">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerenciar Vendedores</CardTitle>
                    <CardDescription>
                      Crie e gerencie vendedores para gerar links específicos
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowNewVendedorModal(true)} className="bg-gradient-to-r from-primary to-primary-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Vendedor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendedores.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum vendedor encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        Clique em "Novo Vendedor" para criar o primeiro vendedor
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {vendedores.map((vendedor) => (
                        <Card key={vendedor.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                                                          <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{vendedor.name}</h3>
                                                         <Badge variant={vendedor.isactive ? "default" : "secondary"}>
                             {vendedor.isactive ? "Ativo" : "Inativo"}
                           </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Email: {vendedor.email}
                            </p>
                                                     <p className="text-sm text-muted-foreground mb-3">
                           WhatsApp: {vendedor.whatsappnumber}
                         </p>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Link do Vendedor:</Label>
                                <div className="flex gap-2">
                                  <Input
                                    value={generateVendedorLink(vendedor.id)}
                                    readOnly
                                    className="text-sm"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(generateVendedorLink(vendedor.id));
                                      toast({
                                        title: "Link copiado!",
                                        description: "Link do vendedor copiado para a área de transferência.",
                                      });
                                    }}
                                  >
                                    Copiar
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteVendedor(vendedor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Ajuste as configurações globais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="annual-discount">Desconto Anual (%)</Label>
                  <Input
                    id="annual-discount"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.annualDiscount}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      annualDiscount: parseFloat(e.target.value) || 0
                    }))}
                    className="mt-1"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    Desconto aplicado nos planos anuais
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regras de Desconto por Módulo</CardTitle>
                <CardDescription>
                  Configure quais módulos podem receber desconto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {moduleList.map(module => (
                    <div key={module.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{module.name}</div>
                        <div className="text-sm text-muted-foreground">
                          R$ {module.price.toFixed(2)}/mês
                        </div>
                      </div>
                      <Switch 
                        checked={settings.moduleDiscountRules[module.id] ?? module.allowsDiscount}
                        onCheckedChange={(checked) => handleDiscountRuleToggle(module.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Novo Cliente */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Cliente</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewCustomerModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer-name">Nome do Cliente</Label>
                <Input
                  id="customer-name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo do cliente"
                />
              </div>
              
              <div>
                <Label htmlFor="customer-plan">Plano</Label>
                <Select
                  value={newCustomer.planId}
                  onValueChange={(value) => setNewCustomer(prev => ({ ...prev, planId: value }))}
                >
                  <SelectTrigger id="customer-plan">
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(plans).map(([planId, plan]) => (
                      <SelectItem key={planId} value={planId}>
                        {plan.name} ({plan.segment === 'food' ? 'Food' : 'Varejo'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="customer-plan-type">Tipo de Plano</Label>
                <Select
                  value={newCustomer.planType}
                  onValueChange={(value: 'monthly' | 'annual') => setNewCustomer(prev => ({ ...prev, planType: value }))}
                >
                  <SelectTrigger id="customer-plan-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="customer-value">Valor (R$)</Label>
                <Input
                  id="customer-value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCustomer.value}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewCustomerModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddCustomer}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Adicionar Cliente
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Vendedor */}
      {showNewVendedorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Vendedor</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewVendedorModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendedor-name">Nome do Vendedor</Label>
                <Input
                  id="vendedor-name"
                  value={newVendedor.name}
                  onChange={(e) => setNewVendedor(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo do vendedor"
                />
              </div>
              
              <div>
                <Label htmlFor="vendedor-email">Email</Label>
                <Input
                  id="vendedor-email"
                  type="email"
                  value={newVendedor.email}
                  onChange={(e) => setNewVendedor(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="vendedor-whatsapp">WhatsApp</Label>
                <Input
                  id="vendedor-whatsapp"
                  value={newVendedor.whatsappNumber}
                  onChange={(e) => setNewVendedor(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  placeholder="5541999999999"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Digite apenas os números (ex: 5541999999999)
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewVendedorModal(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddVendedor}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Criar Vendedor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};