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
import { calculateHealthIndex, type HealthResult } from '@/lib/health-calculator';

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
  HarmV: number | string;
  HarmI: number | string;
  Status: string;
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
  const [health, setHealth] = useState<HealthResult | null>(null);

  useEffect(() => {
    const powerRef = ref(db, 'powerData');
    
    const unsubscribe = onValue(powerRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setLastUpdate(new Date());
        
        // Local health calculation directly in web app
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
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg font-medium animate-pulse text-muted-foreground">Connecting to PowerPulse Node...</p>
        </div>
      </div>
    );
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-success';
      case 'Good': return 'text-lime-500';
      case 'Moderate': return 'text-warning';
      case 'Poor': return 'text-orange-500';
      case 'Critical': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">System Console</h1>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 rounded-full">
            <Clock className="h-3 w-3 sm:h-4 w-4" />
            Live: {lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Real-time telemetry and advanced power analysis.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className={cn("transition-all", (data?.Sag || 0) > 0 ? "bg-destructive/5 border-destructive/20" : "bg-card")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Voltage Sag</CardTitle>
            <ShieldAlert className={cn("h-4 w-4", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-lg sm:text-xl font-black tabular-nums", (data?.Sag || 0) > 0 ? "text-destructive" : "text-muted-foreground")}>
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
            <div className={cn("text-lg sm:text-xl font-black tabular-nums", (data?.Swell || 0) > 0 ? "text-orange-500" : "text-muted-foreground")}>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Voltage" value={data?.Vrms} unit="V" icon={Zap} />
        <StatCard title="Current" value={data?.Irms} unit="A" icon={Waves} />
        <StatCard title="Frequency" value={data?.Freq} unit="Hz" icon={Activity} />
        <StatCard title="Active Power" value={data?.ActivePower} unit="W" icon={TrendingUp} />
        <StatCard title="Reactive" value={data?.ReactivePower} unit="VAR" icon={Gauge} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Voltage THD" value={data?.THDv} unit="%" icon={Activity} />
        <StatCard title="Current THD" value={data?.THDi} unit="%" icon={Activity} />
        <StatCard title="Dom. V Harm" value={data?.HarmV} unit="" icon={Waves} />
        <StatCard title="Dom. I Harm" value={data?.HarmI} unit="" icon={Waves} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg">Telemetry Stream</CardTitle>
            <CardDescription>Live waveform analysis for Vrms and Irms.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="time" hide />
                <YAxis yAxisId="left" orientation="left" domain={['auto', 'auto']} stroke="hsl(var(--primary))" tick={{fontSize: 10}} />
                <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} stroke="hsl(var(--accent))" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="current" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Health Index</CardTitle>
            <CardDescription>Algorithm-derived health metric.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 py-8">
            {health && (
              <>
                <div className="relative flex items-center justify-center">
                  <svg className="h-28 w-28 sm:h-40 sm:w-40 -rotate-90">
                    <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="50%" cy="50%" r="42%" fill="transparent" stroke="currentColor" strokeWidth="8"
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * (100 - health.healthIndex)) / 100}
                      strokeLinecap="round"
                      className={cn("transition-all duration-1000", getHealthColor(health.status))}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl sm:text-4xl font-black">{Math.round(100 - health.healthIndex)}%</span>
                    <span className={cn("text-[10px] sm:text-xs font-bold uppercase tracking-widest", getHealthColor(health.status))}>
                      {health.status}
                    </span>
                  </div>
                </div>
                <div className="text-center px-4">
                   <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
                     <span className="text-foreground font-semibold">Diagnosis:</span> {health.topContributor}
                   </p>
                </div>
              </>
            )}
            <div className="w-full mt-auto">
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
    <Card className="overflow-hidden border-none shadow-none bg-muted/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1">
        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate mr-2">{title}</CardTitle>
        <Icon className="h-3 w-3 text-primary/60 shrink-0" />
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="text-lg sm:text-xl font-bold tabular-nums">
          {displayValue}
          {unit && <span className="ml-1 text-[10px] font-medium text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
