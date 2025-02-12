import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import type { Event } from "@/types"

export default function GroupEvents({ events }: { events: Event[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {event.date}</p>
            <p>Time: {event.time}</p>
            <Button className="mt-2">RSVP</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

