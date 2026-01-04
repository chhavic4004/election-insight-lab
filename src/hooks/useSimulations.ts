import { useState, useEffect } from 'react';
import { SimulationResult, ScenarioParams, runSimulation } from '@/lib/simulation';

const STORAGE_KEY = 'votevichar_simulations';

export function useSimulations() {
  const [simulations, setSimulations] = useState<SimulationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const results = parsed.map((r: SimulationResult) => ({
          ...r,
          timestamp: new Date(r.timestamp),
        }));
        setSimulations(results);
      } catch (e) {
        console.error('Failed to parse stored simulations:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever simulations change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
    }
  }, [simulations, isLoading]);

  const addSimulation = (params: ScenarioParams): SimulationResult => {
    const result = runSimulation(params);
    setSimulations(prev => [result, ...prev]);
    return result;
  };

  const deleteSimulation = (id: string) => {
    setSimulations(prev => prev.filter(s => s.id !== id));
  };

  const clearAllSimulations = () => {
    setSimulations([]);
  };

  const getSimulation = (id: string): SimulationResult | undefined => {
    return simulations.find(s => s.id === id);
  };

  return {
    simulations,
    isLoading,
    addSimulation,
    deleteSimulation,
    clearAllSimulations,
    getSimulation,
  };
}
