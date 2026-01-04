import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSimulations } from '@/hooks/useSimulations';
import { compareScenarios } from '@/lib/simulation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  ArrowLeft,
  Lightbulb,
  GitCompare
} from 'lucide-react';

const Compare = () => {
  const [searchParams] = useSearchParams();
  const { simulations } = useSimulations();
  
  const selectedIds = searchParams.get('ids')?.split(',') || [];
  
  const selectedResults = useMemo(() => {
    return simulations.filter(s => selectedIds.includes(s.id));
  }, [simulations, selectedIds]);
  
  const comparison = useMemo(() => {
    if (selectedResults.length < 2) return null;
    return compareScenarios(selectedResults);
  }, [selectedResults]);

  const modelLabels = {
    current: 'Current Cycle',
    partial: 'Partial Sync',
    full: 'Full Sync',
  };

  const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
  ];

  if (selectedResults.length < 2) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 gov-section">
          <div className="gov-container">
            <Card className="max-w-lg mx-auto">
              <CardContent className="py-12 text-center">
                <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
                  <GitCompare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select Scenarios to Compare
                </h3>
                <p className="text-muted-foreground mb-6">
                  Choose 2-3 scenarios from your simulations to see a side-by-side comparison.
                </p>
                <Button asChild>
                  <Link to="/simulations">Go to Simulations</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Prepare comparison chart data
  const metricsData = [
    {
      metric: 'Cost (₹ Cr)',
      ...Object.fromEntries(selectedResults.map(r => [r.scenarioName, r.financialCost]))
    },
    {
      metric: 'Workload (%)',
      ...Object.fromEntries(selectedResults.map(r => [r.scenarioName, r.administrativeWorkload]))
    },
    {
      metric: 'MCC Days',
      ...Object.fromEntries(selectedResults.map(r => [r.scenarioName, r.governanceImpact]))
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 gov-section">
        <div className="gov-container space-y-8">
          {/* Header */}
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
              <Link to="/simulations">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Simulations
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Scenario Comparison</h1>
            <p className="text-muted-foreground">
              Comparing {selectedResults.length} election synchronization scenarios.
            </p>
          </div>
          
          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Metric</th>
                    {selectedResults.map((result, idx) => (
                      <th key={result.id} className="text-center p-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-semibold text-foreground">{result.scenarioName}</span>
                          <Badge variant="outline" className="text-xs">
                            {modelLabels[result.params.model]}
                          </Badge>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-medium text-muted-foreground">Financial Cost (₹ Cr)</td>
                    {selectedResults.map((r) => {
                      const isLowest = r.financialCost === Math.min(...selectedResults.map(s => s.financialCost));
                      return (
                        <td key={r.id} className={`p-3 text-center text-lg font-bold ${isLowest ? 'text-success' : 'text-foreground'}`}>
                          ₹{r.financialCost.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-medium text-muted-foreground">Administrative Workload</td>
                    {selectedResults.map((r) => {
                      const isLowest = r.administrativeWorkload === Math.min(...selectedResults.map(s => s.administrativeWorkload));
                      return (
                        <td key={r.id} className={`p-3 text-center text-lg font-bold ${isLowest ? 'text-success' : 'text-foreground'}`}>
                          {r.administrativeWorkload}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-medium text-muted-foreground">Annual MCC Days</td>
                    {selectedResults.map((r) => {
                      const isLowest = r.governanceImpact === Math.min(...selectedResults.map(s => s.governanceImpact));
                      return (
                        <td key={r.id} className={`p-3 text-center text-lg font-bold ${isLowest ? 'text-success' : 'text-foreground'}`}>
                          {r.governanceImpact}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-medium text-muted-foreground">States Covered</td>
                    {selectedResults.map((r) => (
                      <td key={r.id} className="p-3 text-center text-foreground">
                        {r.params.statesInvolved}
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="p-3 font-medium text-muted-foreground">Election Frequency</td>
                    {selectedResults.map((r) => (
                      <td key={r.id} className="p-3 text-center text-foreground">
                        Every {r.params.electionFrequency} years
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          
          {/* Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricsData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis 
                      dataKey="metric" 
                      type="category" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    {selectedResults.map((result, idx) => (
                      <Bar 
                        key={result.id}
                        dataKey={result.scenarioName} 
                        fill={chartColors[idx]}
                        radius={[0, 4, 4, 0]}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Cost Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={selectedResults.map(r => ({
                      name: r.scenarioName,
                      Personnel: r.costBreakdown.personnel,
                      Logistics: r.costBreakdown.logistics,
                      Security: r.costBreakdown.security,
                      Technology: r.costBreakdown.technology,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value} Crores`, '']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Personnel" stackId="a" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="Logistics" stackId="a" fill="hsl(var(--chart-2))" />
                    <Bar dataKey="Security" stackId="a" fill="hsl(var(--chart-3))" />
                    <Bar dataKey="Technology" stackId="a" fill="hsl(var(--chart-4))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Summary Insights */}
          {comparison && comparison.summary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Comparison Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {comparison.summary.map((insight, index) => (
                    <li key={index} className="flex gap-3 text-muted-foreground">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Trade-offs */}
          <Card>
            <CardHeader>
              <CardTitle>Trade-off Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {selectedResults.map((result) => (
                  <div key={result.id} className="p-4 rounded-lg border bg-muted/30">
                    <h4 className="font-semibold text-foreground mb-3">{result.scenarioName}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost Efficiency</span>
                        <span className={result.financialCost === Math.min(...selectedResults.map(s => s.financialCost)) ? 'text-success font-medium' : 'text-foreground'}>
                          {result.financialCost === Math.min(...selectedResults.map(s => s.financialCost)) ? 'Best' : 'Higher'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Admin Load</span>
                        <span className={result.administrativeWorkload === Math.min(...selectedResults.map(s => s.administrativeWorkload)) ? 'text-success font-medium' : 'text-foreground'}>
                          {result.administrativeWorkload <= 50 ? 'Low' : result.administrativeWorkload <= 70 ? 'Medium' : 'High'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Governance Impact</span>
                        <span className={result.governanceImpact === Math.min(...selectedResults.map(s => s.governanceImpact)) ? 'text-success font-medium' : 'text-foreground'}>
                          {result.governanceImpact <= 30 ? 'Minimal' : result.governanceImpact <= 60 ? 'Moderate' : 'Significant'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/simulations">Select Different Scenarios</Link>
            </Button>
            <Button asChild>
              <Link to="/simulate">Create New Scenario</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;
