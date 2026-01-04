import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Scale, 
  TrendingUp,
  FileText,
  GitCompare
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Scenario Simulation',
      description: 'Model current, partial, and full election synchronization scenarios with customizable parameters.',
    },
    {
      icon: TrendingUp,
      title: 'Impact Analysis',
      description: 'Analyze financial, administrative, and governance impacts through data visualizations.',
    },
    {
      icon: GitCompare,
      title: 'Comparative Study',
      description: 'Compare multiple scenarios side-by-side to understand trade-offs and implications.',
    },
    {
      icon: FileText,
      title: 'Export Reports',
      description: 'Generate and export detailed reports for policy documentation and analysis.',
    },
  ];

  const principles = [
    { icon: Shield, label: 'Data Privacy', text: 'No real voter data used' },
    { icon: Scale, label: 'Neutrality', text: 'Non-political analysis' },
    { icon: BarChart3, label: 'Evidence-Based', text: 'Data-driven insights' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="gov-section border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="gov-container">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                Policy Research Tool
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight text-balance">
                Election Synchronization Feasibility & Impact Simulator
              </h1>
              
              <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                A neutral, data-driven platform for policymakers and analysts to simulate and compare 
                election synchronization scenarios and understand their constitutional, administrative, 
                and financial implications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/dashboard">
                    Start Simulation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/simulations">
                    View Previous Simulations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="py-8 border-b">
          <div className="gov-container">
            <div className="flex flex-wrap justify-center gap-8">
              {principles.map(({ icon: Icon, label, text }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="gov-section">
          <div className="gov-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Platform Capabilities</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Comprehensive tools for election synchronization analysis and policy research.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6 space-y-4">
                    <div className="rounded-lg bg-primary/10 p-3 w-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="gov-section bg-primary text-primary-foreground">
          <div className="gov-container text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Analyze Election Synchronization Scenarios?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Start your first simulation and explore the impact of different election models 
              on governance and administration.
            </p>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
