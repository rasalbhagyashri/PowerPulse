'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Cell } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type GaugeChartProps = {
  value: number;
  label: string;
  description: string;
  unit: string;
};

export function GaugeChart({ value, label, description, unit }: GaugeChartProps) {
  const chartData = [{ name: 'value', value: value, fill: 'hsl(var(--primary))' }];
  const chartConfig = {
    value: {
      label: 'Value',
    },
  } satisfies ChartConfig;

  const total = 100;
  const fillValue = (value / total) * 100;
  
  // Define colors for different risk levels
  const getColor = (val: number) => {
    if (val <= 20) return 'hsl(var(--success))'; // Very Low
    if (val <= 40) return 'hsl(100, 50%, 50%)'; // Low
    if (val <= 60) return 'hsl(var(--warning))'; // Medium
    if (val <= 80) return 'hsl(20, 100%, 50%)'; // High
    return 'hsl(var(--destructive))'; // Very High
  };
  
  const riskColor = getColor(value);

  const getRiskLabel = (val: number) => {
    if (val <= 20) return 'Very Low';
    if (val <= 40) return 'Low';
    if (val <= 60) return 'Medium';
    if (val <= 80) return 'High';
    return 'Very High';
  }

  const riskLabel = getRiskLabel(value);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={90}
              outerRadius={120}
              startAngle={225}
              endAngle={-45}
              cx="50%"
              cy="50%"
              strokeWidth={0}
            >
               <Cell key="value" fill={riskColor} />
               <Cell key="background" fill="hsl(var(--muted) / 0.5)" />
               <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <>
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-5xl font-bold"
                        >
                          {value.toFixed(0)}
                        </text>
                        <text
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 25}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-muted-foreground text-lg"
                        >
                          {unit}
                        </text>
                         <text
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 55}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-foreground text-xl font-semibold"
                          style={{ fill: riskColor }}
                        >
                          {riskLabel} Risk
                        </text>
                      </>
                    );
                  }
                }}
              />
            </Pie>
             {/* Background Arc */}
             <Pie
              data={[{ name: 'background', value: total }]}
              dataKey="value"
              nameKey="name"
              innerRadius={90}
              outerRadius={120}
              startAngle={225}
              endAngle={-45}
              cx="50%"
              cy="50%"
              strokeWidth={0}
              fill="hsl(var(--muted) / 0.5)"
              className="pointer-events-none"
            >
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
