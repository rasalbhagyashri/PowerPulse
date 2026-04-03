'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Zap,
  Waves,
  Gauge,
  Thermometer,
  Activity,
  BatteryCharging,
  Power,
  PowerOff,
} from 'lucide-react';
import { electricalParameters } from '@/lib/data';

type StatCardProps = {
  title: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  trendData: number[];
  chartType: 'area' | 'bar';
};

function StatCard({ title, value, unit, icon: Icon, trendData, chartType }: StatCardProps) {
  const chartData = trendData.map((val, i) => ({ index: i, value: val }));
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value.toLocaleString()} {unit}
        </div>
        <div className="h-20 w-full pt-4">
          <ChartContainer config={{}} className="h-full w-full">
            {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorValue)" strokeWidth={2} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator />} />
                </AreaChart>
            ) : (
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator />} />
                </BarChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Voltage (RMS)"
          value={electricalParameters.voltage.value}
          unit={electricalParameters.voltage.unit}
          icon={Zap}
          trendData={electricalParameters.voltage.trend}
          chartType="area"
        />
        <StatCard
          title="Current (RMS)"
          value={electricalParameters.current.value}
          unit={electricalParameters.current.unit}
          icon={Waves}
          trendData={electricalParameters.current.trend}
          chartType="area"
        />
        <StatCard
          title="Active Power"
          value={electricalParameters.activePower.value}
          unit={electricalParameters.activePower.unit}
          icon={Power}
          trendData={electricalParameters.activePower.trend}
          chartType="bar"
        />
        <StatCard
          title="Power Factor"
          value={electricalParameters.powerFactor.value}
          unit={electricalParameters.powerFactor.unit}
          icon={Gauge}
          trendData={electricalParameters.powerFactor.trend}
          chartType="area"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Reactive Power"
          value={electricalParameters.reactivePower.value}
          unit={electricalParameters.reactivePower.unit}
          icon={PowerOff}
          trendData={electricalParameters.reactivePower.trend}
          chartType="bar"
        />
        <StatCard
          title="Apparent Power"
          value={electricalParameters.apparentPower.value}
          unit={electricalParameters.apparentPower.unit}
          icon={Activity}
          trendData={electricalParameters.apparentPower.trend}
          chartType="bar"
        />
        <StatCard
          title="Frequency"
          value={electricalParameters.frequency.value}
          unit={electricalParameters.frequency.unit}
          icon={Thermometer}
          trendData={electricalParameters.frequency.trend}
          chartType="area"
        />
        <StatCard
          title="Energy Consumption"
          value={electricalParameters.energyConsumption.value}
          unit={electricalParameters.energyConsumption.unit}
          icon={BatteryCharging}
          trendData={electricalParameters.energyConsumption.trend}
          chartType="area"
        />
      </div>
    </div>
  );
}
