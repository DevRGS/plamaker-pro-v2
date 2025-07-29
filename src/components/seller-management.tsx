import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useSellers } from '@/hooks/useSellers';
import { Seller } from '@/types/seller';
import { Plus, Copy, Edit, Trash2, User, Phone, Mail, MessageCircle, BarChart3, MapPin } from 'lucide-react';
import { plans } from '@/data/plans';

export const SellerManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    sellers,
    sellerClicks,
    createSeller,
    updateSeller,
    deleteSeller,
    getSellerStats,
    generateSellerLink,
    loading
  } = useSellers();

  const [showNewSellerForm, setShowNewSellerForm] = useState(false);
  const [editingSeller, setEditingSeller] = useState<string | null>(null);
  const [newSeller, setNewSeller] = useState({
    name: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    isActive: true
  });

  const handleCreateSeller = async () => {
    if (!newSeller.name || !newSeller.email || !newSeller.whatsappNumber) {
      toast({
        title: "Erro",
        description: "Nome, email e WhatsApp são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const seller = await createSeller(newSeller);
    if (seller) {
      toast({
        title: "Vendedor criado!",
        description: `${seller.name} foi adicionado com sucesso.`
      });
      setNewSeller({
        name: '',
        email: '',
        phone: '',
        whatsappNumber: '',
        isActive: true
      });
      setShowNewSellerForm(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível criar o vendedor",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSeller = async (sellerId: string, updates: Partial<Seller>) => {
    const success = await updateSeller(sellerId, updates);
    if (success) {
      toast({
        title: "Vendedor atualizado!",
        description: "As alterações foram salvas."
      });
      setEditingSeller(null);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o vendedor",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSeller = async (sellerId: string, sellerName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o vendedor ${sellerName}?`)) {
      const success = await deleteSeller(sellerId);
      if (success) {
        toast({
          title: "Vendedor excluído!",
          description: `${sellerName} foi removido.`
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível excluir o vendedor",
          variant: "destructive"
        });
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`
    });
  };

  const getWhatsAppLink = (number: string, message: string = '') => {
    const cleanNumber = number.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Vendedores</h2>
          <p className="text-muted-foreground">
            Crie e gerencie vendedores com links personalizados
          </p>
        </div>
        <Button onClick={() => setShowNewSellerForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Vendedor
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendedores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">
              {sellers.filter(s => s.isActive).length} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellerClicks.length}</div>
            <p className="text-xs text-muted-foreground">
              Todos os vendedores
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados Únicos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sellerClicks.map(c => c.location?.state).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Com cliques registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedor Top</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {(() => {
                const clicksBySeller = sellerClicks.reduce((acc, click) => {
                  acc[click.sellerId] = (acc[click.sellerId] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const topSellerId = Object.entries(clicksBySeller)
                  .sort(([,a], [,b]) => b - a)[0]?.[0];
                
                const topSeller = sellers.find(s => s.id === topSellerId);
                return topSeller ? topSeller.name.split(' ')[0] : 'N/A';
              })()}
            </div>
            <p className="text-xs text-muted-foreground">
              Mais cliques
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Formulário Novo Vendedor */}
      {showNewSellerForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Vendedor</CardTitle>
            <CardDescription>
              Preencha os dados do vendedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seller-name">Nome Completo</Label>
                <Input
                  id="seller-name"
                  value={newSeller.name}
                  onChange={(e) => setNewSeller(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="João Silva"
                />
              </div>
              <div>
                <Label htmlFor="seller-email">Email</Label>
                <Input
                  id="seller-email"
                  type="email"
                  value={newSeller.email}
                  onChange={(e) => setNewSeller(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="joao@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="seller-phone">Telefone</Label>
                <Input
                  id="seller-phone"
                  value={newSeller.phone}
                  onChange={(e) => setNewSeller(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="seller-whatsapp">WhatsApp (com DDI)</Label>
                <Input
                  id="seller-whatsapp"
                  value={newSeller.whatsappNumber}
                  onChange={(e) => setNewSeller(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  placeholder="5511999999999"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newSeller.isActive}
                  onCheckedChange={(checked) => setNewSeller(prev => ({ ...prev, isActive: checked }))}
                />
                <Label>Ativo</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewSellerForm(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateSeller}>
                Criar Vendedor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Vendedores */}
      <div className="grid grid-cols-1 gap-6">
        {sellers.map(seller => {
          const stats = getSellerStats(seller.id);
          const isEditing = editingSeller === seller.id;

          return (
            <Card key={seller.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {seller.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{seller.name}</span>
                        <Badge variant={seller.isActive ? "default" : "secondary"}>
                          {seller.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {seller.email}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {seller.whatsappNumber}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSeller(isEditing ? null : seller.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSeller(seller.id, seller.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        value={seller.name}
                        onChange={(e) => handleUpdateSeller(seller.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={seller.email}
                        onChange={(e) => handleUpdateSeller(seller.id, { email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={seller.phone}
                        onChange={(e) => handleUpdateSeller(seller.id, { phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input
                        value={seller.whatsappNumber}
                        onChange={(e) => handleUpdateSeller(seller.id, { whatsappNumber: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={seller.isActive}
                        onCheckedChange={(checked) => handleUpdateSeller(seller.id, { isActive: checked })}
                      />
                      <Label>Ativo</Label>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Estatísticas do Vendedor */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalClicks}</div>
                        <div className="text-sm text-muted-foreground">Total Cliques</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Object.keys(stats.clicksByState).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Estados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Object.keys(stats.clicksByPlan).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Planos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {stats.recentClicks.length > 0 
                            ? new Date(stats.recentClicks[0].timestamp).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">Último Clique</div>
                      </div>
                    </div>

                    {/* Links do Vendedor */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Link Geral</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={generateSellerLink(seller.id)}
                            readOnly
                            className="font-mono text-xs"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateSellerLink(seller.id), 'Link')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Links por Plano */}
                      <div>
                        <Label className="text-sm font-medium">Links por Plano</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {Object.entries(plans).map(([planId, plan]) => (
                            <div key={planId} className="flex items-center space-x-2">
                              <span className="text-xs w-24 truncate">{plan.name}</span>
                              <Input
                                value={generateSellerLink(seller.id, planId)}
                                readOnly
                                className="font-mono text-xs flex-1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(generateSellerLink(seller.id, planId), `Link ${plan.name}`)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* WhatsApp com Mensagem Personalizada */}
                      <div>
                        <Label className="text-sm font-medium">WhatsApp</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            value={getWhatsAppLink(seller.whatsappNumber, 'Olá! Vim através do link de vendas e gostaria de saber mais sobre os planos.')}
                            readOnly
                            className="font-mono text-xs"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(
                              getWhatsAppLink(seller.whatsappNumber, 'Olá! Vim através do link de vendas e gostaria de saber mais sobre os planos.'),
                              'Link WhatsApp'
                            )}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Cliques por Estado */}
                    {Object.keys(stats.clicksByState).length > 0 && (
                      <div className="mt-6">
                        <Label className="text-sm font-medium">Cliques por Estado</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {Object.entries(stats.clicksByState)
                            .sort(([,a], [,b]) => b - a)
                            .map(([state, clicks]) => (
                              <div key={state} className="flex justify-between items-center p-2 border rounded">
                                <span className="text-sm">{state}</span>
                                <Badge variant="outline">{clicks}</Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Cliques por Plano */}
                    {Object.keys(stats.clicksByPlan).length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium">Cliques por Plano</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {Object.entries(stats.clicksByPlan)
                            .sort(([,a], [,b]) => b - a)
                            .map(([planId, clicks]) => (
                              <div key={planId} className="flex justify-between items-center p-2 border rounded">
                                <span className="text-sm">{plans[planId]?.name || planId}</span>
                                <Badge variant="outline">{clicks}</Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sellers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum vendedor cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro vendedor para gerar links personalizados
            </p>
            <Button onClick={() => setShowNewSellerForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Vendedor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};