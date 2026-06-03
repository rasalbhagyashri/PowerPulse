'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { ref, onValue } from 'firebase/database';
import { GaugeChart } from '@/components/charts/gauge-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { calculateHealthIndex, type HealthResult } from '@/lib/health-calculator';
import { BarChart, Hand, Waves, Zap, Activity } from 'lucide-react';

function ContributorCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="bg-muted/30 border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary/60" />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-lg font-black">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const powerRef = ref(db, 'powerData');
    const unsubscribe = onValue(powerRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const result = calculateHealthIndex({
          Vrms: val.Vrms || 0,
          Irms: val.Irms || 0,
          Freq: val.Freq || 0,
          ActivePower: val.ActivePower || 0,
          ReactivePower: val.ReactivePower || 0,
          PowerFactor: val.PowerFactor || 1,
          THDv: val.THDv || 0,
          THDi: val.THDi || 0,
        });
        setHealth(result);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Equipment Health Analysis</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Comprehensive AI diagnostics derived from live V/I waveforms, harmonic profiles, and power factor efficiency.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <GaugeChart
            value={health ? 100 - health.healthIndex : 0}
            label="Real-time Health Score"
            description="Overall reliability metric based on IEEE 519 and local standards."
            unit="%"
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1 px-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Contributors</h3>
            <p className="text-xs text-muted-foreground">Primary factors influencing index degradation.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <ContributorCard
              title="V-Distortion"
              value={health?.parameterContributions.find(c => c.name === 'Voltage THD')?.contribution + '%' || '--'}
              icon={Waves}
            />
            <ContributorCard
              title="Efficiency"
              value={health?.parameterContributions.find(c => c.name === 'Power Factor')?.contribution + '%' || '--'}
              icon={Zap}
            />
            <ContributorCard
              title="Reactive"
              value={health?.parameterContributions.find(c => c.name === 'Reactive Power')?.contribution + '%' || '--'}
              icon={BarChart}
            />
            <ContributorCard
              title="Voltage Reg"
              value={health?.parameterContributions.find(c => c.name === 'Voltage')?.contribution + '%' || '--'}
              icon={Activity}
            />
          </div>
          <Card className="border-primary/20 bg-primary/5 mt-auto">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold">Health Advisory</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               <p className="text-xs leading-relaxed font-medium">
                 {health?.topContributor || "Analyzing live telemetry for health insights..."}
               </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
