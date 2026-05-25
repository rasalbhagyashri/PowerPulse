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
import { Waves, ShieldAlert, AlertTriangle, Info } from 'lucide-react';

interface QualityData {
  THDv: number;
  THDi: number;
  Sag: number;
  Swell: number;
  HarmV: number | string;
  status: string;
}

function MetricCard({ title, value, unit = "%" }: { title: string; value: number | string; unit?: string }) {
  const getColor = (val: number) => {
    if (val < 5) return 'text-green-400';
    if (val < 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const numericValue = typeof value === 'number' ? value : 0;
  const displayValue = typeof value === 'number' ? value.toFixed(2) : (value || '--');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn('text-4xl font-bold', typeof value === 'number' ? getColor(numericValue) : 'text-primary')}>
          {displayValue}{unit}
        </p>
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
    <div className="flex flex-col gap-8 py-4 px-4 md:px-8">
      <div>
        <h1 className="text-3xl font-bold">Power Quality</h1>
        <p className="text-muted-foreground">
          Real-time harmonic distortion and transient analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Voltage THD" value={data?.THDv || 0} />
        <MetricCard title="Current THD" value={data?.THDi || 0} />
        <MetricCard title="Dominant Voltage Harmonics" value={data?.HarmV || 0} unit="" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={cn("transition-colors", (data?.Sag || 0) > 0 ? "bg-destructive/10 border-destructive/50" : "bg-card")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Voltage Sag</CardTitle>
            <ShieldAlert className={cn("h-5 w-5", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-xl font-bold", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")}>
              {data?.Sag ? `${data.Sag} EVENT${data.Sag > 1 ? 'S' : ''} DETECTED` : '0 EVENTS DETECTED'}
            </div>
          </CardContent>
        </Card>

        <Card className={cn("transition-colors", (data?.Swell || 0) > 0 ? "bg-orange-500/10 border-orange-500/50" : "bg-card")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Voltage Swell</CardTitle>
            <AlertTriangle className={cn("h-5 w-5", (data?.Swell || 0) > 0 ? "text-orange-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-xl font-bold", (data?.Swell || 0) > 0 ? "text-orange-500" : "text-muted-foreground")}>
              {data?.Swell ? `${data.Swell} EVENT${data.Swell > 1 ? 'S' : ''} DETECTED` : '0 EVENTS DETECTED'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Info className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold uppercase text-primary">
              {data?.status || 'NORMAL'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Harmonic Profile</CardTitle>
          <CardDescription>Voltage vs Current Total Harmonic Distortion analysis</CardDescription>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center border-t pt-6">
           <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
             <Waves className="h-8 w-8 opacity-20" />
             <p className="text-sm">Waveform analysis data is streaming from database...</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}