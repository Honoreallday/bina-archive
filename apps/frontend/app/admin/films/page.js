'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authHeaders, clearToken } from '@/app/lib/auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AdminFilmsPage() {
  const router = useRouter();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchFilms(); }, []);

  async function fetchFilms() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/films`, { headers: authHeaders() });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) throw new Error('Failed to load films.');
      setFilms(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(film) {
    const res = await fetch(`${API_URL}/api/admin/films/${film.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ published: !film.published }),
    });
    if (res.status === 401) { router.push('/admin/login'); return; }
    if (!res.ok) return;
    const updated = await res.json();
    setFilms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
  }

  function handleSignOut() {
    clearToken();
    router.push('/admin/login');
  }

  return (
    <main className="min-h-screen p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-1">Admin</p>
            <h1 className="text-xl font-semibold tracking-tight">Films</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="sm">
              <Link href="/admin/upload">+ Upload</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
              Sign out
            </Button>
          </div>
        </header>

        <Separator className="mb-6" />

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : films.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No films yet.{' '}
            <Link href="/admin/upload" className="text-foreground underline underline-offset-2">
              Upload one.
            </Link>
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-20">Year</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-28 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {films.map((film) => (
                <TableRow key={film.id}>
                  <TableCell className="font-medium">{film.title}</TableCell>
                  <TableCell className="text-muted-foreground">{film.year ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={film.published ? 'default' : 'secondary'}>
                      {film.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(film)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {film.published ? 'Unpublish' : 'Publish'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
