'use client';
import { GaugeChart } from '@/components/charts/gauge-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { healthIndex } from '@/lib/data';
import { BarChart, Hand, Waves, Zap } from 'lucide-react';

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function HealthPage() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <h1 className="text-3xl font-bold">Device Health Index</h1>
        <p className="text-muted-foreground">
          An AI-calculated metric representing the overall health of the
          monitored equipment.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GaugeChart
            value={healthIndex.value}
            label="Health Index"
            description="Risk Appetite / Health Index"
            unit="Index"
          />
        </div>
        <div className="flex flex-col justify-center gap-4">
            <h3 className="text-lg font-semibold">Contributing Factors</h3>
          <ContributorCard
            title="THD Level"
            value={healthIndex.contributors.thdLevel.value}
            icon={Waves}
          />
          <ContributorCard
            title="Voltage Stability"
            value={healthIndex.contributors.voltageStability.value}
            icon={Zap}
          />
          <ContributorCard
            title="Fault Frequency"
            value={healthIndex.contributors.faultFrequency.value}
            icon={Hand}
          />
          <ContributorCard
            title="Load Variations"
            value={healthIndex.contributors.loadVariations.value}
            icon={BarChart}
          />
        </div>
      </div>
    </div>
  );
}
