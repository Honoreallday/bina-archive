"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { saveToken } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Login failed")
        return
      }
      saveToken(data.token)
      router.push("/admin")
    } catch {
      setError("Could not reach the server. Is the backend running?")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--almanac-parchment)] px-6 font-[family-name:var(--font-almanac-mono)] text-[var(--almanac-ink)] selection:bg-[var(--almanac-blue)] selection:text-[var(--almanac-parchment)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--almanac-red)]">Restricted access</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 font-[family-name:var(--font-almanac-script)] text-lg text-[var(--almanac-blue)]">
            enter your credentials
          </p>
        </div>

        <div className="border-2 border-[var(--almanac-ink)]">
          <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
            Sign in
          </header>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
            {error && (
              <div className="border border-[var(--almanac-border)] bg-[var(--almanac-parchment-alt)] px-3 py-2 text-xs text-[var(--almanac-ink-mid)]">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[11px] uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border-2 border-[var(--almanac-ink)] bg-[var(--almanac-parchment)] px-3 py-2 pr-16 text-sm outline-none placeholder:text-[var(--almanac-border)] focus:border-[var(--almanac-blue)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.1em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--almanac-border)] pt-4">
              <Link
                href="/"
                className="text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
              >
                ← back to site
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)] disabled:opacity-40"
              >
                {isLoading ? "Signing in…" : "Sign in →"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--almanac-ink-light)]">
          Protected area · Unauthorized access is prohibited
        </p>
      </div>
    </div>
  )
}
