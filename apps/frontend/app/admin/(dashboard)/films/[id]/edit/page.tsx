"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Eye, Film, Image, X, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Placeholder data - replace with real data fetch
const getFilmData = (id: string) => ({
  id,
  title: "Untitled Film #12",
  year: "2024",
  duration: "12:34",
  description: "A contemplative piece exploring the boundaries between digital and physical spaces.",
  credits: "Director: Artist Name\nCinematography: Camera Person\nSound: Audio Designer",
  status: "Published",
  collections: ["Shorts", "2020-2024"],
  thumbnail: null as string | null,
  stills: [] as string[],
})

const allCollections = [
  { id: "shorts", label: "Shorts" },
  { id: "installations", label: "Installations" },
  { id: "documentary", label: "Documentary" },
  { id: "2020-2024", label: "2020-2024" },
]

export default function EditFilmPage() {
  const params = useParams()
  const router = useRouter()
  const filmId = params.id as string

  // Load film data
  const initialData = getFilmData(filmId)

  const [metadata, setMetadata] = useState({
    title: initialData.title,
    year: initialData.year,
    duration: initialData.duration,
    description: initialData.description,
    credits: initialData.credits,
  })

  const [status, setStatus] = useState(initialData.status)
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialData.collections.map(c => c.toLowerCase().replace(" ", "-"))
  )
  const [isSaving, setIsSaving] = useState(false)

  const toggleCollection = (id: string) => {
    setSelectedCollections(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Changes saved successfully!")
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this film? This action cannot be undone.")) {
      // Handle delete
      router.push("/admin/films")
    }
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
          <Button variant="outline" asChild>
            <Link href={`/films/${filmId}`} target="_blank">
              <Eye className="h-4 w-4" />
              Preview
            </Link>
          </Button>
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

      {/* Status Toggle */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Publication Status</CardTitle>
          <CardDescription>Control the visibility of this film</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStatus("Draft")}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${status === "Draft"
                  ? "bg-secondary text-foreground ring-2 ring-muted-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }
              `}
            >
              Draft
            </button>
            <button
              onClick={() => setStatus("Published")}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${status === "Published"
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
              <Image className="h-5 w-5 text-accent" />
              Thumbnail
            </CardTitle>
            <CardDescription>Cover image for the film</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
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
            <label htmlFor="credits" className="text-sm font-medium text-foreground">
              Credits
            </label>
            <textarea
              id="credits"
              value={metadata.credits}
              onChange={(e) => setMetadata(prev => ({ ...prev, credits: e.target.value }))}
              placeholder="Director, cinematographer, etc..."
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
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
