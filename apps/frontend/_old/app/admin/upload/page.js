'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authHeaders } from '@/app/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const INITIAL_FIELDS = {
  title: '',
  year: '',
  director: '',
  description: '',
  genre: '',
  tags: '',
  duration_seconds: '',
};

export default function AdminUploadPage() {
  const router = useRouter();
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ phase: 'idle', message: '' });

  function set(key) {
    return (e) => setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file) { setStatus({ phase: 'error', message: 'Select a video file.' }); return; }
    if (!fields.title) { setStatus({ phase: 'error', message: 'Title is required.' }); return; }

    try {
      setStatus({ phase: 'uploading', message: 'Requesting upload URL…' });

      const urlRes = await fetch(`${API_URL}/api/admin/upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });

      if (urlRes.status === 401) { router.push('/admin/login'); return; }
      if (!urlRes.ok) throw new Error('Failed to get upload URL.');

      const { url, key } = await urlRes.json();

      setStatus({ phase: 'uploading', message: 'Uploading to S3…' });

      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('S3 upload failed.');

      setStatus({ phase: 'saving', message: 'Saving film record…' });

      const filmRes = await fetch(`${API_URL}/api/admin/films`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          rawKey: key,
          title: fields.title,
          year: fields.year ? Number(fields.year) : null,
          director: fields.director || null,
          description: fields.description || null,
          genre: fields.genre || null,
          tags: fields.tags || null,
          duration_seconds: fields.duration_seconds ? Number(fields.duration_seconds) : null,
        }),
      });

      if (!filmRes.ok) throw new Error('Failed to save film record.');

      setStatus({ phase: 'done', message: 'Upload complete. MediaConvert is processing the file.' });
      setFields(INITIAL_FIELDS);
      setFile(null);
    } catch (err) {
      setStatus({ phase: 'error', message: err.message });
    }
  }

  const busy = status.phase === 'uploading' || status.phase === 'saving';

  return (
    <main className="min-h-screen p-8 md:p-16">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold tracking-tight">Upload Film</h1>
          <Link href="/admin/films" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← All films
          </Link>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Film details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title <span className="text-muted-foreground">(required)</span></Label>
                <Input id="title" value={fields.title} onChange={set('title')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" value={fields.year} onChange={set('year')} min="1888" max="2099" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input id="duration" type="number" value={fields.duration_seconds} onChange={set('duration_seconds')} min="1" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="director">Director</Label>
                <Input id="director" value={fields.director} onChange={set('director')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" value={fields.genre} onChange={set('genre')} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" value={fields.tags} onChange={set('tags')} placeholder="documentary, chicago" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={fields.description} onChange={set('description')} rows={4} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="video">Video file <span className="text-muted-foreground">(required)</span></Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files[0] || null)}
                  className="cursor-pointer"
                />
                {file && (
                  <p className="text-xs text-muted-foreground">
                    {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>

              {status.message && (
                <p className={`text-sm ${
                  status.phase === 'error' ? 'text-destructive'
                  : status.phase === 'done' ? 'text-green-400'
                  : 'text-muted-foreground'
                }`}>
                  {status.message}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? status.message : 'Upload'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
