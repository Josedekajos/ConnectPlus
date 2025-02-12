"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    setUploading(true)
    setProgress(0)

    // Simulate file upload
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setUploading(false)
    setFiles([])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button variant="outline" as="span">
            <Upload className="mr-2 h-4 w-4" />
            Select Files
          </Button>
        </label>
        <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
          Upload
        </Button>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{file.name}</span>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {uploading && <Progress value={progress} className="w-full" />}
    </div>
  )
}

