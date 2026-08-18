"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { authHeaders } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

const COLLECTIONS = [
  { id: "shorts", label: "Shorts" },
  { id: "installations", label: "Installations" },
  { id: "documentary", label: "Documentary" },
  { id: "2020-2024", label: "2020–2024" },
]

function parseDuration(dur: string): number | null {
  const parts = dur.trim().split(":").map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return null
}

function uploadToS3(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    })
    xhr.addEventListener("load", () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 ${xhr.status}`))
    )
    xhr.addEventListener("error", () => reject(new Error("S3 network error")))
    xhr.send(file)
  })
}

async function getUploadUrl(filename: string, contentType: string, prefix: string) {
  const res = await fetch(`${API_URL}/api/admin/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ filename, contentType, prefix }),
  })
  if (!res.ok) throw new Error("Failed to get upload URL")
  return res.json() as Promise<{ url: string; key: string; cdnUrl: string | null }>
}

export default function AdminUploadPage() {
  const router = useRouter()
  const filmInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)
  const stillsInputRef = useRef<HTMLInputElement>(null)

  const [filmFile, setFilmFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [stillFiles, setStillFiles] = useState<File[]>([])
  const [metadata, setMetadata] = useState({
    title: "",
    year: String(new Date().getFullYear()),
    duration: "",
    description: "",
    director: "",
    genre: "",
    cinematography: "",
    editor: "",
    sound: "",
    music: "",
  })
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadPhase, setUploadPhase] = useState("")
  const [error, setError] = useState("")

  const toggleCollection = (id: string) =>
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )

  const handleFilmDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("video/")) setFilmFile(file)
  }

  const handleThumbDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) setThumbnailFile(file)
  }

  const handleStillsDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"))
    setStillFiles((prev) => [...prev, ...files])
  }

  const removeStill = (index: number) => {
    setStillFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (publishImmediately: boolean) => {
    if (!filmFile || !metadata.title) return
    setIsUploading(true)
    setError("")

    try {
      setUploadPhase("Preparing upload…")
      const { url: videoUrl, key: rawKey } = await getUploadUrl(filmFile.name, filmFile.type, "raw")

      setUploadPhase("Uploading film…")
      await uploadToS3(videoUrl, filmFile, (pct) => setUploadProgress(pct))

      let thumbnailUrl: string | null = null
      if (thumbnailFile) {
        setUploadPhase("Uploading thumbnail…")
        setUploadProgress(0)
        const { url: thumbUrl, cdnUrl } = await getUploadUrl(
          thumbnailFile.name,
          thumbnailFile.type,
          "thumbnails"
        )
        await uploadToS3(thumbUrl, thumbnailFile, (pct) => setUploadProgress(pct))
        thumbnailUrl = cdnUrl
      }

      const stillUrls: string[] = []
      for (let i = 0; i < stillFiles.length; i++) {
        const file = stillFiles[i]
        setUploadPhase(`Uploading stills (${i + 1}/${stillFiles.length})…`)
        setUploadProgress(0)
        const { url: stillUrl, cdnUrl } = await getUploadUrl(file.name, file.type, "stills")
        await uploadToS3(stillUrl, file, (pct) => setUploadProgress(pct))
        if (cdnUrl) stillUrls.push(cdnUrl)
      }

      setUploadPhase("Saving film record…")
      setUploadProgress(100)
      const filmRes = await fetch(`${API_URL}/api/admin/films`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          rawKey,
          title: metadata.title,
          year: metadata.year ? Number(metadata.year) : null,
          director: metadata.director,
          cinematography: metadata.cinematography || null,
          editor: metadata.editor || null,
          sound: metadata.sound || null,
          music: metadata.music || null,
          description: metadata.description,
          genre: metadata.genre || null,
          tags: selectedCollections.length > 0 ? selectedCollections : null,
          duration_seconds: parseDuration(metadata.duration),
          thumbnail_url: thumbnailUrl,
          stills: stillUrls.length > 0 ? stillUrls : null,
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

  const inputCls =
    "w-full border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"

  const canSubmit = !!filmFile && !!metadata.title && !isUploading

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-[var(--almanac-border)] pb-4">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">New entry</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Upload Film</h1>
      </div>

      {error && (
        <div className="border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)] px-3 py-2 text-xs text-[var(--almanac-ink-mid)]">
          {error}
        </div>
      )}

      {/* Film file drop zone */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Film file <span className="text-[var(--almanac-red)]">*</span>
        </header>
        <div className="p-4">
          <input
            ref={filmInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFilmFile(e.target.files?.[0] ?? null)}
          />
          <div
            onDrop={handleFilmDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => filmInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed px-6 py-10 text-center transition-colors ${
              filmFile
                ? "border-[var(--almanac-blue)] bg-[var(--almanac-blue)]/5"
                : "border-[var(--almanac-border)] hover:border-[var(--almanac-ink)]"
            }`}
          >
            {filmFile ? (
              <div>
                <p className="font-bold">{filmFile.name}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
                  {(filmFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFilmFile(null) }}
                  className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-red)] hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-[var(--almanac-ink-mid)]">
                  Drag and drop your film file, or click to browse
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
                  MP4, MOV, WebM
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Thumbnail & Stills */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="border-2 border-[var(--almanac-ink)]">
          <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
            Thumbnail
          </header>
          <div className="p-4">
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            />
            <div
              onDrop={handleThumbDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => thumbInputRef.current?.click()}
              className={`flex cursor-pointer items-center justify-center border-2 border-dashed transition-colors ${
                thumbnailFile
                  ? "border-[var(--almanac-blue)]"
                  : "border-[var(--almanac-border)] hover:border-[var(--almanac-ink)]"
              }`}
              style={{ aspectRatio: "16/9" }}
            >
              {thumbnailFile ? (
                <div className="relative h-full w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setThumbnailFile(null) }}
                    className="absolute right-2 top-2 border border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-xs text-[var(--almanac-ink-light)]">
                  Drop or click to upload cover image
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="border-2 border-[var(--almanac-ink)]">
          <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
            Film Stills
          </header>
          <div className="p-4">
            <input
              ref={stillsInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? [])
                setStillFiles((prev) => [...prev, ...files])
              }}
            />
            <div onDrop={handleStillsDrop} onDragOver={(e) => e.preventDefault()} className="space-y-2">
              {stillFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-1.5">
                  {stillFiles.map((file, index) => (
                    <div key={index} className="relative aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Still ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeStill(index)}
                        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-[var(--almanac-red)] text-[10px] text-[var(--almanac-parchment)]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => stillsInputRef.current?.click()}
                className="flex w-full items-center justify-center border-2 border-dashed border-[var(--almanac-border)] py-4 text-xs text-[var(--almanac-ink-light)] hover:border-[var(--almanac-ink)]"
                style={stillFiles.length === 0 ? { aspectRatio: "16/9" } : undefined}
              >
                + Add stills
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Metadata */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Metadata
        </header>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Title <span className="text-[var(--almanac-red)]">*</span>
            </label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata((p) => ({ ...p, title: e.target.value }))}
              placeholder="Film title"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Year</label>
            <input
              type="text"
              value={metadata.year}
              onChange={(e) => setMetadata((p) => ({ ...p, year: e.target.value }))}
              placeholder="2024"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Duration (mm:ss)
            </label>
            <input
              type="text"
              value={metadata.duration}
              onChange={(e) => setMetadata((p) => ({ ...p, duration: e.target.value }))}
              placeholder="12:34"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Genre</label>
            <input
              type="text"
              value={metadata.genre}
              onChange={(e) => setMetadata((p) => ({ ...p, genre: e.target.value }))}
              placeholder="Documentary, Short, Experimental…"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Director
            </label>
            <input
              type="text"
              value={metadata.director}
              onChange={(e) => setMetadata((p) => ({ ...p, director: e.target.value }))}
              placeholder="Director's name"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Description
            </label>
            <textarea
              rows={4}
              value={metadata.description}
              onChange={(e) => setMetadata((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of the film…"
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Credits */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Credits <span className="normal-case text-[var(--almanac-border)]">(optional)</span>
        </header>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Cinematography
            </label>
            <input
              type="text"
              value={metadata.cinematography}
              onChange={(e) => setMetadata((p) => ({ ...p, cinematography: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Editor</label>
            <input
              type="text"
              value={metadata.editor}
              onChange={(e) => setMetadata((p) => ({ ...p, editor: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Sound</label>
            <input
              type="text"
              value={metadata.sound}
              onChange={(e) => setMetadata((p) => ({ ...p, sound: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">Music</label>
            <input
              type="text"
              value={metadata.music}
              onChange={(e) => setMetadata((p) => ({ ...p, music: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Collections
        </header>
        <div className="flex flex-wrap gap-px bg-[var(--almanac-ink)]">
          {COLLECTIONS.map((col) => {
            const active = selectedCollections.includes(col.id)
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => toggleCollection(col.id)}
                className={`px-5 py-3 text-[11px] font-bold uppercase tracking-[0.16em] ${
                  active ? "bg-[var(--almanac-blue)] text-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment)] hover:bg-[var(--almanac-parchment-alt)]"
                }`}
              >
                {active ? "✓ " : ""}{col.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Upload progress */}
      {isUploading && (
        <section className="border-2 border-[var(--almanac-ink)]">
          <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
            {uploadPhase}
          </header>
          <div className="p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] mb-2">
              <span>{uploadPhase}</span>
              <span className="tabular-nums">{uploadProgress}%</span>
            </div>
            <div className="h-2 border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)]">
              <div
                className="h-full bg-[var(--almanac-blue)] transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 border-t border-[var(--almanac-border)] pt-4">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => handleSubmit(false)}
          className="border border-[var(--almanac-border)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:border-[var(--almanac-ink)] disabled:opacity-40"
        >
          Save as draft
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => handleSubmit(true)}
          className="border-2 border-[var(--almanac-ink)] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-40"
        >
          {isUploading ? "Uploading…" : "Publish film →"}
        </button>
      </div>
    </div>
  )
}
