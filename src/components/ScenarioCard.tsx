import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SimulationResult } from '@/lib/simulation';
import { Eye, Download, Trash2 } from 'lucide-react';

interface ScenarioCardProps {
  result: SimulationResult;
  onView: (result: SimulationResult) => void;
  onExport: (result: SimulationResult) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

const ScenarioCard = ({ 
  result, 
  onView, 
  onExport, 
  onDelete,
  isSelected,
  onToggleSelect 
}: ScenarioCardProps) => {
  const modelLabels = {
    current: 'Current Cycle',
    partial: 'Partial Sync',
    full: 'Full Sync',
  };

  const modelColors = {
    current: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    partial: 'bg-warning/10 text-warning border-warning/20',
    full: 'bg-accent/10 text-accent border-accent/20',
  };

  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-accent' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{result.scenarioName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(result.timestamp).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge variant="outline" className={modelColors[result.params.model]}>
            {modelLabels[result.params.model]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">₹{result.financialCost.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Cost (Cr)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{result.administrativeWorkload}%</p>
            <p className="text-xs text-muted-foreground">Workload</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{result.governanceImpact}</p>
            <p className="text-xs text-muted-foreground">MCC Days</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(result)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport(result)}>
            <Download className="h-4 w-4" />
          </Button>
          {onToggleSelect && (
            <Button 
              variant={isSelected ? "default" : "outline"} 
              size="sm"
              onClick={() => onToggleSelect(result.id)}
            >
              {isSelected ? 'Selected' : 'Compare'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(result.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
