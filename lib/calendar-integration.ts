import { google } from "googleapis"
import type { CalendarEvent } from "@/types"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
)

export async function getCalendarEvents(accessToken: string): Promise<CalendarEvent[]> {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    })

    return res.data.items as CalendarEvent[]
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw new Error("Failed to fetch calendar events")
  }
}

export async function addCalendarEvent(accessToken: string, event: any): Promise<CalendarEvent> {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })

    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    })

    return res.data as CalendarEvent
  } catch (error) {
    console.error("Error adding calendar event:", error)
    throw new Error("Failed to add calendar event")
  }
}

