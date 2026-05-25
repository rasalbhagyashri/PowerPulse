'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { db } from '@/firebase/config';
import { ref, onValue } from 'firebase/database';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reportData } from '@/lib/data';
import { Download, TrendingUp, BarChart as BarChartIcon, AlertTriangle, History } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface EventLog {
  id: string;
  type: 'Voltage Sag' | 'Voltage Swell';
  timestamp: string;
}

export default function ReportsPage() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [lastSag, setLastSag] = useState<number>(-1);
  const [lastSwell, setLastSwell] = useState<number>(-1);

  // Monitor real-time events from Firebase
  useEffect(() => {
    const powerRef = ref(db, 'powerData');
    const unsubscribe = onValue(powerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // First initialization
        if (lastSag === -1) {
          setLastSag(data.Sag || 0);
          setLastSwell(data.Swell || 0);
          return;
        }

        // Check for new Sag events
        if (data.Sag > lastSag) {
          const newEvents: EventLog[] = [];
          for (let i = 0; i < data.Sag - lastSag; i++) {
            newEvents.push({
              id: `sag-${Date.now()}-${i}`,
              type: 'Voltage Sag',
              timestamp: new Date().toLocaleString(),
            });
          }
          setEvents(prev => [...newEvents, ...prev].slice(0, 50));
          setLastSag(data.Sag);
        }
        
        // Check for new Swell events
        if (data.Swell > lastSwell) {
          const newEvents: EventLog[] = [];
          for (let i = 0; i < data.Swell - lastSwell; i++) {
            newEvents.push({
              id: `swell-${Date.now()}-${i}`,
              type: 'Voltage Swell',
              timestamp: new Date().toLocaleString(),
            });
          }
          setEvents(prev => [...newEvents, ...prev].slice(0, 50));
          setLastSwell(data.Swell);
        }
      }
    });

    return () => unsubscribe();
  }, [lastSag, lastSwell]);

  const chartConfig = {
    value: {
      label: 'Metric',
      color: 'hsl(var(--primary))',
    },
    count: {
        label: 'Faults',
        color: 'hsl(var(--destructive))',
    }
  };

  // Memoized merged data for the combined chart
  const combinedThdFaultData = useMemo(() => {
    return reportData.thd.map((item, index) => ({
      day: item.day,
      thdValue: item.value,
      faultCount: reportData.faults[index]?.count ?? 0,
    }));
  }, []);

  return (
    <div className="flex flex-col gap-8 py-4 px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">System Reports</h1>
          <p className="text-muted-foreground">
            Real-time event tracking and historical performance analysis.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <ReportStatCard title="Average THD" value={reportData.summary.avgThd} unit="%" icon={BarChartIcon} />
        <ReportStatCard title="Total Disturbances" value={reportData.summary.totalDisturbances} unit="events" icon={AlertTriangle} />
        <ReportStatCard title="Health Trend" value={reportData.summary.healthTrend} unit="" icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Event History Log</CardTitle>
            <CardDescription>Live monitoring of voltage disturbances</CardDescription>
          </div>
          <History className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic">
                      No events detected in current session. Monitoring active...
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        <span className={event.type === 'Voltage Sag' ? 'text-destructive font-bold' : 'text-orange-500 font-bold'}>
                          {event.type}
                        </span>
                      </TableCell>
                      <TableCell>{event.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Recorded
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voltage Trend</CardTitle>
            <CardDescription>Daily average voltage (RMS) over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={reportData.voltage} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="fillVoltage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} unit="V" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#fillVoltage)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Trend</CardTitle>
            <CardDescription>Daily average current (RMS) over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={reportData.current} margin={{ left: -20, right: 10 }}>
                 <defs>
                  <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} unit="A" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" fill="url(#fillCurrent)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>THD & Fault Occurrences</CardTitle>
            <CardDescription>Daily average Total Harmonic Distortion and fault counts.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={combinedThdFaultData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
                <YAxis yAxisId="left" orientation="left" unit="%" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" unit=" flt" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="thdValue" name="THD" fill="hsl(var(--primary))" radius={4} />
                <Bar yAxisId="right" dataKey="faultCount" name="Faults" fill="hsl(var(--destructive))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

    </div>
  );
}

function ReportStatCard({ title, value, unit, icon: Icon }: { title: string, value: string | number, unit: string, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value} <span className="text-sm text-muted-foreground">{unit}</span></div>
            </CardContent>
        </Card>
    )
}
