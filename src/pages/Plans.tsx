import { PlanBuilder } from '@/components/plan-builder';
import { useParams } from 'react-router-dom';

const Plans = () => {
  const { vendedorId } = useParams<{ vendedorId?: string }>();
  
  return <PlanBuilder vendedorId={vendedorId} />;
};

export default Plans;