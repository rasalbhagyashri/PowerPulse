'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { ref, onValue } from 'firebase/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Zap, 
  Waves, 
  Activity, 
  ShieldAlert, 
  Clock,
  TrendingUp,
  AlertTriangle,
  Info,
  Gauge,
  HeartPulse
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface PowerData {
  Vrms: number;
  Irms: number;
  Freq: number;
  Sag: number;
  Swell: number;
  ActivePower: number;
  ReactivePower: number;
  THDi: number;
  THDv: number;
  PowerFactor: number;
  HealthIndex: number;
  HarmV: number | string;
  HarmI: number | string;
  status: string;
}

interface HistoryItem {
  time: string;
  voltage: number;
  current: number;
}

export default function Dashboard() {
  const [data, setData] = useState<PowerData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const powerRef = ref(db, 'powerData');
    
    const unsubscribe = onValue(powerRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setLastUpdate(new Date());
        
        setHistory(prev => {
          const newItem = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            voltage: val.Vrms || 0,
            current: val.Irms || 0,
          };
          const newHistory = [...prev, newItem].slice(-20);
          return newHistory;
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium animate-pulse">Connecting to PowerPulse Cloud...</p>
        </div>
      </div>
    );
  }

  const getHealthStatus = (index: number) => {
    if (index >= 80) return { label: 'Excellent', color: 'text-success' };
    if (index >= 60) return { label: 'Good', color: 'text-warning' };
    return { label: 'Critical', color: 'text-destructive' };
  };

  const healthStatus = data ? getHealthStatus(data.HealthIndex || 0) : null;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Console</h1>
          <p className="text-muted-foreground">Real-time Telemetry: Active Monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          <Clock className="h-4 w-4" />
          Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn("transition-colors", (data?.Sag || 0) > 0 ? "bg-destructive/10 border-destructive/50" : "bg-card")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Voltage Sag</CardTitle>
            <ShieldAlert className={cn("h-5 w-5", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-xl font-bold uppercase", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")}>
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
            <div className={cn("text-xl font-bold uppercase", (data?.Swell || 0) > 0 ? "text-orange-500" : "text-muted-foreground")}>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Voltage" value={data?.Vrms} unit="V" icon={Zap} />
        <StatCard title="Current" value={data?.Irms} unit="A" icon={Waves} />
        <StatCard title="Frequency" value={data?.Freq} unit="Hz" icon={Activity} />
        <StatCard title="Active Power" value={data?.ActivePower} unit="W" icon={TrendingUp} />
        <StatCard title="Reactive" value={data?.ReactivePower} unit="VAR" icon={Gauge} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Voltage THD" value={data?.THDv} unit="%" icon={Activity} />
        <StatCard title="Current THD" value={data?.THDi} unit="%" icon={Activity} />
        <StatCard title="Dom. Voltage Harmonics" value={data?.HarmV} unit="" icon={Waves} />
        <StatCard title="Dom. Current Harmonics" value={data?.HarmI} unit="" icon={Waves} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Telemetry Stream</CardTitle>
            <CardDescription>Vrms and Irms real-time trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="time" hide />
                <YAxis yAxisId="left" orientation="left" domain={['auto', 'auto']} stroke="hsl(var(--primary))" />
                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} stroke="hsl(var(--accent))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="current" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Health Index</CardTitle>
            <CardDescription>Equipment reliability calculation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-6">
            <div className="relative flex items-center justify-center">
              <svg className="h-32 w-32 -rotate-90">
                <circle cx="64" cy="64" r="58" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * (data?.HealthIndex || 0)) / 100}
                  className={cn("transition-all duration-1000", healthStatus?.color)}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold">{data?.HealthIndex || 0}%</span>
                <span className={cn("text-xs font-semibold", healthStatus?.color)}>
                  {healthStatus?.label}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 w-full gap-2">
               <StatCard title="Power Factor" value={data?.PowerFactor} unit="" icon={Gauge} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon: Icon }: { title: string; value?: number | string; unit: string; icon: any }) {
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
    : value || '--';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-4">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary opacity-70" />
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold">
          {displayValue}
          {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
