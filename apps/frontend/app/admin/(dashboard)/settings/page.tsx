"use client"

import { useState } from "react"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "Dream Chambers Public Access",
    siteDescription:
      "An archive and non-exclusive distributor for Black Minnesotan and Midwestern experimental film.",
    contactEmail: "dreamchambers@proton.me",
    socialInstagram: "",
    socialVimeo: "",
    socialTwitter: "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (
    id: keyof typeof settings,
    label: string,
    type = "text",
    placeholder = ""
  ) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={settings[id]}
        onChange={(e) => setSettings((prev) => ({ ...prev, [id]: e.target.value }))}
        placeholder={placeholder}
        className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
      />
    </div>
  )

  return (
    <div className="max-w-lg space-y-8">
      <div className="border-b border-[var(--almanac-border)] pb-4">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Configuration</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          General
        </header>
        <div className="flex flex-col gap-5 p-5">
          {field("siteName", "Site name")}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="siteDescription"
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]"
            >
              Site description
            </label>
            <textarea
              id="siteDescription"
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
              className="resize-none border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
            />
          </div>
        </div>
      </section>

      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Contact
        </header>
        <div className="flex flex-col gap-5 p-5">
          {field("contactEmail", "Contact email", "email", "dreamchambers@proton.me")}
        </div>
      </section>

      <section className="border-2 border-[var(--almanac-ink)]">
        <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
          Social links
        </header>
        <div className="flex flex-col gap-5 p-5">
          {field("socialInstagram", "Instagram", "url", "https://instagram.com/…")}
          {field("socialVimeo", "Vimeo", "url", "https://vimeo.com/…")}
          {field("socialTwitter", "Twitter / X", "url", "https://twitter.com/…")}
        </div>
      </section>

      <div className="flex items-center justify-between">
        {saved && (
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-blue)]">Settings saved.</p>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto border-2 border-[var(--almanac-ink)] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-40"
        >
          {isSaving ? "Saving…" : "Save changes →"}
        </button>
      </div>
    </div>
  )
}
