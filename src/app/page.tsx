import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 gradient-background">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="flex items-center gap-4">
          <Icons.logo className="h-16 w-16 text-primary" />
          <div className="h-12 w-px bg-border"></div>
          <Icons.college className="h-14 w-14" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Power Monitoring and Filtering System
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Monitor, analyze, and ensure the quality of your power.
          </p>
        </div>
        <Button asChild size="lg" className="font-semibold">
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
