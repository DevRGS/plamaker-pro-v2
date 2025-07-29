export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerClick {
  id: string;
  sellerId: string;
  planId: string;
  timestamp: string;
  location?: {
    state: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  userAgent: string;
  ipAddress?: string;
}

export interface SellerStats {
  sellerId: string;
  totalClicks: number;
  totalSales: number;
  totalRevenue: number;
  conversionRate: number;
  clicksByState: Record<string, number>;
  clicksByPlan: Record<string, number>;
  period: {
    startDate: string;
    endDate: string;
  };
}