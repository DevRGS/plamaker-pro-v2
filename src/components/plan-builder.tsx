import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { useToast } from '@/hooks/use-toast';
import { plans, planTemplates, planSpinboxConfig, planPrices } from '@/data/plans';
import { modules } from '@/data/modules';
import { PlanSelection, PlanTemplate } from '@/types/plan';
import { ShoppingCart, Check, Zap, MessageCircle, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSellers } from '@/hooks/useSellers';

export const PlanBuilder: React.FC = () => {
  const { toast } = useToast();
  const { registerSellerClick, getSellerById } = useSellers();
  const [selectedSegment, setSelectedSegment] = useState<'food' | 'varejo'>('food');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [moduleQuantities, setModuleQuantities] = useState<Record<string, number>>({});
  const [isAnnualPlan, setIsAnnualPlan] = useState(false);
  const [currentSeller, setCurrentSeller] = useState<string | null>(null);
  const [moduleHelpLinks, setModuleHelpLinks] = useState<Record<string, string>>({});
  const [modulePlanPrices, setModulePlanPrices] = useState<Record<string, Record<string, number>>>({});
  const [planModuleConfig, setPlanModuleConfig] = useState<Record<string, { mandatoryModules: string[]; optionalModules: string[] }>>({});
  const [spinboxLimits, setSpinboxLimits] = useState<Record<string, Record<string, { base: number; max: number; readonly: boolean }>>>({});
  const [businessTemplates, setBusinessTemplates] = useState<Record<string, {
    name: string;
    description: string;
    planId: string;
    segment: 'food' | 'varejo';
    preSelectedModules: Record<string, number>;
  }>>({});
  const [customModules, setCustomModules] = useState<Record<string, {
    id: string;
    name: string;
    description: string;
    price: number;
    allowsDiscount: boolean;
    isSpinbox: boolean;
    availablePlans: string[];
  }>>({});

  // Detectar vendedor na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('seller');
    const planId = urlParams.get('plan');
    
    if (sellerId) {
      setCurrentSeller(sellerId);
      
      // Se um plano específico foi passado, selecionar automaticamente
      if (planId && plans[planId]) {
        setSelectedPlan(planId);
        setSelectedSegment(plans[planId].segment as 'food' | 'varejo');
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'moduleHelpLinks')
        .single();
      if (data && data.setting_value) {
        setModuleHelpLinks(data.setting_value as Record<string, string>);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'modulePlanPrices')
        .single();
      if (data && data.setting_value) {
        setModulePlanPrices(data.setting_value as Record<string, Record<string, number>>);
      }
    })();
  }, []);

  // Carregar configuração de módulos por plano da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planModuleConfig')
        .single();
      if (data && data.setting_value) {
        setPlanModuleConfig(data.setting_value as Record<string, { mandatoryModules: string[]; optionalModules: string[] }>);
      }
    })();
  }, []);

  // Carregar configuração de spinbox da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'spinboxLimits')
        .single();
      if (data && data.setting_value) {
        setSpinboxLimits(data.setting_value as Record<string, Record<string, { base: number; max: number; readonly: boolean }>>);
      }
    })();
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
        setBusinessTemplates(data.setting_value as Record<string, {
          name: string;
          description: string;
          planId: string;
          segment: 'food' | 'varejo';
          preSelectedModules: Record<string, number>;
        }>);
      }
    })();
  }, []);

  // Carregar módulos customizados da Supabase
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'customModules')
        .single();
      if (data && data.setting_value) {
        setCustomModules(data.setting_value as Record<string, {
          id: string;
          name: string;
          description: string;
          price: number;
          allowsDiscount: boolean;
          isSpinbox: boolean;
          availablePlans: string[];
        }>);
      }
    })();
  }, []);

  const availablePlans = Object.values(plans).filter(plan => 
    plan.segment === selectedSegment || plan.segment === 'common'
  );

  const availableTemplates = Object.values(businessTemplates).filter(template => 
    template.segment === selectedSegment
  );

  const currentPlan = selectedPlan ? plans[selectedPlan] : null;

  useEffect(() => {
    if (selectedTemplate && businessTemplates[selectedTemplate]) {
      const template = businessTemplates[selectedTemplate];
      setSelectedPlan(template.planId);
      setModuleQuantities({ ...template.preSelectedModules });
    }
  }, [selectedTemplate, businessTemplates]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId && businessTemplates[templateId]) {
      toast({
        title: "Template aplicado!",
        description: `Configuração "${businessTemplates[templateId].name}" carregada com sucesso.`,
      });
    }
  };

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    setModuleQuantities(prev => ({
      ...prev,
      [moduleId]: checked ? 1 : 0
    }));
  };

  const handleQuantityChange = (moduleId: string, quantity: number) => {
    setModuleQuantities(prev => ({
      ...prev,
      [moduleId]: quantity
    }));
  };

  const getModulePrice = (moduleId: string): number => {
    // Preço customizado por plano (admin) - para módulos e spinbox
    if (modulePlanPrices[moduleId] && selectedPlan && modulePlanPrices[moduleId][selectedPlan]) {
      return modulePlanPrices[moduleId][selectedPlan];
    }
    
    // Verificar se é um módulo editado
    const customModule = customModules[moduleId];
    if (customModule) {
      return customModule.price;
    }
    
    // Para módulos normais
    const module = modules[moduleId];
    if (module) {
      if (module.priceByPlan && selectedPlan && module.priceByPlan[selectedPlan.replace('-food', '').replace('-varejo', '')]) {
        return module.priceByPlan[selectedPlan.replace('-food', '').replace('-varejo', '')];
      }
      return module.price;
    }
    
    // Para spinbox (se não for um módulo normal)
    return 0;
  };

  const calculateSubtotal = (): number => {
    let subtotal = 0;
    // Valor base do plano (sempre mensal)
    if (selectedPlan && planPrices[selectedPlan]) {
      subtotal += planPrices[selectedPlan].monthly;
    }
    // Módulos opcionais
    const optionalModules = getCurrentPlanOptionalModules();
    Object.entries(moduleQuantities).forEach(([moduleId, quantity]) => {
      // Só soma se for módulo opcional do plano atual
      if (quantity > 0 && optionalModules.includes(moduleId)) {
        subtotal += getModulePrice(moduleId) * quantity;
      }
    });
    return subtotal;
  };

  const calculateDiscountedTotal = (): { total: number, discount: number } => {
    let discountable = 0;
    let nonDiscountable = 0;
    // Valor base do plano (sempre mensal)
    if (selectedPlan && planPrices[selectedPlan]) {
      discountable += planPrices[selectedPlan].monthly;
    }
    // Módulos opcionais
    const optionalModules = getCurrentPlanOptionalModules();
    Object.entries(moduleQuantities).forEach(([moduleId, quantity]) => {
      if (quantity > 0 && optionalModules.includes(moduleId)) {
        const price = getModulePrice(moduleId) * quantity;
        const module = getModuleInfo(moduleId);
        if (module && module.allowsDiscount !== false) {
          discountable += price;
        } else {
          nonDiscountable += price;
        }
      }
    });
    const discount = discountable * 0.10;
    const total = discountable * 0.90 + nonDiscountable;
    return { total, discount };
  };

  const calculateImplementationCost = (): number => {
    if (isAnnualPlan) return 0; // Plano anual isenta implementação
    const subtotal = calculateSubtotal();
    if (subtotal >= 499) return 0; // Valor >= 499 isenta implementação
    return 499 - subtotal; // Diferença para chegar a 499
  };

  const generateWhatsAppMessage = (): string => {
    const planName = currentPlan ? currentPlan.name : 'Plano Personalizado';
    const segmentName = selectedSegment === 'food' ? 'Food Service' : 'Varejo';
    const paymentType = isAnnualPlan ? 'Anual (10% desconto)' : 'Mensal';
    
    let message = `🛒 *Solicitação de Plano - ${planName}*\n\n`;
    message += `📊 *Segmento:* ${segmentName}\n`;
    message += `💳 *Forma de pagamento:* ${paymentType}\n\n`;
    
    // Módulos inclusos no plano
    const mandatoryModules = getCurrentPlanMandatoryModules();
    if (mandatoryModules.length > 0) {
      message += `✅ *Módulos inclusos no plano:*\n`;
      mandatoryModules.forEach(moduleId => {
        const module = getModuleInfo(moduleId);
        if (module) {
          message += `• ${module.name} (já contém no plano)\n`;
        }
      });
      message += `\n`;
    }
    
    // Módulos adicionais selecionados
    const additionalModules = Object.entries(moduleQuantities).filter(([_, quantity]) => quantity > 0);
    if (additionalModules.length > 0) {
      message += `📋 *Módulos adicionais selecionados:*\n`;
      additionalModules.forEach(([moduleId, quantity]) => {
        const module = getModuleInfo(moduleId);
        if (module) {
          const price = getModulePrice(moduleId);
          message += `• ${module.name}`;
          if (quantity > 1) {
            message += ` (${quantity}x)`;
          }
          message += ` - R$ ${price.toFixed(2)}\n`;
        }
      });
      message += `\n`;
    }

    const implementationCost = calculateImplementationCost();
    const totalValue = isAnnualPlan ? calculateDiscountedTotal().total : (calculateSubtotal() + implementationCost);
    
    message += `💰 *Total ${paymentType}:* R$ ${totalValue.toFixed(2)}`;
    
    if (!isAnnualPlan && implementationCost > 0) {
      message += `\n🔧 *Custo com Implementação (Apenas primeiro mês):* R$ ${implementationCost.toFixed(2)}`;
      message += `\n📅 *Mensalidade a partir do 2º mês:* R$ ${calculateSubtotal().toFixed(2)}`;
    }
    
    return encodeURIComponent(message);
  };

  const handleBuyNow = async () => {
    const mandatoryModules = getCurrentPlanMandatoryModules();
    const optionalModules = getCurrentPlanOptionalModules();
    const hasMandatory = mandatoryModules.length > 0;
    const hasOptional = Object.entries(moduleQuantities).some(
      ([moduleId, quantity]) => quantity > 0 && optionalModules.includes(moduleId)
    );
    if (!currentPlan || (!hasMandatory && !hasOptional)) {
      toast({
        title: "Erro",
        description: "Selecione um plano e pelo menos um módulo antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    // Registrar clique no plano
    await recordPlanClick(selectedPlan);

    // Registrar clique do vendedor se houver
    if (currentSeller) {
      try {
        await registerSellerClick(currentSeller, selectedPlan);
      } catch (error) {
        console.error('Erro ao registrar clique do vendedor:', error);
      }
    }

    const message = generateWhatsAppMessage();
    
    // Usar WhatsApp do vendedor se disponível, senão usar o padrão
    let whatsappNumber = '5541991898178'; // Número padrão
    if (currentSeller) {
      const seller = getSellerById(currentSeller);
      if (seller && seller.whatsappNumber) {
        whatsappNumber = seller.whatsappNumber;
      }
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    const sellerName = currentSeller ? getSellerById(currentSeller)?.name : '';
    toast({
      title: "Redirecionando...",
      description: `Você será direcionado para o WhatsApp${sellerName ? ` do vendedor ${sellerName}` : ''} para finalizar sua compra.`,
    });
  };

  const recordPlanView = async (planId: string) => {
    try {
      // Buscar visualizações atuais
      const { data: existingData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planViews')
        .single();

      let currentViews = existingData?.setting_value || {};
      
      // Incrementar visualização para o plano
      currentViews[planId] = (currentViews[planId] || 0) + 1;

      // Salvar na Supabase
      await supabase.from('admin_settings').upsert({
        setting_key: 'planViews',
        setting_value: currentViews
      }, { onConflict: 'setting_key' });
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  const recordPlanClick = async (planId: string) => {
    try {
      console.log('Registrando clique para o plano:', planId);
      
      // Buscar cliques atuais
      const { data: existingData, error: fetchError } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planClicks')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Erro ao buscar cliques existentes:', fetchError);
      }

      let currentClicks = existingData?.setting_value || {};
      console.log('Cliques atuais:', currentClicks);
      
      // Incrementar clique para o plano
      currentClicks[planId] = (currentClicks[planId] || 0) + 1;
      console.log('Cliques após incremento:', currentClicks);

      // Salvar na Supabase
      const { error: saveError } = await supabase.from('admin_settings').upsert({
        setting_key: 'planClicks',
        setting_value: currentClicks
      }, { onConflict: 'setting_key' });

      if (saveError) {
        console.error('Erro ao salvar cliques:', saveError);
      } else {
        console.log('Cliques salvos com sucesso');
      }

      // Registrar clique com timestamp no novo sistema
      const { data: existingClicksWithDate, error: fetchDateError } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'planClicksWithDate')
        .single();

      if (fetchDateError && fetchDateError.code !== 'PGRST116') {
        console.error('Erro ao buscar cliques com data:', fetchDateError);
      }

      let currentClicksWithDate = existingClicksWithDate?.setting_value || [];
      console.log('Cliques com data atuais:', currentClicksWithDate);
      
      // Adicionar novo clique com timestamp
      const newClick = {
        planId,
        timestamp: new Date().toISOString()
      };
      currentClicksWithDate.push(newClick);
      console.log('Novo clique adicionado:', newClick);

      // Salvar cliques com data na Supabase
      const { error: saveDateError } = await supabase.from('admin_settings').upsert({
        setting_key: 'planClicksWithDate',
        setting_value: currentClicksWithDate
      }, { onConflict: 'setting_key' });

      if (saveDateError) {
        console.error('Erro ao salvar cliques com data:', saveDateError);
      } else {
        console.log('Cliques com data salvos com sucesso');
      }

      // Atualizar dashboard stats
      await updateDashboardStats(currentClicks);
      console.log('Dashboard stats atualizados');
      
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
    }
  };

  const updateDashboardStats = async (planClicks: Record<string, number>) => {
    try {
      const totalClicks = Object.values(planClicks).reduce((sum, clicks) => sum + clicks, 0);
      const totalRevenue = calculateTotalRevenue(planClicks);
      const activePlans = Object.keys(planClicks).length;
      const conversionRate = calculateConversionRate(totalClicks);

      // Atualizar dashboard_stats
      const stats = [
        { stat_key: 'total_clicks', stat_value: { value: totalClicks, label: 'Total de Cliques', icon: 'mouse-pointer' } },
        { stat_key: 'total_revenue', stat_value: { value: totalRevenue, label: 'Receita Total', icon: 'dollar-sign' } },
        { stat_key: 'active_plans', stat_value: { value: activePlans, label: 'Planos Ativos', icon: 'check-circle' } },
        { stat_key: 'conversion_rate', stat_value: { value: conversionRate, label: 'Taxa de Conversão', icon: 'trending-up' } }
      ];

      for (const stat of stats) {
        await supabase.from('dashboard_stats').upsert({
          stat_key: stat.stat_key,
          stat_value: stat.stat_value
        }, { onConflict: 'stat_key' });
      }
    } catch (error) {
      console.error('Erro ao atualizar dashboard stats:', error);
    }
  };

  const calculateTotalRevenue = (planClicks: Record<string, number>): number => {
    let totalRevenue = 0;
    Object.entries(planClicks).forEach(([planId, clicks]) => {
      const planPrice = planPrices[planId]?.monthly || 0;
      // Estimativa: 15% dos cliques se convertem em vendas
      const estimatedSales = Math.floor(clicks * 0.15);
      totalRevenue += estimatedSales * planPrice;
    });
    return totalRevenue;
  };

  const calculateConversionRate = (totalClicks: number): number => {
    // Estimativa baseada em cliques únicos vs conversões
    const estimatedUniqueVisitors = Math.floor(totalClicks * 0.3); // 30% são visitantes únicos
    const estimatedConversions = Math.floor(totalClicks * 0.15); // 15% se convertem
    return estimatedUniqueVisitors > 0 ? (estimatedConversions / estimatedUniqueVisitors) * 100 : 0;
  };

  // Função utilitária para pegar limites do spinbox do plano atual
  const getSpinboxLimits = (moduleId: string): { min: number; max: number; readonly: boolean } => {
    if (!selectedPlan || !spinboxLimits[selectedPlan] || !spinboxLimits[selectedPlan][moduleId]) {
      // Fallback para configuração padrão se não houver dados da Supabase
      if (planSpinboxConfig[selectedPlan] && planSpinboxConfig[selectedPlan][moduleId]) {
        const config = planSpinboxConfig[selectedPlan][moduleId];
        return {
          min: config.base,
          max: config.max,
          readonly: config.readonly
        };
      }
      return { min: 0, max: 999, readonly: false };
    }
    const config = spinboxLimits[selectedPlan][moduleId];
    return {
      min: config.base,
      max: config.max,
      readonly: config.readonly
    };
  };

  // Função para obter módulos obrigatórios do plano atual (prioriza Supabase, fallback para dados estáticos)
  const getCurrentPlanMandatoryModules = (): string[] => {
    if (selectedPlan && planModuleConfig[selectedPlan]) {
      return planModuleConfig[selectedPlan].mandatoryModules;
    }
    // Fallback para dados estáticos
    if (currentPlan) {
      return currentPlan.mandatoryModules;
    }
    return [];
  };

  // Função para obter módulos opcionais do plano atual (prioriza Supabase, fallback para dados estáticos)
  const getCurrentPlanOptionalModules = (): string[] => {
    if (selectedPlan && planModuleConfig[selectedPlan]) {
      return planModuleConfig[selectedPlan].optionalModules;
    }
    // Fallback para dados estáticos
    if (currentPlan) {
      return currentPlan.optionalModules;
    }
    return [];
  };

  // Função para obter informações do módulo (prioriza módulo editado)
  const getModuleInfo = (moduleId: string) => {
    // Priorizar módulo editado
    const customModule = customModules[moduleId];
    if (customModule) {
      return customModule;
    }
    
    // Fallback para módulo original
    return modules[moduleId];
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          PlanMaker Pro
        </h1>
        <p className="text-lg text-muted-foreground">
          Configure seu plano ideal de sistema de gestão
        </p>
      </div>

      {/* Banner do Vendedor */}
      {currentSeller && (
        <div className="mb-6">
          <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {getSellerById(currentSeller)?.name?.charAt(0) || 'V'}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Atendimento com {getSellerById(currentSeller)?.name || 'Vendedor'}
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Você está sendo atendido por um de nossos especialistas. 
                    Ao finalizar a compra, será direcionado diretamente para o WhatsApp do seu vendedor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Segmento e Template */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Configuração Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Segmento do Negócio</label>
                <Select value={selectedSegment} onValueChange={(value: 'food' | 'varejo') => setSelectedSegment(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food Service</SelectItem>
                    <SelectItem value="varejo">Varejo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Template Pré-configurado</label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um template ou configure manualmente" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Plano Base</label>
                <Select value={selectedPlan} onValueChange={async (value) => {
                  setSelectedPlan(value);
                  setModuleQuantities({}); // Limpa tudo ao trocar de plano
                  // Registrar visualização do plano
                  if (value) {
                    recordPlanView(value);
                    
                    // Registrar clique do vendedor se houver
                    if (currentSeller) {
                      try {
                        await registerSellerClick(currentSeller, value);
                        console.log('Clique do vendedor registrado:', currentSeller, value);
                      } catch (error) {
                        console.error('Erro ao registrar clique do vendedor:', error);
                      }
                    }
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="annual-plan" 
                  checked={isAnnualPlan}
                  onCheckedChange={setIsAnnualPlan}
                />
                <label htmlFor="annual-plan" className="text-sm font-medium">
                  Plano Anual (10% de desconto)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Módulos */}
          {currentPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Módulos do Plano</CardTitle>
                <CardDescription>
                  Configure os módulos inclusos e adicionais para seu plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Módulos Obrigatórios */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" />
                    Módulos Inclusos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getCurrentPlanMandatoryModules().map(moduleId => {
                      const module = modules[moduleId];
                      if (!module) return null;
                      
                      return (
                        <div key={moduleId} className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-success" />
                            <span className="text-sm">{module.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-success/20"
                              onClick={() => {
                                const helpUrl = moduleHelpLinks[module.id];
                                if (helpUrl) window.open(helpUrl, '_blank');
                              }}
                            >
                              <HelpCircle className="h-3 w-3" />
                            </Button>
                          </div>
                          <Badge variant="secondary">Incluso</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Módulos Opcionais */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Módulos Opcionais</h3>
                  <div className="space-y-3">
                    {getCurrentPlanOptionalModules().map(moduleId => {
                      const module = modules[moduleId];
                      if (!module) return null;
                      
                      const isSelected = (moduleQuantities[moduleId] || 0) > 0;
                      const price = getModulePrice(moduleId);
                      
                      return (
                        <div key={moduleId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {module.isSpinbox ? (
                              <QuantitySelector
                                value={moduleQuantities[moduleId] || 0}
                                onChange={(value) => handleQuantityChange(moduleId, value)}
                                min={0}
                                max={99}
                              />
                            ) : (
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleModuleToggle(moduleId, checked as boolean)}
                              />
                            )}
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{module.name}</div>
                                {!module.allowsDiscount && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    Sem desconto
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // Aqui você pode conectar com os links configurados no admin
                                  const helpUrl = moduleHelpLinks[module.id];
                                  if (helpUrl) window.open(helpUrl, '_blank');
                                }}
                              >
                                <HelpCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              R$ {price.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {module.isSpinbox ? 'por unidade' : 'mensal'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Módulos de Quantidade */}
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-3">Configurações de Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['pdvs', 'usuarios'].map(moduleId => {
                      const module = modules[moduleId];
                      if (!module) return null;
                      
                      return (
                        <div key={moduleId} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-medium">{module.name}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                // Aqui você pode conectar com os links configurados no admin
                                const helpUrl = moduleHelpLinks[module.id];
                                if (helpUrl) window.open(helpUrl, '_blank');
                              }}
                            >
                              <HelpCircle className="h-3 w-3" />
                            </Button>
                          </div>
                          <QuantitySelector
                            value={moduleQuantities[moduleId] || getSpinboxLimits(moduleId).min}
                            onChange={(value) => handleQuantityChange(moduleId, value)}
                            min={getSpinboxLimits(moduleId).min}
                            max={getSpinboxLimits(moduleId).max}
                            disabled={getSpinboxLimits(moduleId).readonly}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentPlan ? (
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold">{currentPlan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedSegment === 'food' ? 'Food Service' : 'Varejo'}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {/* Módulos inclusos no plano */}
                    {getCurrentPlanMandatoryModules().map(moduleId => {
                      const module = getModuleInfo(moduleId);
                      if (!module) return null;
                      
                      return (
                        <div key={moduleId} className="flex justify-between text-sm text-success">
                          <span>{module.name} (incluso)</span>
                          <span>R$ 0,00</span>
                        </div>
                      );
                    })}
                    
                    {/* Módulos adicionais selecionados */}
                    {Object.entries(moduleQuantities).map(([moduleId, quantity]) => {
                      if (quantity === 0) return null;
                      const module = getModuleInfo(moduleId);
                      if (!module) return null;
                      
                      const price = getModulePrice(moduleId);
                      const total = price * quantity;
                      
                      return (
                        <div key={moduleId} className="flex justify-between text-sm">
                          <span>{module.name} {quantity > 1 && `(${quantity}x)`}</span>
                          <span>R$ {total.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {isAnnualPlan && (
                      <div className="flex justify-between text-success">
                        <span>Desconto Anual (10%)</span>
                        <span>-R$ {calculateDiscountedTotal().discount.toFixed(2)}</span>
                      </div>
                    )}
                    {!isAnnualPlan && calculateImplementationCost() > 0 && (
                      <>
                        <div className="flex justify-between text-orange-600">
                          <div>
                            <div>Custo com Implementação</div>
                            <div className="text-xs">(Apenas primeiro mês)</div>
                          </div>
                          <span>R$ {calculateImplementationCost().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Mensalidade a partir do 2º mês</span>
                          <span>R$ {calculateSubtotal().toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total {isAnnualPlan ? 'Anual' : 'Primeiro Mês'}</span>
                      <span>R$ {(isAnnualPlan ? calculateDiscountedTotal().total : (calculateSubtotal() + calculateImplementationCost())).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Comprar via WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Selecione um plano para ver o resumo
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};