export const electricalParameters = {
  voltage: {
    value: 231.5,
    unit: 'V',
    trend: Array.from({ length: 20 }, () => Math.random() * 5 + 228),
  },
  current: {
    value: 15.2,
    unit: 'A',
    trend: Array.from({ length: 20 }, () => Math.random() * 2 + 14),
  },
  activePower: {
    value: 3.2,
    unit: 'kW',
    trend: Array.from({ length: 20 }, () => Math.random() * 0.5 + 3),
  },
  reactivePower: {
    value: 0.8,
    unit: 'kVAR',
    trend: Array.from({ length: 20 }, () => Math.random() * 0.3 + 0.6),
  },
  apparentPower: {
    value: 3.3,
    unit: 'kVA',
    trend: Array.from({ length: 20 }, () => Math.random() * 0.5 + 3.1),
  },
  powerFactor: {
    value: 0.97,
    unit: '',
    trend: Array.from({ length: 20 }, () => Math.random() * 0.05 + 0.94),
  },
  frequency: {
    value: 50.01,
    unit: 'Hz',
    trend: Array.from({ length: 20 }, () => Math.random() * 0.05 + 49.98),
  },
  energyConsumption: {
    value: 1254.3,
    unit: 'kWh',
    trend: Array.from({ length: 20 }, (_, i) => 1200 + i * 2.5 + Math.random() * 10),
  },
};

export const powerQuality = {
  voltageTHD: 3.2,
  currentTHD: 4.5,
  totalTHD: 5.5,
};

export type Disturbance = {
  type: 'Voltage Sag' | 'Voltage Swell' | 'Harmonic Distortion';
  severity: 'Low' | 'Medium' | 'High';
  timestamp: string;
  details: string;
};

export const disturbances: Disturbance[] = [
  {
    type: 'Voltage Sag',
    severity: 'Medium',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    details: 'Voltage dropped to 85% of nominal for 5 cycles',
  },
  {
    type: 'Harmonic Distortion',
    severity: 'Low',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    details: 'Voltage THD briefly peaked at 5.2%',
  },
  {
    type: 'Voltage Swell',
    severity: 'Low',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    details: 'Voltage rose to 112% of nominal for 3 cycles',
  },
    {
    type: 'Voltage Sag',
    severity: 'High',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    details: 'Voltage dropped to 70% of nominal for 8 cycles',
  },
];

export const healthIndex = {
    value: 72, // Example value for "High Risk"
    contributors: {
      thdLevel: { value: 'High', impact: 40 },
      voltageStability: { value: 'Moderate', impact: 30 },
      faultFrequency: { value: 'Low', impact: 20 },
      loadVariations: { value: 'High', impact: 10 },
    },
  };

  export const reportData = {
    summary: {
      avgThd: 4.1,
      totalDisturbances: 15,
      healthTrend: 'Stable',
    },
    voltage: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, value: 230 + Math.random() * 4 - 2 })),
    current: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, value: 15 + Math.random() * 2 - 1 })),
    thd: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, value: 3.5 + Math.random() * 2 - 1 })),
    faults: Array.from({ length: 30 }, (_, i) => ({ day: `Day ${i + 1}`, count: Math.floor(Math.random() * 3) })),
  };
