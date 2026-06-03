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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface EventLog {
  id: string;
  type: 'Voltage Sag' | 'Voltage Swell';
  timestamp: string;
}

export default function ReportsPage() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [lastSag, setLastSag] = useState<number | null>(null);
  const [lastSwell, setLastSwell] = useState<number | null>(null);

  useEffect(() => {
    const powerRef = ref(db, 'powerData');
    const unsubscribe = onValue(powerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (lastSag === null) {
          setLastSag(data.Sag || 0);
          setLastSwell(data.Swell || 0);
          return;
        }

        if (data.Sag > lastSag) {
          const count = data.Sag - lastSag;
          const newEntries: EventLog[] = Array.from({ length: count }).map((_, i) => ({
            id: `sag-${Date.now()}-${i}`,
            type: 'Voltage Sag',
            timestamp: new Date().toLocaleString(),
          }));
          setEvents(prev => [...newEntries, ...prev].slice(0, 50));
          setLastSag(data.Sag);
        }

        if (data.Swell > lastSwell) {
          const count = data.Swell - lastSwell;
          const newEntries: EventLog[] = Array.from({ length: count }).map((_, i) => ({
            id: `swell-${Date.now()}-${i}`,
            type: 'Voltage Swell',
            timestamp: new Date().toLocaleString(),
          }));
          setEvents(prev => [...newEntries, ...prev].slice(0, 50));
          setLastSwell(data.Swell);
        }
      }
    });

    return () => unsubscribe();
  }, [lastSag, lastSwell]);

  const combinedThdFaultData = useMemo(() => {
    return reportData.thd.map((item, index) => ({
      day: item.day,
      thdValue: item.value,
      faultCount: reportData.faults[index]?.count ?? 0,
    }));
  }, []);

  const chartConfig = {
    thdValue: { label: 'THD (%)', color: 'hsl(var(--primary))' },
    faultCount: { label: 'Faults', color: 'hsl(var(--destructive))' }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">System Reports</h1>
          <p className="text-sm text-muted-foreground">Historical analysis and real-time transient recording.</p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export session
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <ReportStatCard title="Avg THD" value={reportData.summary.avgThd} unit="%" icon={BarChartIcon} />
        <ReportStatCard title="Disturbances" value={reportData.summary.totalDisturbances} unit="cnt" icon={AlertTriangle} />
        <ReportStatCard title="Health Trend" value={reportData.summary.healthTrend} unit="" icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Event History Log</CardTitle>
            <CardDescription className="text-xs">Real-time recording of detected transient events.</CardDescription>
          </div>
          <History className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase font-bold">Type</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Timestamp</TableHead>
                  <TableHead className="text-right text-xs uppercase font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic text-xs">
                      No events detected in this session. Monitoring active...
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-bold py-3 text-xs sm:text-sm">
                        <span className={event.type === 'Voltage Sag' ? 'text-destructive' : 'text-orange-500'}>
                          {event.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap">{event.timestamp}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[10px] font-bold h-5 uppercase">Logged</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">THD & Fault Analytics</CardTitle>
          <CardDescription className="text-xs">Daily performance metrics across a 30-day window.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[350px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={combinedThdFaultData} margin={{ left: -20, right: 10 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} hide={false} />
                  <YAxis yAxisId="left" orientation="left" unit="%" tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" unit=" flt" tickLine={false} axisLine={false} tick={{fontSize: 10}} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="thdValue" name="THD" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="faultCount" name="Faults" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportStatCard({ title, value, unit, icon: Icon }: { title: string, value: string | number, unit: string, icon: React.ElementType }) {
    return (
        <Card className="bg-muted/30 border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4 pb-2">
                <CardTitle className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
                <Icon className="h-3 w-3 sm:h-4 w-4 text-primary/60" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
                <div className="text-lg sm:text-2xl font-black tabular-nums">{value} <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{unit}</span></div>
            </CardContent>
        </Card>
    )
}
