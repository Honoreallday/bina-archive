"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Eye, Film, Image as ImageIcon, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

const allCollections = [
  { id: "shorts", label: "Shorts" },
  { id: "installations", label: "Installations" },
  { id: "documentary", label: "Documentary" },
  { id: "2020-2024", label: "2020-2024" },
]

function secondsToDuration(seconds: number | null): string {
  if (!seconds) return ""
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  return `${m}:${String(s).padStart(2, "0")}`
}

function parseDurationToSeconds(duration: string): number | null {
  const parts = duration.trim().split(":").map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

export default function EditFilmPage() {
  const params = useParams()
  const router = useRouter()
  const filmId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [slug, setSlug] = useState("")
  const [metadata, setMetadata] = useState({
    title: "",
    year: "",
    duration: "",
    description: "",
    director: "",
  })
  const [published, setPublished] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    async function fetchFilm() {
      try {
        const res = await fetch(`${API_URL}/api/admin/films/${filmId}`, {
          headers: authHeaders(),
        })
        if (!res.ok) throw new Error(`${res.status}`)
        const film = await res.json()
        setSlug(film.slug ?? "")
        setMetadata({
          title: film.title ?? "",
          year: film.year ? String(film.year) : "",
          duration: secondsToDuration(film.duration_seconds),
          description: film.description ?? "",
          director: film.director ?? "",
        })
        setPublished(film.published ?? false)
        setSelectedCollections(Array.isArray(film.tags) ? film.tags : [])
      } catch {
        setError("Failed to load film.")
      } finally {
        setLoading(false)
      }
    }
    fetchFilm()
  }, [filmId])

  const toggleCollection = (id: string) => {
    setSelectedCollections(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${filmId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          title: metadata.title,
          year: metadata.year ? Number(metadata.year) : null,
          director: metadata.director,
          description: metadata.description,
          tags: selectedCollections.length > 0 ? selectedCollections : null,
          duration_seconds: parseDurationToSeconds(metadata.duration),
          published,
        }),
      })
      if (!res.ok) throw new Error("Save failed")
      router.push("/admin/films")
    } catch {
      setSaveError("Failed to save changes.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this film? This cannot be undone.")) return
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${filmId}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
      router.push("/admin/films")
    } catch {
      setSaveError("Failed to delete film.")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/films">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to films</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Edit Film</h1>
            <p className="text-muted-foreground text-sm">
              ID: {filmId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {slug && (
            <Button variant="outline" asChild>
              <Link href={`/films/${slug}`} target="_blank">
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {saveError && (
        <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {saveError}
        </div>
      )}

      {/* Status Toggle */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Publication Status</CardTitle>
          <CardDescription>Control the visibility of this film</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPublished(false)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${!published
                  ? "bg-secondary text-foreground ring-2 ring-muted-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }
              `}
            >
              Draft
            </button>
            <button
              onClick={() => setPublished(true)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${published
                  ? "bg-accent text-accent-foreground ring-2 ring-accent"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }
              `}
            >
              Published
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Film File */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Film className="h-5 w-5 text-accent" />
              Film File
            </CardTitle>
            <CardDescription>Current video file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Film className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">film-{filmId}.mp4</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Replace File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-accent" />
              Thumbnail
            </CardTitle>
            <CardDescription>Cover image for the film</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No thumbnail</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Upload Thumbnail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Metadata</CardTitle>
          <CardDescription>Film information and details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                value={metadata.title}
                onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Film title"
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium text-foreground">
                  Year
                </label>
                <Input
                  id="year"
                  value={metadata.year}
                  onChange={(e) => setMetadata(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2024"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium text-foreground">
                  Duration
                </label>
                <Input
                  id="duration"
                  value={metadata.duration}
                  onChange={(e) => setMetadata(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="12:34"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the film..."
              rows={4}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="director" className="text-sm font-medium text-foreground">
              Director
            </label>
            <Input
              id="director"
              value={metadata.director}
              onChange={(e) => setMetadata(prev => ({ ...prev, director: e.target.value }))}
              placeholder="Director's name"
              className="bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Collections */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Collections</CardTitle>
          <CardDescription>Assign this film to collections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allCollections.map((collection) => {
              const isSelected = selectedCollections.includes(collection.id)
              return (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => toggleCollection(collection.id)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                    ${isSelected
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                    }
                  `}
                >
                  {isSelected && <Check className="h-4 w-4" />}
                  {collection.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive/50">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Delete this film</p>
              <p className="text-sm text-muted-foreground">
                Once deleted, this film cannot be recovered.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Film
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
