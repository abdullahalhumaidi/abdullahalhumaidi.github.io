export type Lang = 'ar' | 'en'
export type Bi = { ar: string; en: string }
export type Status = 'approved' | 'pending'

export type WorkMeta = {
  id: string
  status: Status
  order: number
  category: 'internal-comms' | 'employee-experience'
  kicker: Bi
  title: Bi
  description: Bi
  role: Bi | null
  format: 'html' | 'image'
  file: string
  cover: string
  eventId?: string
  reviewNote?: string
}

export type EventMeta = {
  id: string
  status: Status
  order: number
  type: 'corporate' | 'occasion' | 'engagement'
  title: Bi
  description: Bi
  role: Bi
  roleType?: 'led' | 'team'
  concept?: boolean
  roleDetail?: Bi
  how?: Bi
  comms?: Bi
  relatedWorks: string[]
  relatedPosts: string[]
  showWorks?: boolean
}

export type PhotoSet = {
  eventId: string
  status: Status
  photos: { file: string; facesBlurred?: boolean }[]
  reviewNote?: string
}

export type PosterMeta = {
  id: string
  status: Status
  order: number
  eventId: string
  image: string
  title: Bi
  reviewNote?: string
}

export type IdeaMeta = {
  id: string
  status: Status
  order: number
  kicker: Bi
  title: Bi
  description: Bi
  features: Bi[]
  app: string
  cover: string
  reviewNote?: string
}

export type PostMeta = {
  id: string
  status: Status
  order: number
  topic: Bi
  excerpt: string
  excerptLang: Lang
  url: string
  eventId?: string
}

export type SiteData = {
  name: Bi
  role: Bi
  contact?: {
    status: Status
    email: string
    phone: string
    phoneDisplay: string
    whatsapp: string
    linkedin: string
  }
  cv?: { status: Status; url: string }
  stats: { value: string; label: Bi }[]
  offer: { title: Bi; example: Bi; link: { type: 'section' | 'work' | 'story'; target: string } | null }[]
  tools: string[]
  journey: { when: Bi; role: Bi; place: Bi }[]
}

/* Resolved, ready-to-render items */
export type Work = WorkMeta & { dir: string; coverUrl: string; imageUrl?: string; pending: boolean }
export type Event = EventMeta & { photos: { url: string; facesBlurred: boolean }[]; pending: boolean; photosPending: boolean }
export type Poster = PosterMeta & { url: string; pending: boolean }
export type Idea = IdeaMeta & { dir: string; coverUrl: string; pending: boolean }
export type Post = PostMeta
