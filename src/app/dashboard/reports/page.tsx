'use client';
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
import { reportData } from '@/lib/data';
import { Download, TrendingUp, BarChart, AlertTriangle } from 'lucide-react';
import { Area, AreaChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

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

export default function ReportsPage() {
  const chartConfig = {
    value: {
      label: 'Value',
      color: 'hsl(var(--primary))',
    },
    count: {
        label: 'Count',
        color: 'hsl(var(--primary))',
    }
  };
  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">30-Day Performance Report</h1>
          <p className="text-muted-foreground">
            A summary of system performance over the last month.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <ReportStatCard title="Average THD" value={reportData.summary.avgThd} unit="%" icon={BarChart} />
        <ReportStatCard title="Total Disturbances" value={reportData.summary.totalDisturbances} unit="events" icon={AlertTriangle} />
        <ReportStatCard title="Health Trend" value={reportData.summary.healthTrend} unit="" icon={TrendingUp} />
      </div>

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
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} unit="V" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillVoltage)" />
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
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} unit="A" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillCurrent)" />
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
              <BarChart data={reportData.thd} margin={{ left: -20, right: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
                <YAxis yAxisId="left" orientation="left" unit="%" tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" dataKey="count" unit=" faults" domain={[0, 'dataMax + 2']} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="value" name="THD" fill="var(--color-value)" radius={4} />
                <Bar yAxisId="right" dataKey={(v, i) => reportData.faults[i].count} name="Faults" fill="hsl(var(--destructive))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

    </div>
  );
}
