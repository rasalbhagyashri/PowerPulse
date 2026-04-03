'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { disturbances, powerQuality, type Disturbance } from '@/lib/data';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const severityMap: Record<Disturbance['severity'], string> = {
  Low: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
  High: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
};

function THDCard({ title, value }: { title: string; value: number }) {
  const getTHDColor = (val: number) => {
    if (val < 5) return 'text-green-400';
    if (val < 8) return 'text-yellow-400';
    return 'text-red-400';
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn('text-4xl font-bold', getTHDColor(value))}>
          {value.toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  );
}

export default function QualityPage() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <h1 className="text-3xl font-bold">Power Quality</h1>
        <p className="text-muted-foreground">
          Monitor and analyze power disturbances and harmonic distortion.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <THDCard title="Voltage THD" value={powerQuality.voltageTHD} />
        <THDCard title="Current THD" value={powerQuality.currentTHD} />
        <THDCard title="Total THD" value={powerQuality.totalTHD} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Disturbances</CardTitle>
          <CardDescription>
            A log of recent power quality events detected by the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disturbances.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{d.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(severityMap[d.severity])}>
                      {d.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(d.timestamp), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>{d.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
