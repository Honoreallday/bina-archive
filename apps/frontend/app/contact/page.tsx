"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mail, MapPin, Send } from "lucide-react"

const inquiryTypes = [
  { id: "screening", label: "Screening Request" },
  { id: "licensing", label: "Licensing Inquiry" },
  { id: "press", label: "Press / Interview" },
  { id: "institutional", label: "Institutional Access" },
  { id: "general", label: "General Inquiry" },
]

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            organization: formState.organization,
            inquiryType: selectedType,
            message: formState.message,
          }),
        }
      )
      if (!res.ok) throw new Error("Submission failed")
      setIsSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again or email us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="px-6 lg:px-8 pt-32 pb-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-accent text-sm tracking-widest uppercase mb-6">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground mb-8 text-balance">
              Get in touch
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              For screening requests, licensing inquiries, press interviews, or
              institutional access, please use the form below or reach out directly.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="px-6 lg:px-8 py-16 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              {/* Contact Info */}
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
                    Direct Contact
                  </h2>
                  <a
                    href="mailto:archive@example.com"
                    className="flex items-center gap-3 text-foreground hover:text-accent transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    archive@example.com
                  </a>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
                    Location
                  </h2>
                  <div className="flex items-start gap-3 text-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>
                      Chicago, IL<br />
                      United States
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
                    Response Time
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We typically respond to inquiries within 3-5 business days.
                    For urgent screening requests, please indicate the timeline in your message.
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
                    Representation
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For sales and distribution inquiries, the artist is represented by
                    Example Distribution.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-8">
                {isSubmitted ? (
                  <div className="bg-secondary/50 border border-border p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      Message sent
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for your inquiry. We will respond within 3-5 business days.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false)
                        setSelectedType(null)
                        setFormState({ name: "", email: "", organization: "", message: "" })
                      }}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-4">
                        What is your inquiry about?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {inquiryTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            className={`px-4 py-2 text-sm border transition-colors ${
                              selectedType === type.id
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          className="bg-secondary border-border"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          className="bg-secondary border-border"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="organization"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Organization <span className="text-muted-foreground">(optional)</span>
                      </label>
                      <Input
                        id="organization"
                        type="text"
                        value={formState.organization}
                        onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                        className="bg-secondary border-border"
                        placeholder="Museum, university, publication, etc."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-none"
                        placeholder="Please include details about your inquiry, including any relevant dates or timeline..."
                      />
                    </div>

                    {submitError && (
                      <p className="text-sm text-destructive">{submitError}</p>
                    )}
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-xs text-muted-foreground">
                        All submissions are kept confidential.
                      </p>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !selectedType}
                        className="gap-2"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 lg:px-8 py-16 border-t border-border bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: "How can I screen a film at my institution?",
                  a: "Please submit a screening request with details about your venue, anticipated audience, and preferred dates. We will respond with availability and rental terms.",
                },
                {
                  q: "Are the films available for educational use?",
                  a: "Yes, many works are available for educational licensing. Institutional access can be arranged for universities and libraries.",
                },
                {
                  q: "Can I license footage for my project?",
                  a: "Licensing requests are considered on a case-by-case basis. Please include details about your project, intended use, and distribution plans.",
                },
                {
                  q: "How do I access installation documentation?",
                  a: "Documentation for multi-channel installations is available upon request. Some pieces require in-person viewing and cannot be streamed.",
                },
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="text-foreground font-medium mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
