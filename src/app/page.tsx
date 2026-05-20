import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap, Activity, Waves, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/10">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PowerPulse</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm">
              <Link href="/dashboard">Launch Console</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="container relative z-10 flex flex-col items-center text-center">
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium">
              Real-time ESP12-F Integration
            </Badge>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Power Monitoring and <span className="text-primary">Filtering System</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Advanced harmonic analysis and power quality monitoring. Powered by ESP12-F and Firebase for real-time electrical insights.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-12 px-8 font-semibold">
                <Link href="/dashboard">View Live Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 font-semibold">
                <Link href="/signup">Register Hardware</Link>
              </Button>
            </div>
          </div>
          <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        </section>

        <section className="border-t bg-secondary/30 py-24">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard 
                icon={Activity}
                title="Real-time Vrms/Irms"
                description="Instantaneous voltage and current monitoring with millisecond precision."
              />
              <FeatureCard 
                icon={Waves}
                title="THD Analysis"
                description="Total Harmonic Distortion breakdown for both voltage and current waveforms."
              />
              <FeatureCard 
                icon={ShieldCheck}
                title="Health Indexing"
                description="Proprietary algorithm calculating equipment lifecycle and operational risk."
              />
              <FeatureCard 
                icon={Zap}
                title="Sag/Swell Detection"
                description="Automatic alerts for under-voltage and over-voltage transient events."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 PowerPulse Engineering. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
              Documentation
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
              API
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
