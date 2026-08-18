"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

const inquiryTypes = [
  { id: "screening", label: "Screening Request" },
  { id: "licensing", label: "Licensing Inquiry" },
  { id: "press", label: "Press / Interview" },
  { id: "institutional", label: "Institutional Access" },
  { id: "general", label: "General Inquiry" },
]

const archiveInfo: [string, string][] = [
  ["Archive", "Dream Chambers Public Access"],
  ["Region", "Minneapolis, Minnesota"],
  ["Focus", "Black Minnesotan & Midwestern moving image, 1960s–present"],
  ["Founded", "2019"],
  ["Submissions", "Open — see criteria"],
  ["Licensing", "Non-exclusive; artist retains all rights"],
  ["Email", "dreamchambers@proton.me"],
]

const faqs = [
  {
    q: "How can I screen a film at my institution?",
    a: "Submit a screening request with details about your venue, anticipated audience, and preferred dates. We will respond with availability and rental terms.",
  },
  {
    q: "Are the films available for educational use?",
    a: "Yes, many works are available for educational licensing. Institutional access can be arranged for universities and libraries.",
  },
  {
    q: "Can I license footage for my project?",
    a: "Licensing requests are considered on a case-by-case basis. Include details about your project, intended use, and distribution plans.",
  },
  {
    q: "How do I access installation documentation?",
    a: "Documentation for multi-channel installations is available upon request. Some pieces require in-person viewing and cannot be streamed.",
  },
]

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formState, setFormState] = useState({ name: "", email: "", organization: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          organization: formState.organization,
          inquiryType: selectedType,
          message: formState.message,
        }),
      })
      if (!res.ok) throw new Error("Submission failed")
      setIsSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again or write to us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setSelectedType(null)
    setFormState({ name: "", email: "", organization: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-[var(--almanac-parchment)] font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-10 pb-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.15fr]">
          {/* Left — intro + archive info */}
          <section>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Contact</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Get in touch</h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
              For screening requests, licensing inquiries, press interviews, or institutional
              access, use the form or reach out directly. We&apos;re a small operation and do our
              best to respond promptly.
            </p>

            <div className="mt-8 border-2 border-[var(--almanac-ink)]">
              <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
                Contact information
              </header>
              <dl>
                {archiveInfo.map(([label, value], i) => (
                  <div
                    key={label}
                    className={`grid grid-cols-[130px_1fr] gap-3 px-3 py-2.5 text-xs ${
                      i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                    }`}
                  >
                    <dt className="uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">{label}</dt>
                    <dd className="font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* Right — form */}
          <section className="border-2 border-[var(--almanac-ink)]">
            <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
              Contact form
            </header>

            {isSubmitted ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <h2 className="text-xl font-bold tracking-tight">Message sent</h2>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--almanac-ink-mid)]">
                  Thank you for reaching out. We&apos;ll get back to you as soon as we can.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-3 border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
                    What is your inquiry about?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
                          selectedType === type.id
                            ? "border-[var(--almanac-ink)] bg-[var(--almanac-ink)] text-[var(--almanac-parchment)]"
                            : "border-[var(--almanac-border)] text-[var(--almanac-ink-light)] hover:border-[var(--almanac-ink)] hover:text-[var(--almanac-ink)]"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                    className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm font-[family-name:var(--font-almanac-mono)] outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="your@email.address"
                    className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm font-[family-name:var(--font-almanac-mono)] outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="organization"
                    className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]"
                  >
                    Organization <span className="normal-case text-[var(--almanac-border)]">(optional)</span>
                  </label>
                  <input
                    id="organization"
                    type="text"
                    value={formState.organization}
                    onChange={(e) => setFormState({ ...formState, organization: e.target.value })}
                    placeholder="Museum, university, publication, etc."
                    className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm font-[family-name:var(--font-almanac-mono)] outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={7}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Write your message here…"
                    className="resize-none border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 text-sm font-[family-name:var(--font-almanac-mono)] outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
                  />
                </div>

                {submitError && (
                  <div className="border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)] px-3 py-2 text-xs text-[var(--almanac-ink-mid)]">
                    {submitError}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-[var(--almanac-border)] pt-4">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
                    All submissions are confidential
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedType}
                    className="border-2 border-[var(--almanac-ink)] px-6 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-40"
                  >
                    {isSubmitting ? "Sending…" : "Send message →"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* FAQ */}
        <section className="mt-14 border-t border-[var(--almanac-border)] pt-10">
          <p className="mb-5 text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">
            Frequently asked
          </p>
          <div className="border-2 border-[var(--almanac-ink)]">
            {faqs.map((item, i) => (
              <div
                key={item.q}
                className={`grid gap-2 px-4 py-4 text-sm sm:grid-cols-[1fr_1.4fr] ${
                  i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                } ${i > 0 ? "border-t border-[var(--almanac-border)]" : ""}`}
              >
                <p className="font-bold">{item.q}</p>
                <p className="leading-relaxed text-[var(--almanac-ink-mid)]">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
