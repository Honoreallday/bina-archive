import Link from "next/link"
import { Film, Eye, Clock, Upload, ArrowUpRight, FileVideo, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Placeholder data - replace with real data from database
const stats = [
  { label: "Total Films", value: "24", icon: Film, change: "+2 this month" },
  { label: "Total Views", value: "1,847", icon: Eye, change: "+12% from last month" },
  { label: "Watch Time", value: "342h", icon: Clock, change: "Average 14h/film" },
  { label: "Collections", value: "4", icon: FileVideo, change: "Shorts, Documentary..." },
]

const recentFilms = [
  { id: 1, title: "Untitled Film #12", status: "Published", views: 234, date: "2024-01-15" },
  { id: 2, title: "Installation Documentation", status: "Draft", views: 0, date: "2024-01-12" },
  { id: 3, title: "Short Film: Echoes", status: "Published", views: 567, date: "2024-01-08" },
  { id: 4, title: "Archive Compilation 2023", status: "Published", views: 189, date: "2024-01-05" },
]

const recentActivity = [
  { action: "Film uploaded", detail: "Untitled Film #12", time: "2 hours ago" },
  { action: "Metadata updated", detail: "Short Film: Echoes", time: "1 day ago" },
  { action: "Collection created", detail: "2020-2024", time: "3 days ago" },
  { action: "Film published", detail: "Archive Compilation 2023", time: "1 week ago" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your film archive
          </p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/admin/upload">
            <Upload className="h-4 w-4" />
            Upload Film
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className="p-2 bg-secondary rounded-md">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Films */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Films</CardTitle>
              <CardDescription>Latest uploads and their status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/films" className="text-accent">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFilms.map((film) => (
                <div 
                  key={film.id} 
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center">
                      <Film className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{film.title}</p>
                      <p className="text-xs text-muted-foreground">{film.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-foreground">{film.views} views</p>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${film.status === "Published" 
                        ? "bg-accent/20 text-accent" 
                        : "bg-secondary text-muted-foreground"
                      }
                    `}>
                      {film.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest actions in the archive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                >
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/upload">
                <Upload className="h-5 w-5 text-accent" />
                <span className="text-sm">Upload Film</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/films">
                <FileVideo className="h-5 w-5 text-accent" />
                <span className="text-sm">Manage Films</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link href="/" target="_blank">
                <Eye className="h-5 w-5 text-accent" />
                <span className="text-sm">View Site</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2">
              <Link href="/admin/settings">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm">Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
