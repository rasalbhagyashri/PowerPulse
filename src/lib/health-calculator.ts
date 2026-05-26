export interface SensorData {
  Vrms: number;
  Irms: number;
  Freq: number;
  ActivePower: number;
  ReactivePower: number;
  PowerFactor: number;
  THDv: number;
  THDi: number;
}

export interface HealthResult {
  healthIndex: number;
  status: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
  parameterContributions: {
    name: string;
    contribution: number;
  }[];
  topContributor: string;
}

export function calculateHealthIndex(data: SensorData): HealthResult {
  const standards = {
    voltage: { ideal: 230, limitOffset: 11.5, weight: 31 }, // 5% of 230
    pf: { ideal: 1, limitOffset: 0.1, weight: 32 }, // 1 - 0.9
    freq: { ideal: 50, limitOffset: 0.5, weight: 4 }, // 1% of 50
    vThd: { ideal: 0, limitOffset: 5, weight: 10 },
    cThd: { ideal: 0, limitOffset: 5, weight: 10 },
    reactive: { ideal: 0, limitOffset: 1000, weight: 6 }, // Assuming 1kVAR limit for normalization
    current: { ideal: 0, limitOffset: 20, weight: 4 }, // Assuming 20A rated
    active: { ideal: 0, limitOffset: 5000, weight: 3 }, // Assuming 5kW rated
  };

  const calculateDistance = (val: number, standard: { ideal: number; limitOffset: number }) => {
    return Math.abs((standard.ideal - val) / standard.limitOffset) * 100;
  };

  const contributions = [
    { name: 'Voltage', score: calculateDistance(data.Vrms, standards.voltage), weight: standards.voltage.weight },
    { name: 'Power Factor', score: calculateDistance(data.PowerFactor, standards.pf), weight: standards.pf.weight },
    { name: 'Frequency', score: calculateDistance(data.Freq, standards.freq), weight: standards.freq.weight },
    { name: 'Voltage THD', score: calculateDistance(data.THDv, standards.vThd), weight: standards.vThd.weight },
    { name: 'Current THD', score: calculateDistance(data.THDi, standards.cThd), weight: standards.cThd.weight },
    { name: 'Reactive Power', score: calculateDistance(data.ReactivePower, standards.reactive), weight: standards.reactive.weight },
    { name: 'Current', score: calculateDistance(data.Irms, standards.current), weight: standards.current.weight },
    { name: 'Active Power', score: calculateDistance(data.ActivePower, standards.active), weight: standards.active.weight },
  ];

  let totalWeightedScore = 0;
  contributions.forEach(c => {
    totalWeightedScore += (c.score * c.weight) / 100;
  });

  // Clamp health index to 0-100
  const healthIndex = Math.min(100, Math.max(0, totalWeightedScore));

  let status: HealthResult['status'] = 'Excellent';
  if (healthIndex > 80) status = 'Critical';
  else if (healthIndex > 60) status = 'Poor';
  else if (healthIndex > 40) status = 'Moderate';
  else if (healthIndex > 20) status = 'Good';

  const parameterContributions = contributions
    .map(c => ({
      name: c.name,
      contribution: Math.round(((c.score * c.weight) / 100 / (totalWeightedScore || 1)) * 100)
    }))
    .sort((a, b) => b.contribution - a.contribution);

  const top = parameterContributions[0];
  const topContributor = `${top.name} contributing ${top.contribution}% of health degradation`;

  return {
    healthIndex,
    status,
    parameterContributions,
    topContributor
  };
}
