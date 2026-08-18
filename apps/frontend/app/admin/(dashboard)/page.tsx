import Link from "next/link"

const stats = [
  { label: "Total Films", value: "24", note: "+2 this month" },
  { label: "Total Views", value: "1,847", note: "+12% from last month" },
  { label: "Watch Time", value: "342h", note: "Avg 14h / film" },
  { label: "Collections", value: "4", note: "Shorts, Documentary…" },
]

const recentFilms = [
  { id: 1, title: "Untitled Film #12", published: true, views: 234, date: "2024-01-15" },
  { id: 2, title: "Installation Documentation", published: false, views: 0, date: "2024-01-12" },
  { id: 3, title: "Short Film: Echoes", published: true, views: 567, date: "2024-01-08" },
  { id: 4, title: "Archive Compilation 2023", published: true, views: 189, date: "2024-01-05" },
]

const recentActivity = [
  { action: "Film uploaded", detail: "Untitled Film #12", time: "2 hours ago" },
  { action: "Metadata updated", detail: "Short Film: Echoes", time: "1 day ago" },
  { action: "Collection created", detail: "2020–2024", time: "3 days ago" },
  { action: "Film published", detail: "Archive Compilation 2023", time: "1 week ago" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--almanac-border)] pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--almanac-ink-light)]">Overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Link
          href="/admin/upload"
          className="border-2 border-[var(--almanac-ink)] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-ink)] hover:text-[var(--almanac-parchment)]"
        >
          + Upload Film
        </Link>
      </div>

      <div className="border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)]">
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
          {stats.map(({ label, value, note }) => (
            <div key={label} className="flex flex-col bg-[var(--almanac-parchment)] px-4 py-5">
              <span className="text-3xl font-bold tabular-nums leading-none">{value}</span>
              <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em]">{label}</span>
              <span className="mt-1 text-[11px] text-[var(--almanac-ink-light)]">{note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <div className="mb-3 flex items-end justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
              Recent Films
            </p>
            <Link
              href="/admin/films"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--almanac-ink-light)] hover:text-[var(--almanac-ink)]"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto border-2 border-[var(--almanac-ink)]">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--almanac-ink)] text-left text-[var(--almanac-parchment)]">
                  {["Title", "Status", "Views", "Date"].map((h) => (
                    <th
                      key={h}
                      className="border-r border-[var(--almanac-ink-divider)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentFilms.map((film, i) => (
                  <tr
                    key={film.id}
                    className={`${
                      i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                    } hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]`}
                  >
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2 font-bold">{film.title}</td>
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2">
                      <span
                        className={`border px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${
                          film.published
                            ? "border-[var(--almanac-blue)] text-[var(--almanac-blue)]"
                            : "border-[var(--almanac-border)] text-[var(--almanac-ink-light)]"
                        }`}
                      >
                        {film.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="border-r border-[var(--almanac-border)] px-3 py-2 tabular-nums">
                      {film.views.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{film.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
            Recent Activity
          </p>
          <div className="border-2 border-[var(--almanac-ink)]">
            <header className="border-b border-[var(--almanac-ink)] bg-[var(--almanac-ink)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--almanac-parchment)]">
              Activity log
            </header>
            <dl>
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[1fr_auto] items-start gap-4 px-3 py-2.5 text-xs ${
                    i % 2 === 0 ? "bg-[var(--almanac-parchment)]" : "bg-[var(--almanac-parchment-alt)]"
                  }`}
                >
                  <div>
                    <dt className="font-bold">{item.action}</dt>
                    <dd className="mt-0.5 text-[var(--almanac-ink-light)]">{item.detail}</dd>
                  </div>
                  <span className="text-[11px] tabular-nums text-[var(--almanac-ink-light)]">{item.time}</span>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>

      <section>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--almanac-ink-light)]">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-px border-2 border-[var(--almanac-ink)] bg-[var(--almanac-ink)] sm:grid-cols-4">
          {[
            { href: "/admin/upload", label: "Upload Film" },
            { href: "/admin/films", label: "Manage Films" },
            { href: "/", label: "View Site" },
            { href: "/admin/settings", label: "Settings" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center bg-[var(--almanac-parchment)] px-4 py-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[var(--almanac-blue)] hover:text-[var(--almanac-parchment)]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
