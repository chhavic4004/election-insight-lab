import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScenarioCard from '@/components/ScenarioCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSimulations } from '@/hooks/useSimulations';
import { exportToCsv, SimulationResult } from '@/lib/simulation';
import { toast } from 'sonner';
import { Plus, BarChart3, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Simulations = () => {
  const navigate = useNavigate();
  const { simulations, deleteSimulation, clearAllSimulations } = useSimulations();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const handleView = (result: SimulationResult) => {
    navigate(`/results/${result.id}`);
  };

  const handleExport = (result: SimulationResult) => {
    const csv = exportToCsv(result);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.scenarioName.replace(/\s+/g, '_')}_simulation.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const handleDelete = (id: string) => {
    deleteSimulation(id);
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    toast.success('Simulation deleted');
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size < 3) {
          next.add(id);
        } else {
          toast.error('Maximum 3 scenarios can be compared');
        }
      }
      return next;
    });
  };

  const handleCompare = () => {
    if (selectedIds.size < 2) {
      toast.error('Select at least 2 scenarios to compare');
      return;
    }
    navigate(`/compare?ids=${Array.from(selectedIds).join(',')}`);
  };

  const handleClearAll = () => {
    clearAllSimulations();
    setSelectedIds(new Set());
    setClearDialogOpen(false);
    toast.success('All simulations cleared');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 gov-section">
        <div className="gov-container space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Simulations</h1>
              <p className="text-muted-foreground">
                {simulations.length} scenario{simulations.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="flex gap-2">
              {selectedIds.size >= 2 && (
                <Button onClick={handleCompare}>
                  Compare Selected ({selectedIds.size})
                </Button>
              )}
              <Button asChild>
                <Link to="/simulate">
                  <Plus className="h-4 w-4 mr-2" />
                  New Simulation
                </Link>
              </Button>
              {simulations.length > 0 && (
                <Button variant="outline" onClick={() => setClearDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
          
          {/* Simulations Grid */}
          {simulations.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((result) => (
                <ScenarioCard
                  key={result.id}
                  result={result}
                  onView={handleView}
                  onExport={handleExport}
                  onDelete={handleDelete}
                  isSelected={selectedIds.has(result.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Simulations Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first election synchronization scenario to get started.
                </p>
                <Button asChild>
                  <Link to="/simulate">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Simulation
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Selection Hint */}
          {simulations.length >= 2 && selectedIds.size === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Click "Compare" on cards to select scenarios for side-by-side comparison.
            </p>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Clear All Confirmation */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Simulations?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {simulations.length} saved simulations.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Simulations;
