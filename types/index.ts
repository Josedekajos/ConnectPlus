export interface Group {
  id: string
  name: string
  description: string
  members: number
  avatar: string
  events: Event[]
  discussions: Discussion[]
  files: File[]
  members: Member[]
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
}

export interface Discussion {
  id: string
  title: string
  replies: number
  lastActivity: string
}

export interface File {
  id: string
  name: string
  size: string
  uploadedBy: string
  uploadDate: string
}

export interface Member {
  id: string
  name: string
  avatar: string
  role: string
}

export interface Notification {
  id: number
  type: string
  content: string
  timestamp: string
}

export interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime: string
  }
}

