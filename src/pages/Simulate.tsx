import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSimulations } from '@/hooks/useSimulations';
import { ElectionModel, ScenarioParams } from '@/lib/simulation';
import { toast } from 'sonner';
import { Play, Info } from 'lucide-react';

const Simulate = () => {
  const navigate = useNavigate();
  const { addSimulation } = useSimulations();
  
  const [name, setName] = useState('');
  const [model, setModel] = useState<ElectionModel>('current');
  const [statesInvolved, setStatesInvolved] = useState([15]);
  const [frequency, setFrequency] = useState([5]);
  const [adminScale, setAdminScale] = useState<'low' | 'medium' | 'high'>('medium');
  const [disruption, setDisruption] = useState<'minimal' | 'moderate' | 'significant'>('moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modelOptions = [
    {
      value: 'current',
      label: 'Current Cycle',
      description: 'Existing election schedule with staggered state and national elections.',
    },
    {
      value: 'partial',
      label: 'Partial Synchronization',
      description: 'Clubbing elections in phases, grouping states for simultaneous polls.',
    },
    {
      value: 'full',
      label: 'Full Synchronization',
      description: 'Single national election event for all Lok Sabha and state assemblies.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }
    
    setIsSubmitting(true);
    
    const params: ScenarioParams = {
      id: `scenario_${Date.now()}`,
      name: name.trim(),
      model,
      statesInvolved: statesInvolved[0],
      electionFrequency: frequency[0],
      administrativeScale: adminScale,
      governanceDisruption: disruption,
    };
    
    const result = addSimulation(params);
    
    setTimeout(() => {
      toast.success('Simulation completed successfully');
      navigate(`/results/${result.id}`);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 gov-section">
        <div className="gov-container max-w-3xl">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-foreground">New Simulation</h1>
            <p className="text-muted-foreground">
              Configure your election synchronization scenario parameters.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Scenario Name */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scenario Details</CardTitle>
                <CardDescription>Give your simulation a descriptive name.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="name">Scenario Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Full Sync - 28 States Analysis"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Election Model */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Election Model</CardTitle>
                <CardDescription>Select the synchronization approach to simulate.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={model} onValueChange={(v) => setModel(v as ElectionModel)}>
                  <div className="space-y-3">
                    {modelOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                          model === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={option.value} className="mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulation Parameters</CardTitle>
                <CardDescription>Adjust the key variables for your scenario.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* States Involved */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>States Involved</Label>
                    <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                      {statesInvolved[0]} states
                    </span>
                  </div>
                  <Slider
                    value={statesInvolved}
                    onValueChange={setStatesInvolved}
                    min={5}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of states and UTs included in the simulation.
                  </p>
                </div>
                
                {/* Election Frequency */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Election Frequency</Label>
                    <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                      Every {frequency[0]} years
                    </span>
                  </div>
                  <Slider
                    value={frequency}
                    onValueChange={setFrequency}
                    min={3}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Interval between synchronized elections.
                  </p>
                </div>
                
                {/* Administrative Scale */}
                <div className="space-y-2">
                  <Label>Administrative Scale</Label>
                  <Select value={adminScale} onValueChange={(v) => setAdminScale(v as typeof adminScale)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minimal infrastructure expansion</SelectItem>
                      <SelectItem value="medium">Medium - Standard administrative capacity</SelectItem>
                      <SelectItem value="high">High - Enhanced deployment and logistics</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Level of administrative infrastructure required.
                  </p>
                </div>
                
                {/* Governance Disruption */}
                <div className="space-y-2">
                  <Label>Governance Disruption Assumption</Label>
                  <Select value={disruption} onValueChange={(v) => setDisruption(v as typeof disruption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal - Limited MCC impact on governance</SelectItem>
                      <SelectItem value="moderate">Moderate - Standard MCC enforcement</SelectItem>
                      <SelectItem value="significant">Significant - Extended MCC periods</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Expected impact of Model Code of Conduct on ongoing governance.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Info Note */}
            <div className="flex gap-3 p-4 rounded-lg bg-info/10 border border-info/20">
              <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Simulation Notes</p>
                <p>
                  This simulation uses predefined assumptions and mock data for demonstration purposes.
                  Results are indicative and should be used for policy research and analysis only.
                </p>
              </div>
            </div>
            
            {/* Submit */}
            <div className="flex gap-4">
              <Button 
                type="submit" 
                size="lg" 
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                <Play className="h-4 w-4" />
                {isSubmitting ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Simulate;
