'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { ref, onValue } from 'firebase/database';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Waves, ShieldAlert, AlertTriangle, Info, Activity } from 'lucide-react';

interface QualityData {
  THDv: number;
  THDi: number;
  Sag: number;
  Swell: number;
  HarmV: number | string;
  HarmI: number | string;
  Status: string;
}

function MetricCard({ title, value, unit = "%", icon: Icon }: { title: string; value: number | string; unit?: string; icon: any }) {
  const getColor = (val: number) => {
    if (val < 5) return 'text-success';
    if (val < 8) return 'text-warning';
    return 'text-destructive';
  };

  const numericValue = typeof value === 'number' ? value : 0;
  const displayValue = typeof value === 'number' ? value.toFixed(2) : (value || '--');

  return (
    <Card className="bg-muted/20 border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary/40" />
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl sm:text-3xl font-black tabular-nums', typeof value === 'number' ? getColor(numericValue) : 'text-primary')}>
          {displayValue}<span className="text-xs sm:text-sm ml-0.5 opacity-70 font-medium">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function QualityPage() {
  const [data, setData] = useState<QualityData | null>(null);

  useEffect(() => {
    const powerRef = ref(db, 'powerData');
    const unsubscribe = onValue(powerRef, (snapshot) => {
      setData(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Power Quality</h1>
        <p className="text-sm text-muted-foreground">Real-time harmonic distortion and transient waveform analysis.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Voltage THD" value={data?.THDv || 0} icon={Activity} />
        <MetricCard title="Current THD" value={data?.THDi || 0} icon={Activity} />
        <MetricCard title="Dom. V Harm" value={data?.HarmV || 0} unit="" icon={Waves} />
        <MetricCard title="Dom. I Harm" value={data?.HarmI || 0} unit="" icon={Waves} />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className={cn("transition-all", (data?.Sag || 0) > 0 ? "bg-destructive/5 border-destructive/20" : "bg-card")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Voltage Sag</CardTitle>
            <ShieldAlert className={cn("h-4 w-4", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-lg sm:text-xl font-black", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")}>
              {data?.Sag || 0} EVENTS
            </div>
          </CardContent>
        </Card>

        <Card className={cn("transition-all", (data?.Swell || 0) > 0 ? "bg-orange-500/5 border-orange-500/20" : "bg-card")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Voltage Swell</CardTitle>
            <AlertTriangle className={cn("h-4 w-4", (data?.Swell || 0) > 0 ? "text-orange-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-lg sm:text-xl font-black", (data?.Swell || 0) > 0 ? "text-orange-500" : "text-muted-foreground")}>
              {data?.Swell || 0} EVENTS
            </div>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1 border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-primary">System Status</CardTitle>
            <Info className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-xl font-black uppercase text-primary">
              {data?.Status || 'NORMAL'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Harmonic Profile Analysis</CardTitle>
          <CardDescription>Streaming frequency-domain data from Firebase RTDB.</CardDescription>
        </CardHeader>
        <CardContent className="h-48 sm:h-64 flex items-center justify-center border-t">
           <div className="flex flex-col items-center gap-4 text-center text-muted-foreground max-w-xs">
             <Waves className="h-10 w-10 opacity-10 animate-pulse" />
             <p className="text-xs sm:text-sm font-medium leading-relaxed">Waveform data is actively streaming. Analyzing spectral components for potential nonlinear load impacts...</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
