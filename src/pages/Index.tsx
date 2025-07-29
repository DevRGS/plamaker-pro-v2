import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ShoppingCart, Settings, Zap, TrendingUp, CheckCircle, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                PlanMaker Pro
              </h1>
            </div>
            <nav className="flex space-x-4">
              <Button asChild variant="ghost">
                <Link to="/plans">Configurar Plano</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/auth">Login Admin</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Configure Seu Sistema de Gestão Ideal
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Crie um plano personalizado para seu negócio com módulos específicos para Food Service ou Varejo. 
            Sistema completo de PDV, gestão e automação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
              <Link to="/plans">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Começar Agora
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/auth">
                <Settings className="h-5 w-5 mr-2" />
                Área Administrativa
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que escolher o PlanMaker Pro?</h2>
            <p className="text-lg text-muted-foreground">
              Solução completa para gestão de negócios com tecnologia de ponta
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Planos Inteligentes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Templates pré-configurados para diferentes tipos de negócio. Configure seu plano em minutos com as melhores práticas do mercado.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <CardTitle>Módulos Flexíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Mais de 50 módulos disponíveis. Personalize completamente seu sistema adicionando apenas o que precisa para seu negócio.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Suporte Especializado</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Atendimento direto via WhatsApp para tirar dúvidas e finalizar sua compra. Suporte técnico incluído em todos os planos.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/5 to-primary-glow/5">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Configure seu plano personalizado agora e revolucione a gestão do seu negócio
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-xl transition-all duration-300">
            <Link to="/plans">
              <Zap className="h-5 w-5 mr-2" />
              Configurar Meu Plano
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 PlanMaker Pro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
