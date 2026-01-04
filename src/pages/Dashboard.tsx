import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatCard from '@/components/StatCard';
import { useSimulations } from '@/hooks/useSimulations';
import { 
  Plus, 
  FileText, 
  GitCompare, 
  BarChart3,
  TrendingUp,
  Clock,
  IndianRupee
} from 'lucide-react';

const Dashboard = () => {
  const { simulations } = useSimulations();
  
  const totalSimulations = simulations.length;
  const avgCost = simulations.length > 0 
    ? Math.round(simulations.reduce((sum, s) => sum + s.financialCost, 0) / simulations.length)
    : 0;
  const latestModel = simulations[0]?.params.model || 'N/A';
  
  const quickActions = [
    {
      title: 'New Simulation',
      description: 'Create a new election synchronization scenario and run simulation.',
      icon: Plus,
      path: '/simulate',
      variant: 'default' as const,
    },
    {
      title: 'View Simulations',
      description: 'Browse and analyze your previous simulation results.',
      icon: FileText,
      path: '/simulations',
      variant: 'outline' as const,
    },
    {
      title: 'Compare Scenarios',
      description: 'Side-by-side comparison of multiple scenarios.',
      icon: GitCompare,
      path: '/compare',
      variant: 'outline' as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 gov-section">
        <div className="gov-container space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your election synchronization simulations and analysis.
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Simulations"
              value={totalSimulations}
              icon={BarChart3}
              description="Scenarios analyzed"
            />
            <StatCard
              label="Avg. Cost Estimate"
              value={avgCost > 0 ? `₹${avgCost.toLocaleString()} Cr` : '—'}
              icon={IndianRupee}
              description="Across all scenarios"
            />
            <StatCard
              label="Latest Model"
              value={latestModel === 'current' ? 'Current' : latestModel === 'partial' ? 'Partial' : latestModel === 'full' ? 'Full Sync' : '—'}
              icon={TrendingUp}
              description="Most recent simulation"
            />
            <StatCard
              label="Session Status"
              value="Active"
              icon={Clock}
              description="Guest access"
              trend="neutral"
            />
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map(({ title, description, icon: Icon, path, variant }) => (
                <Card key={title} className="transition-all hover:shadow-md hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="rounded-lg bg-primary/10 p-3 w-fit mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant={variant} className="w-full">
                      <Link to={path}>
                        {title}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Recent Simulations */}
          {simulations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Recent Simulations</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/simulations">View All</Link>
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Scenario</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Model</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground">Cost (₹ Cr)</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground">States</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {simulations.slice(0, 5).map((sim) => (
                      <tr key={sim.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-foreground">{sim.scenarioName}</td>
                        <td className="p-3 capitalize text-muted-foreground">{sim.params.model}</td>
                        <td className="p-3 text-right text-foreground">{sim.financialCost.toLocaleString()}</td>
                        <td className="p-3 text-right text-muted-foreground">{sim.params.statesInvolved}</td>
                        <td className="p-3 text-muted-foreground text-sm">
                          {new Date(sim.timestamp).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {simulations.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Simulations Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by creating your first election synchronization scenario to explore 
                  the impact analysis.
                </p>
                <Button asChild>
                  <Link to="/simulate">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Simulation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
