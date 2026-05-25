"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Film, Image, X, Plus, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authHeaders } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

const collections = [
  { id: "shorts", label: "Shorts" },
  { id: "installations", label: "Installations" },
  { id: "documentary", label: "Documentary" },
  { id: "2020-2024", label: "2020-2024" },
]

function parseDurationToSeconds(duration: string): number | null {
  const parts = duration.trim().split(":").map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

function uploadToS3(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    })
    xhr.addEventListener("load", () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`))))
    xhr.addEventListener("error", () => reject(new Error("S3 upload network error")))
    xhr.send(file)
  })
}

export default function AdminUploadPage() {
  const router = useRouter()
  const [filmFile, setFilmFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [stillFiles, setStillFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPhase, setUploadPhase] = useState("")
  const [error, setError] = useState("")
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])

  const filmInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const stillsInputRef = useRef<HTMLInputElement>(null)

  const [metadata, setMetadata] = useState({
    title: "",
    year: new Date().getFullYear().toString(),
    duration: "",
    description: "",
    director: "",
  })

  const handleFilmDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setFilmFile(file)
    }
  }

  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file)
    }
  }

  const handleStillsDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))
    setStillFiles(prev => [...prev, ...files])
  }

  const removeStill = (index: number) => {
    setStillFiles(prev => prev.filter((_, i) => i !== index))
  }

  const toggleCollection = (id: string) => {
    setSelectedCollections(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id) 
        : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent, publishImmediately: boolean) => {
    e.preventDefault()
    if (!filmFile) return

    setIsUploading(true)
    setError("")

    try {
      // Step 1: get presigned URL for the video file
      setUploadPhase("Preparing upload...")
      const urlRes = await fetch(`${API_URL}/api/admin/upload-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ filename: filmFile.name, contentType: filmFile.type, prefix: "raw" }),
      })
      if (!urlRes.ok) throw new Error("Failed to get upload URL")
      const { url: videoUploadUrl, key: rawKey } = await urlRes.json()

      // Step 2: upload the video directly to S3 with real progress
      setUploadPhase("Uploading film...")
      await uploadToS3(videoUploadUrl, filmFile, (pct) => setUploadProgress(pct))

      // Step 3: optionally upload thumbnail
      let thumbnailUrl: string | null = null
      if (thumbnailFile) {
        setUploadPhase("Uploading thumbnail...")
        setUploadProgress(0)
        const thumbUrlRes = await fetch(`${API_URL}/api/admin/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ filename: thumbnailFile.name, contentType: thumbnailFile.type, prefix: "thumbnails" }),
        })
        if (thumbUrlRes.ok) {
          const { url: thumbUploadUrl, cdnUrl } = await thumbUrlRes.json()
          await uploadToS3(thumbUploadUrl, thumbnailFile, (pct) => setUploadProgress(pct))
          thumbnailUrl = cdnUrl
        }
      }

      // Step 4: save film record to the database
      setUploadPhase("Saving film record...")
      setUploadProgress(100)
      const filmRes = await fetch(`${API_URL}/api/admin/films`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          rawKey,
          title: metadata.title,
          year: metadata.year ? Number(metadata.year) : null,
          director: metadata.director,
          description: metadata.description,
          tags: selectedCollections.length > 0 ? selectedCollections : null,
          duration_seconds: parseDurationToSeconds(metadata.duration),
          thumbnail_url: thumbnailUrl,
          published: publishImmediately,
        }),
      })
      if (!filmRes.ok) throw new Error("Failed to save film record")

      router.push("/admin/films")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsUploading(false)
      setUploadProgress(0)
      setUploadPhase("")
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Upload Film</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add a new film to the archive with metadata and media
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault() }} className="space-y-6">
        {/* Film Upload */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Film className="h-5 w-5 text-accent" />
              Film File
            </CardTitle>
            <CardDescription>Upload the main video file (MP4, MOV, WebM)</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={filmInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setFilmFile(e.target.files?.[0] || null)}
            />
            <div
              onDrop={handleFilmDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => filmInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${filmFile 
                  ? "border-accent bg-accent/5" 
                  : "border-border hover:border-muted-foreground"
                }
              `}
            >
              {filmFile ? (
                <div className="flex items-center justify-center gap-3">
                  <Film className="h-8 w-8 text-accent" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{filmFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(filmFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFilmFile(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your film file, or click to browse
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail & Stills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thumbnail */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-5 w-5 text-accent" />
                Thumbnail
              </CardTitle>
              <CardDescription>Main cover image for the film</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              <div
                onDrop={handleThumbnailDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => thumbnailInputRef.current?.click()}
                className={`
                  aspect-video border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors
                  ${thumbnailFile 
                    ? "border-accent bg-accent/5" 
                    : "border-border hover:border-muted-foreground"
                  }
                `}
              >
                {thumbnailFile ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setThumbnailFile(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Drop or click to upload</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Film Stills */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-5 w-5 text-accent" />
                Film Stills
              </CardTitle>
              <CardDescription>Additional images from the film</CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={stillsInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setStillFiles(prev => [...prev, ...files])
                }}
              />
              <div
                onDrop={handleStillsDrop}
                onDragOver={(e) => e.preventDefault()}
                className="space-y-3"
              >
                {stillFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {stillFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Still ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeStill(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => stillsInputRef.current?.click()}
                  className="w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-muted-foreground transition-colors"
                >
                  <div className="text-center">
                    <Plus className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Add stills</p>
                  </div>
                </button>
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
            <CardDescription>Add this film to one or more collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {collections.map((collection) => {
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

        {/* Upload Progress */}
        {isUploading && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{uploadPhase}</span>
                  <span className="text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={!filmFile || !metadata.title || isUploading}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, false)}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={!filmFile || !metadata.title || isUploading}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
          >
            {isUploading ? "Uploading..." : "Publish Film"}
          </Button>
        </div>
      </form>
    </div>
  )
}
