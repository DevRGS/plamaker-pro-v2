import { PlanBuilder } from '@/components/plan-builder';
import { useParams, useSearchParams } from 'react-router-dom';

const Plans = () => {
  const { vendedorId } = useParams<{ vendedorId?: string }>();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('seller');
  
  // Usar sellerId da query string ou vendedorId da rota
  const finalSellerId = sellerId || vendedorId;
  
  return <PlanBuilder vendedorId={finalSellerId} />;
};

export default Plans;