import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VideoPlayer from '@/app/components/VideoPlayer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function getFilm(id) {
  const res = await fetch(`${API_URL}/api/films/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch film');
  return res.json();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const film = await getFilm(id);
  if (!film) return { title: 'Film Not Found — Bina Archive' };
  return { title: `${film.title} — Bina Archive` };
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default async function FilmPage({ params }) {
  const { id } = await params;
  const film = await getFilm(id);

  if (!film) notFound();

  return (
    <main className="min-h-screen p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <VideoPlayer hlsUrl={film.hls_url} />

        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">{film.title}</h1>

            <div className="flex flex-wrap gap-2 items-center">
              {film.year && (
                <Badge variant="outline">{film.year}</Badge>
              )}
              {film.genre && (
                <Badge variant="outline">{film.genre}</Badge>
              )}
              {film.duration_seconds && (
                <Badge variant="outline">{formatDuration(film.duration_seconds)}</Badge>
              )}
            </div>
          </div>

          {film.director && (
            <p className="text-sm text-muted-foreground">
              Directed by <span className="text-foreground">{film.director}</span>
            </p>
          )}

          {film.description && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground leading-relaxed">{film.description}</p>
            </>
          )}
        </div>

        <Link
          href="/films"
          className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← All films
        </Link>
      </div>
    </main>
  );
}
