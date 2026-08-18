export interface Film {
  id: number
  title: string
  slug: string
  year: number
  duration: string
  category: string
  collection: string[]
  description: string
  synopsis: string
  credits: {
    director: string
    cinematography?: string
    editor?: string
    sound?: string
    music?: string
  }
  image: string
  videoUrl: string
  stills?: string[]
  featured: boolean
  status: "published" | "draft"
}

export const films: Film[] = [
  {
    id: 1,
    title: "Dissolving Boundaries",
    slug: "dissolving-boundaries",
    year: 2023,
    duration: "24 min",
    category: "Documentary",
    collection: ["Documentary", "2020-2024"],
    description: "An exploration of liminal spaces between the digital and physical realms.",
    synopsis: "Dissolving Boundaries traces the invisible threads connecting our physical existence to the digital landscapes we increasingly inhabit. Through intimate interviews and observational footage captured across three continents, the film examines how technology reshapes our perception of space, time, and human connection. The work moves between bustling data centers, quiet domestic spaces, and the vast emptiness of server farms, weaving a meditation on presence and absence in the networked age.",
    credits: {
      director: "Archive Artist",
      cinematography: "James Chen",
      editor: "Archive Artist",
      sound: "Maria Santos",
      music: "Ambient Works Collective",
    },
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    stills: [
      "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    ],
    featured: true,
    status: "published",
  },
  {
    id: 2,
    title: "The Weight of Light",
    slug: "weight-of-light",
    year: 2022,
    duration: "12 min",
    category: "Experimental",
    collection: ["Shorts", "2020-2024"],
    description: "A meditation on memory, loss, and the persistence of vision.",
    synopsis: "The Weight of Light unfolds as a visual poem, layering found footage with original 16mm material shot over the course of a single winter. The film explores how light carries memory—the way afternoon sun through a window can transport us decades backward, or how the flicker of a projector beam holds within it the ghosts of everyone who has ever watched. Without dialogue, the work relies on rhythm, texture, and the interplay of shadow and illumination to evoke a state of profound remembrance.",
    credits: {
      director: "Archive Artist",
      cinematography: "Archive Artist",
      editor: "Archive Artist",
      sound: "Field Recordings",
    },
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    stills: [
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop",
    ],
    featured: true,
    status: "published",
  },
  {
    id: 3,
    title: "Echoes in the Frame",
    slug: "echoes-in-the-frame",
    year: 2021,
    duration: "18 min",
    category: "Short",
    collection: ["Shorts", "2020-2024"],
    description: "A fractured narrative exploring identity through the lens of cinema itself.",
    synopsis: "Echoes in the Frame is a self-reflexive work that questions the apparatus of filmmaking while telling the story of a woman who discovers old home movies in her late grandmother's attic. As she watches the footage, the boundaries between past and present, observer and observed, begin to collapse. The film employs split screens, re-photography, and direct manipulation of the film strip to create a layered experience that asks: what do we leave behind when we record our lives?",
    credits: {
      director: "Archive Artist",
      cinematography: "Nina Kovacs",
      editor: "Archive Artist",
      sound: "David Park",
      music: "String Quartet No. 4",
    },
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    stills: [
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=1935&auto=format&fit=crop",
    ],
    featured: true,
    status: "published",
  },
  {
    id: 4,
    title: "Peripheral Vision",
    slug: "peripheral-vision",
    year: 2020,
    duration: "32 min",
    category: "Documentary",
    collection: ["Documentary", "2020-2024"],
    description: "Following street photographers in Tokyo, capturing what exists at the edge of attention.",
    synopsis: "Peripheral Vision follows three street photographers through the labyrinthine neighborhoods of Tokyo, documenting their obsessive practice of capturing the unseen. The film itself adopts their methodology—avoiding direct subjects, instead focusing on reflections in shop windows, figures half-obscured by passing trains, and the play of neon light on rain-slicked pavement. Over the course of 32 minutes, a portrait of the city emerges not through its landmarks, but through its margins.",
    credits: {
      director: "Archive Artist",
      cinematography: "Yuki Tanaka",
      editor: "Archive Artist",
      sound: "Tokyo Field Recording Project",
    },
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    stills: [
      "https://images.unsplash.com/photo-1579762593175-20226054cad0?q=80&w=2036&auto=format&fit=crop",
    ],
    featured: false,
    status: "published",
  },
  {
    id: 5,
    title: "Static Frequencies",
    slug: "static-frequencies",
    year: 2019,
    duration: "8 min",
    category: "Experimental",
    collection: ["Shorts", "Installations"],
    description: "An audiovisual composition derived from radio interference patterns.",
    synopsis: "Static Frequencies began as a sound installation before evolving into a single-channel video work. Using custom software to translate radio interference into visual patterns, the piece creates a synesthetic experience where electromagnetic noise becomes visible. The work asks viewers to reconsider the hidden landscapes of signal and interference that surround us constantly, suggesting that within noise there exists a kind of beauty and order typically imperceptible to human senses.",
    credits: {
      director: "Archive Artist",
      sound: "Archive Artist",
    },
    image: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?q=80&w=1974&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    featured: false,
    status: "published",
  },
  {
    id: 6,
    title: "The Longest Night",
    slug: "the-longest-night",
    year: 2018,
    duration: "45 min",
    category: "Documentary",
    collection: ["Documentary"],
    description: "Documenting winter solstice rituals across Nordic communities.",
    synopsis: "Shot entirely during the winter solstice across five Nordic countries, The Longest Night observes how communities mark the darkest day of the year. From bonfires in Iceland to candlelit processions in Sweden, the film captures rituals both ancient and contemporary that humans have developed to survive the dark. The pace is deliberately slow, mirroring the quality of winter light and the suspended feeling of time during the endless night.",
    credits: {
      director: "Archive Artist",
      cinematography: "Erik Lindqvist",
      editor: "Archive Artist",
      sound: "Natural Ambience",
      music: "Nordic Folk Ensemble",
    },
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    stills: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop",
    ],
    featured: false,
    status: "published",
  },
  {
    id: 7,
    title: "Remnants",
    slug: "remnants",
    year: 2017,
    duration: "15 min",
    category: "Short",
    collection: ["Shorts"],
    description: "Exploring abandoned spaces and the traces left behind by former inhabitants.",
    synopsis: "Remnants is a meditation on absence and the marks we leave on the spaces we inhabit. Filmed in abandoned homes, factories, and institutions across the American Midwest, the camera moves slowly through rooms where peeling wallpaper and scattered belongings tell fragmentary stories. Without narration or interviews, the film allows these spaces to speak for themselves, inviting viewers to reconstruct narratives from the visual evidence that remains.",
    credits: {
      director: "Archive Artist",
      cinematography: "Archive Artist",
      editor: "Sarah Mitchell",
      sound: "Empty Room Recordings",
    },
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    featured: false,
    status: "published",
  },
  {
    id: 8,
    title: "Confluence",
    slug: "confluence",
    year: 2024,
    duration: "28 min",
    category: "Documentary",
    collection: ["Documentary", "2020-2024"],
    description: "Where three rivers meet: water, migration, and the flow of history.",
    synopsis: "Confluence is set at Pittsburgh's Point, where the Allegheny and Monongahela rivers join to form the Ohio. Using the confluence as both literal location and conceptual framework, the film traces parallel flows: of water, of people, of industry, and of time. Interviews with river workers, historians, and recent immigrants interweave with lyrical footage of the water itself, building a portrait of a place shaped by constant movement and change.",
    credits: {
      director: "Archive Artist",
      cinematography: "Michael Torres",
      editor: "Archive Artist",
      sound: "River Sound Archive",
      music: "Appalachian Strings",
    },
    image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
    videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    stills: [
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1974&auto=format&fit=crop",
    ],
    featured: false,
    status: "published",
  },
]

export function getFilmBySlug(slug: string): Film | undefined {
  return films.find((film) => film.slug === slug)
}

export function getPublishedFilms(): Film[] {
  return films.filter((film) => film.status === "published")
}

export function getFeaturedFilms(): Film[] {
  return films.filter((film) => film.featured && film.status === "published")
}

export function getFilmsByCollection(collection: string): Film[] {
  return films.filter(
    (film) => film.collection.includes(collection) && film.status === "published"
  )
}

export function getCategories(): string[] {
  const categories = new Set(films.map((film) => film.category))
  return Array.from(categories)
}

export function getYears(): number[] {
  const years = new Set(films.map((film) => film.year))
  return Array.from(years).sort((a, b) => b - a)
}
