"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "Archive",
    siteDescription: "A digital archive of films by the artist",
    contactEmail: "contact@archive.com",
    socialInstagram: "",
    socialVimeo: "",
    socialTwitter: "",
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Settings saved successfully!")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure your archive settings
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* General Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">General</CardTitle>
          <CardDescription>Basic site information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="siteName" className="text-sm font-medium text-foreground">
              Site Name
            </label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              placeholder="Archive"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="siteDescription" className="text-sm font-medium text-foreground">
              Site Description
            </label>
            <textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              placeholder="A digital archive of films..."
              rows={3}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
          <CardDescription>Contact information for inquiries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="contactEmail" className="text-sm font-medium text-foreground">
              Contact Email
            </label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="contact@archive.com"
              className="bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Social Links</CardTitle>
          <CardDescription>Connect your social profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="instagram" className="text-sm font-medium text-foreground">
              Instagram
            </label>
            <Input
              id="instagram"
              value={settings.socialInstagram}
              onChange={(e) => setSettings(prev => ({ ...prev, socialInstagram: e.target.value }))}
              placeholder="https://instagram.com/username"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="vimeo" className="text-sm font-medium text-foreground">
              Vimeo
            </label>
            <Input
              id="vimeo"
              value={settings.socialVimeo}
              onChange={(e) => setSettings(prev => ({ ...prev, socialVimeo: e.target.value }))}
              placeholder="https://vimeo.com/username"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="twitter" className="text-sm font-medium text-foreground">
              Twitter / X
            </label>
            <Input
              id="twitter"
              value={settings.socialTwitter}
              onChange={(e) => setSettings(prev => ({ ...prev, socialTwitter: e.target.value }))}
              placeholder="https://twitter.com/username"
              className="bg-secondary border-border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
