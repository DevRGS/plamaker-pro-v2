import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Seller, SellerClick } from '@/types/seller';
import { getCurrentLocation, normalizeStateName } from '@/utils/location';

export const useSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [sellerClicks, setSellerClicks] = useState<SellerClick[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar vendedores
  const loadSellers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'sellers')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar vendedores:', error);
        return;
      }

      if (data?.setting_value) {
        setSellers(data.setting_value as Seller[]);
      }
    } catch (error) {
      console.error('Erro ao carregar vendedores:', error);
    }
  };

  // Salvar vendedores
  const saveSellers = async (newSellers: Seller[]) => {
    try {
      const { error } = await supabase.from('admin_settings').upsert({
        setting_key: 'sellers',
        setting_value: newSellers
      }, { onConflict: 'setting_key' });

      if (error) {
        console.error('Erro ao salvar vendedores:', error);
        return false;
      }

      setSellers(newSellers);
      return true;
    } catch (error) {
      console.error('Erro ao salvar vendedores:', error);
      return false;
    }
  };

  // Carregar cliques dos vendedores
  const loadSellerClicks = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'sellerClicks')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar cliques dos vendedores:', error);
        return;
      }

      if (data?.setting_value) {
        setSellerClicks(data.setting_value as SellerClick[]);
      }
    } catch (error) {
      console.error('Erro ao carregar cliques dos vendedores:', error);
    }
  };

  // Salvar cliques dos vendedores
  const saveSellerClicks = async (newClicks: SellerClick[]) => {
    try {
      const { error } = await supabase.from('admin_settings').upsert({
        setting_key: 'sellerClicks',
        setting_value: newClicks
      }, { onConflict: 'setting_key' });

      if (error) {
        console.error('Erro ao salvar cliques dos vendedores:', error);
        return false;
      }

      setSellerClicks(newClicks);
      return true;
    } catch (error) {
      console.error('Erro ao salvar cliques dos vendedores:', error);
      return false;
    }
  };

  // Criar novo vendedor
  const createSeller = async (sellerData: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSeller: Seller = {
      ...sellerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = await saveSellers([...sellers, newSeller]);
    return success ? newSeller : null;
  };

  // Atualizar vendedor
  const updateSeller = async (sellerId: string, updates: Partial<Seller>) => {
    const updatedSellers = sellers.map(seller => 
      seller.id === sellerId 
        ? { ...seller, ...updates, updatedAt: new Date().toISOString() }
        : seller
    );

    const success = await saveSellers(updatedSellers);
    return success;
  };

  // Deletar vendedor
  const deleteSeller = async (sellerId: string) => {
    const updatedSellers = sellers.filter(seller => seller.id !== sellerId);
    const success = await saveSellers(updatedSellers);
    return success;
  };

  // Registrar clique do vendedor com localização
  const registerSellerClick = async (sellerId: string, planId: string) => {
    setLoading(true);
    try {
      // Obter localização
      const location = await getCurrentLocation();
      
      const newClick: SellerClick = {
        id: Date.now().toString(),
        sellerId,
        planId,
        timestamp: new Date().toISOString(),
        location: location ? {
          state: normalizeStateName(location.state),
          city: location.city,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude
        } : undefined,
        userAgent: navigator.userAgent
      };

      const updatedClicks = [...sellerClicks, newClick];
      const success = await saveSellerClicks(updatedClicks);
      
      if (success) {
        console.log('Clique registrado com sucesso:', newClick);
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao registrar clique:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obter estatísticas do vendedor
  const getSellerStats = (sellerId: string, startDate?: string, endDate?: string) => {
    const sellerClicksFiltered = sellerClicks.filter(click => {
      if (click.sellerId !== sellerId) return false;
      
      if (startDate || endDate) {
        const clickDate = new Date(click.timestamp);
        if (startDate && clickDate < new Date(startDate)) return false;
        if (endDate && clickDate > new Date(endDate)) return false;
      }
      
      return true;
    });

    const clicksByState = sellerClicksFiltered.reduce((acc, click) => {
      const state = click.location?.state || 'Não identificado';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const clicksByPlan = sellerClicksFiltered.reduce((acc, click) => {
      acc[click.planId] = (acc[click.planId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClicks: sellerClicksFiltered.length,
      clicksByState,
      clicksByPlan,
      recentClicks: sellerClicksFiltered.slice(-10).reverse()
    };
  };

  // Gerar link do vendedor
  const generateSellerLink = (sellerId: string, planId?: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('seller', sellerId);
    if (planId) params.set('plan', planId);
    
    return `${baseUrl}#/plans?${params.toString()}`;
  };

  // Obter vendedor pelo ID
  const getSellerById = (sellerId: string): Seller | undefined => {
    return sellers.find(seller => seller.id === sellerId);
  };

  // Carregar dados iniciais
  useEffect(() => {
    loadSellers();
    loadSellerClicks();
  }, []);

  return {
    sellers,
    sellerClicks,
    loading,
    createSeller,
    updateSeller,
    deleteSeller,
    registerSellerClick,
    getSellerStats,
    generateSellerLink,
    getSellerById,
    loadSellers,
    loadSellerClicks
  };
};