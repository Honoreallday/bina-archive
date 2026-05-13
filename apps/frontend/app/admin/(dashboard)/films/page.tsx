"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Film,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authHeaders } from "@/lib/auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

interface AdminFilm {
  id: number
  title: string
  slug: string
  year: number
  director: string
  status: string
  published: boolean
  created_at: string
}

const statusOptions = ["All", "Published", "Draft"]

export default function AdminFilmsPage() {
  const [films, setFilms] = useState<AdminFilm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState<"title" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchFilms = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_URL}/api/admin/films`, {
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      setFilms(await res.json())
    } catch {
      setError("Failed to load films.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFilms()
  }, [fetchFilms])

  const handleTogglePublish = async (film: AdminFilm) => {
    const updated = { ...film, published: !film.published }
    setFilms((prev) => prev.map((f) => (f.id === film.id ? updated : f)))
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${film.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ published: !film.published }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setFilms((prev) => prev.map((f) => (f.id === film.id ? film : f)))
    }
  }

  const handleDelete = async (film: AdminFilm) => {
    if (!confirm(`Delete "${film.title}"? This cannot be undone.`)) return
    setFilms((prev) => prev.filter((f) => f.id !== film.id))
    try {
      const res = await fetch(`${API_URL}/api/admin/films/${film.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      if (!res.ok) throw new Error()
    } catch {
      setFilms((prev) => [...prev, film].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ))
    }
  }

  const filteredFilms = films
    .filter((film) => {
      const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && film.published) ||
        (statusFilter === "Draft" && !film.published)
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const comparison =
        sortBy === "title"
          ? a.title.localeCompare(b.title)
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      return sortOrder === "asc" ? comparison : -comparison
    })

  const totalPages = Math.ceil(filteredFilms.length / itemsPerPage)
  const paginatedFilms = filteredFilms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleSort = (field: "title" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Films</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your film archive ({films.length} films)
          </p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/upload">
            <Plus className="h-4 w-4" />
            Add Film
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
          <button onClick={fetchFilms} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search films..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status: {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {statusOptions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  setStatusFilter(status)
                  setCurrentPage(1)
                }}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort("title")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Title
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Director</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <button
                  onClick={() => toggleSort("date")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Created
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedFilms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No films found
                </TableCell>
              </TableRow>
            ) : (
              paginatedFilms.map((film) => (
                <TableRow key={film.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
                      <Film className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/films/${film.id}/edit`}
                      className="font-medium text-foreground hover:text-accent transition-colors"
                    >
                      {film.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{film.year}</TableCell>
                  <TableCell className="text-muted-foreground">{film.director}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleTogglePublish(film)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        film.published
                          ? "bg-accent/20 text-accent hover:bg-accent/30"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {film.published ? "Published" : "Draft"}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(film.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/films/${film.slug}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/films/${film.id}/edit`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(film)}
                          className="text-destructive focus:text-destructive flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredFilms.length)} of{" "}
            {filteredFilms.length} films
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-accent text-accent-foreground" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
