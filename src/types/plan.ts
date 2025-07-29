export interface Module {
  id: string;
  name: string;
  price: number;
  isSpinbox?: boolean;
  allowsDiscount: boolean;
  priceByPlan?: Record<string, number>;
}

export interface Plan {
  id: string;
  name: string;
  segment: 'food' | 'varejo' | 'common';
  mandatoryModules: string[];
  optionalModules: string[];
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  planId: string;
  segment: 'food' | 'varejo';
  preSelectedModules: Record<string, number>;
}

export interface PlanSelection {
  planId: string;
  segment: 'food' | 'varejo';
  modules: Record<string, number>;
  annualPlan: boolean;
  discount: number;
}

export interface AdminSettings {
  annualDiscount: number;
  planPrices: Record<string, { monthly: number; annual: number }>;
  moduleDiscountRules: Record<string, boolean>;
  planClicks: Record<string, number>;
}