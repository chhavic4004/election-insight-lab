import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSimulations } from '@/hooks/useSimulations';
import { exportToCsv } from '@/lib/simulation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Download, 
  ArrowLeft, 
  IndianRupee, 
  Users, 
  Calendar,
  Lightbulb,
  Building2,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSimulation } = useSimulations();
  
  const result = id ? getSimulation(id) : undefined;
  
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Simulation not found.</p>
              <Button asChild>
                <Link to="/dashboard">Return to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const modelLabels = {
    current: 'Current Cycle',
    partial: 'Partial Synchronization',
    full: 'Full Synchronization',
  };

  const handleExport = () => {
    const csv = exportToCsv(result);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.scenarioName.replace(/\s+/g, '_')}_simulation.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  // Prepare chart data
  const costBreakdownData = [
    { name: 'Personnel', value: result.costBreakdown.personnel, fill: 'hsl(var(--chart-1))' },
    { name: 'Logistics', value: result.costBreakdown.logistics, fill: 'hsl(var(--chart-2))' },
    { name: 'Security', value: result.costBreakdown.security, fill: 'hsl(var(--chart-3))' },
    { name: 'Technology', value: result.costBreakdown.technology, fill: 'hsl(var(--chart-4))' },
  ];

  const stateData = result.stateWiseImpact.slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 gov-section">
        <div className="gov-container space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{result.scenarioName}</h1>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  {modelLabels[result.params.model]}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Simulation completed on {new Date(result.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/simulate')}>
                <RefreshCw className="h-4 w-4 mr-2" />
                New Simulation
              </Button>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="gov-label">Total Financial Cost</p>
                    <p className="gov-stat text-foreground">₹{result.financialCost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Crores</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="gov-label">Administrative Workload</p>
                    <p className="gov-stat text-foreground">{result.administrativeWorkload}%</p>
                    <p className="text-sm text-muted-foreground">Capacity utilization</p>
                  </div>
                  <div className="rounded-lg bg-warning/10 p-3">
                    <Users className="h-5 w-5 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="gov-label">Annual MCC Duration</p>
                    <p className="gov-stat text-foreground">{result.governanceImpact}</p>
                    <p className="text-sm text-muted-foreground">Days per year</p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="gov-label">States Covered</p>
                    <p className="gov-stat text-foreground">{result.params.statesInvolved}</p>
                    <p className="text-sm text-muted-foreground">States & UTs</p>
                  </div>
                  <div className="rounded-lg bg-info/10 p-3">
                    <Building2 className="h-5 w-5 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ₹${value} Cr`}
                        labelLine={false}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`₹${value} Crores`, 'Amount']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {costBreakdownData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* State-wise Cost Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>State-wise Cost Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stateData} layout="vertical" margin={{ left: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis 
                        dataKey="state" 
                        type="category" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        width={75}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value} Crores`, 'Cost']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Bar dataKey="cost" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* 5-Year Projection */}
          <Card>
            <CardHeader>
              <CardTitle>5-Year Financial Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.yearlyProjection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'cost' ? `₹${value} Crores` : value,
                        name === 'cost' ? 'Estimated Cost' : 'Elections'
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-1))' }}
                      name="Cost (₹ Cr)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="elections" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-2))' }}
                      name="Elections"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {result.insights.map((insight, index) => (
                  <li key={index} className="flex gap-3 text-muted-foreground">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Parameters Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Election Model</p>
                  <p className="font-medium text-foreground capitalize">{result.params.model}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="font-medium text-foreground">Every {result.params.electionFrequency} years</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Administrative Scale</p>
                  <p className="font-medium text-foreground capitalize">{result.params.administrativeScale}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Governance Disruption</p>
                  <p className="font-medium text-foreground capitalize">{result.params.governanceDisruption}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/simulate">Run Another Simulation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/simulations">View All Simulations</Link>
            </Button>
            <Button asChild>
              <Link to="/compare">Compare Scenarios</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Results;
