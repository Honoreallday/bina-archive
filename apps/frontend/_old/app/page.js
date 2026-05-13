import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-8 md:p-16">
      <header>
        <span className="text-sm text-muted-foreground tracking-widest uppercase">
          Bina Archive
        </span>
      </header>

      <section className="max-w-lg">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4">
          A film archive for the midwest.
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Streaming and preserving independent and documentary films from the midwest region.
        </p>
        <Button asChild size="lg">
          <Link href="/films">Browse the archive</Link>
        </Button>
      </section>

      <footer className="text-xs text-muted-foreground">
        <Separator className="mb-4" />
        © {new Date().getFullYear()} Bina Archive
      </footer>
    </main>
  );
}
