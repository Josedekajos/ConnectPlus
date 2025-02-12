import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import type { File } from "@/types"

export default function GroupFiles({ files }: { files: File[] }) {
  return (
    <div className="space-y-4">
      {files.map((file) => (
        <Card key={file.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              {file.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Size: {file.size}</p>
            <p>Uploaded by: {file.uploadedBy}</p>
            <p>Upload date: {file.uploadDate}</p>
            <Button className="mt-2">Download</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

