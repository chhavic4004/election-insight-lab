// VoteVichar Simulation Engine
// Separates business logic from UI

export type ElectionModel = 'current' | 'partial' | 'full';

export interface ScenarioParams {
  id: string;
  name: string;
  model: ElectionModel;
  statesInvolved: number;
  electionFrequency: number; // years between elections
  administrativeScale: 'low' | 'medium' | 'high';
  governanceDisruption: 'minimal' | 'moderate' | 'significant';
}

export interface SimulationResult {
  id: string;
  scenarioName: string;
  params: ScenarioParams;
  financialCost: number; // in crores
  administrativeWorkload: number; // percentage scale 0-100
  governanceImpact: number; // MCC duration in days per year
  costBreakdown: {
    personnel: number;
    logistics: number;
    security: number;
    technology: number;
  };
  stateWiseImpact: Array<{
    state: string;
    cost: number;
    mccDays: number;
  }>;
  yearlyProjection: Array<{
    year: number;
    cost: number;
    elections: number;
  }>;
  insights: string[];
  timestamp: Date;
}

// Mock state data
const STATES = [
  'Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal', 'Madhya Pradesh',
  'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat', 'Andhra Pradesh',
  'Odisha', 'Kerala', 'Jharkhand', 'Assam', 'Punjab', 'Chhattisgarh',
  'Haryana', 'Delhi', 'Jammu & Kashmir', 'Uttarakhand', 'Himachal Pradesh',
  'Tripura', 'Meghalaya', 'Manipur', 'Nagaland', 'Goa', 'Arunachal Pradesh',
  'Mizoram', 'Sikkim', 'Telangana'
];

// Base costs per state (in crores) - mock data
const STATE_BASE_COSTS: Record<string, number> = {
  'Uttar Pradesh': 850,
  'Maharashtra': 650,
  'Bihar': 520,
  'West Bengal': 480,
  'Madhya Pradesh': 420,
  'Tamil Nadu': 400,
  'Rajasthan': 380,
  'Karnataka': 360,
  'Gujarat': 340,
  'Andhra Pradesh': 320,
};

function getBaseCost(state: string): number {
  return STATE_BASE_COSTS[state] || Math.floor(150 + Math.random() * 200);
}

function generateId(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function runSimulation(params: ScenarioParams): SimulationResult {
  const selectedStates = STATES.slice(0, params.statesInvolved);
  
  // Calculate model multipliers
  const modelMultipliers = {
    current: { cost: 1.0, workload: 1.0, mcc: 1.0 },
    partial: { cost: 0.75, workload: 0.8, mcc: 0.6 },
    full: { cost: 0.55, workload: 0.5, mcc: 0.35 },
  };
  
  const adminScaleMultipliers = {
    low: 0.8,
    medium: 1.0,
    high: 1.3,
  };
  
  const disruptionMultipliers = {
    minimal: 0.7,
    moderate: 1.0,
    significant: 1.4,
  };
  
  const modelMult = modelMultipliers[params.model];
  const adminMult = adminScaleMultipliers[params.administrativeScale];
  const disruptMult = disruptionMultipliers[params.governanceDisruption];
  
  // Calculate state-wise impact
  const stateWiseImpact = selectedStates.map(state => {
    const baseCost = getBaseCost(state);
    const cost = Math.round(baseCost * modelMult.cost * adminMult);
    const mccDays = Math.round(45 * modelMult.mcc * disruptMult);
    return { state, cost, mccDays };
  });
  
  // Calculate totals
  const totalCost = stateWiseImpact.reduce((sum, s) => sum + s.cost, 0);
  const avgMccDays = Math.round(
    stateWiseImpact.reduce((sum, s) => sum + s.mccDays, 0) / stateWiseImpact.length
  );
  
  // Cost breakdown
  const costBreakdown = {
    personnel: Math.round(totalCost * 0.35),
    logistics: Math.round(totalCost * 0.28),
    security: Math.round(totalCost * 0.22),
    technology: Math.round(totalCost * 0.15),
  };
  
  // Yearly projection (5 years)
  const yearlyProjection = [];
  const baseYear = new Date().getFullYear();
  const electionsPerYear = params.model === 'full' ? 1 : params.model === 'partial' ? 2 : 3;
  
  for (let i = 0; i < 5; i++) {
    const yearCost = i % params.electionFrequency === 0 
      ? totalCost * (1 + i * 0.05) // 5% inflation
      : totalCost * 0.1; // maintenance cost
    
    yearlyProjection.push({
      year: baseYear + i,
      cost: Math.round(yearCost),
      elections: i % params.electionFrequency === 0 ? electionsPerYear : 0,
    });
  }
  
  // Generate insights
  const insights = generateInsights(params, totalCost, avgMccDays);
  
  // Calculate administrative workload
  const adminWorkload = Math.round(
    (params.model === 'current' ? 85 : params.model === 'partial' ? 65 : 45) * adminMult
  );
  
  return {
    id: generateId(),
    scenarioName: params.name,
    params,
    financialCost: totalCost,
    administrativeWorkload: Math.min(100, adminWorkload),
    governanceImpact: avgMccDays * (5 / params.electionFrequency), // annual MCC days
    costBreakdown,
    stateWiseImpact,
    yearlyProjection,
    insights,
    timestamp: new Date(),
  };
}

function generateInsights(params: ScenarioParams, cost: number, mccDays: number): string[] {
  const insights: string[] = [];
  
  if (params.model === 'current') {
    insights.push(
      `Current cycle maintains existing election schedules across ${params.statesInvolved} states.`,
      `Estimated annual MCC enforcement period: ${mccDays} days per state on average.`,
      `Higher frequency of elections may impact ongoing governance and development projects.`
    );
  } else if (params.model === 'partial') {
    insights.push(
      `Partial synchronization could reduce administrative overhead by approximately 20-25%.`,
      `Clubbing elections in phases may optimize security force deployment.`,
      `Moderate reduction in governance disruption expected.`
    );
  } else {
    insights.push(
      `Full synchronization projects significant cost savings of 40-45% over 5-year cycle.`,
      `Single national election reduces MCC enforcement to once in ${params.electionFrequency} years.`,
      `Requires constitutional amendments and consensus across all participating states.`
    );
  }
  
  if (cost > 10000) {
    insights.push(`High-cost scenario: Total projected expenditure exceeds ₹10,000 crores.`);
  }
  
  if (params.administrativeScale === 'high') {
    insights.push(`Elevated administrative scale increases personnel and logistics requirements.`);
  }
  
  return insights;
}

export function compareScenarios(results: SimulationResult[]): {
  costComparison: { name: string; cost: number }[];
  workloadComparison: { name: string; workload: number }[];
  mccComparison: { name: string; mccDays: number }[];
  summary: string[];
} {
  const costComparison = results.map(r => ({ name: r.scenarioName, cost: r.financialCost }));
  const workloadComparison = results.map(r => ({ name: r.scenarioName, workload: r.administrativeWorkload }));
  const mccComparison = results.map(r => ({ name: r.scenarioName, mccDays: r.governanceImpact }));
  
  const summary: string[] = [];
  
  if (results.length >= 2) {
    const sorted = [...results].sort((a, b) => a.financialCost - b.financialCost);
    const savings = sorted[sorted.length - 1].financialCost - sorted[0].financialCost;
    summary.push(
      `${sorted[0].scenarioName} is the most cost-effective option, saving ₹${savings.toLocaleString()} crores compared to ${sorted[sorted.length - 1].scenarioName}.`
    );
    
    const lowestMcc = [...results].sort((a, b) => a.governanceImpact - b.governanceImpact)[0];
    summary.push(
      `${lowestMcc.scenarioName} minimizes governance disruption with ${lowestMcc.governanceImpact} MCC days annually.`
    );
  }
  
  return { costComparison, workloadComparison, mccComparison, summary };
}

export function exportToCsv(result: SimulationResult): string {
  const lines = [
    'VoteVichar Simulation Export',
    `Scenario: ${result.scenarioName}`,
    `Model: ${result.params.model}`,
    `States Involved: ${result.params.statesInvolved}`,
    '',
    'Key Metrics',
    `Total Financial Cost (₹ Crores),${result.financialCost}`,
    `Administrative Workload (%),${result.administrativeWorkload}`,
    `Annual MCC Days,${result.governanceImpact}`,
    '',
    'Cost Breakdown',
    `Personnel,${result.costBreakdown.personnel}`,
    `Logistics,${result.costBreakdown.logistics}`,
    `Security,${result.costBreakdown.security}`,
    `Technology,${result.costBreakdown.technology}`,
    '',
    'State-wise Impact',
    'State,Cost (₹ Crores),MCC Days',
    ...result.stateWiseImpact.map(s => `${s.state},${s.cost},${s.mccDays}`),
  ];
  
  return lines.join('\n');
}
