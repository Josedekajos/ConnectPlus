"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCalendarEvents, addCalendarEvent } from "@/lib/calendar-integration"

interface CalendarEvent {
  id: string
  summary: string
  start: {
    dateTime: string
  }
}

export default function CalendarIntegration() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [newEvent, setNewEvent] = useState({ summary: "", start: "", end: "" })
  const [isAddingEvent, setIsAddingEvent] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const accessToken = "YOUR_ACCESS_TOKEN" // In a real app, this would be securely obtained
      const calendarEvents = await getCalendarEvents(accessToken)
      setEvents(calendarEvents as CalendarEvent[])
    } catch (error) {
      console.error("Error fetching calendar events:", error)
    }
  }

  const handleAddEvent = async () => {
    try {
      const accessToken = "YOUR_ACCESS_TOKEN" // In a real app, this would be securely obtained
      const event = {
        summary: newEvent.summary,
        start: {
          dateTime: new Date(newEvent.start).toISOString(),
        },
        end: {
          dateTime: new Date(newEvent.end).toISOString(),
        },
      }
      await addCalendarEvent(accessToken, event)
      setIsAddingEvent(false)
      setNewEvent({ summary: "", start: "", end: "" })
      fetchEvents()
    } catch (error) {
      console.error("Error adding calendar event:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{event.summary}</h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(event.start.dateTime).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="summary">Event Summary</Label>
                <Input
                  id="summary"
                  value={newEvent.summary}
                  onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start">Start Time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">End Time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

