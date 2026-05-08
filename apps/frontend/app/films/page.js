import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getFilms() {
  const res = await fetch(`${API_URL}/api/films`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch films');
  return res.json();
}

export const metadata = {
  title: 'Films — Bina Archive',
};

export default async function FilmsPage() {
  const films = await getFilms();

  return (
    <main className="min-h-screen p-8 md:p-16">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Bina Archive
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-3">Films</h1>
          <p className="text-sm text-muted-foreground mt-1">{films.length} {films.length === 1 ? 'film' : 'films'} in the archive</p>
        </header>

        <Separator className="mb-6" />

        {films.length === 0 ? (
          <p className="text-muted-foreground text-sm">No films available yet.</p>
        ) : (
          <ul className="space-y-0">
            {films.map((film, i) => (
              <li key={film.id}>
                <Link
                  href={`/films/${film.id}`}
                  className="flex items-start justify-between py-5 gap-4 hover:opacity-80 transition-opacity group"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium text-sm group-hover:underline underline-offset-2 truncate">
                      {film.title}
                    </span>
                    {film.director && (
                      <span className="text-xs text-muted-foreground">dir. {film.director}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    {film.year && (
                      <span className="text-xs text-muted-foreground">{film.year}</span>
                    )}
                    {film.genre && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {film.genre}
                      </Badge>
                    )}
                  </div>
                </Link>
                {i < films.length - 1 && <Separator />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
